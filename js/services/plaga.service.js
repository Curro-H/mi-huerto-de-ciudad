/**
 * Servicio para gestionar plagas del huerto
 * Incluye CRUD completo + edición de información básica
 */

window.PlagaService = {
  /**
   * Crear una nueva plaga
   */
  async create(plagaData) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const plaga = new PlagaClass();

      // Relación con huerto
      const HuertoClass = Parse.Object.extend('Huerto');
      const huertoPointer = HuertoClass.createWithoutData(plagaData.huertoId);
      plaga.set('huerto', huertoPointer);

      // Cultivos afectados (array de pointers)
      const CultivoClass = Parse.Object.extend('Cultivo');
      const cultivosPointers = plagaData.cultivosAfectados.map(id =>
        CultivoClass.createWithoutData(id)
      );
      plaga.set('cultivosAfectados', cultivosPointers);

      // Información básica
      plaga.set('tipoPlaga', plagaData.tipoPlaga);
      plaga.set('severidad', plagaData.severidad);
      plaga.set('notas', plagaData.notas || '');
      plaga.set('estadoControl', 'activa'); // Siempre empieza activa
      plaga.set('fechaDeteccion', new Date());
      plaga.set('tratamientos', []);

      // Heredar ACL del huerto
      const queryHuerto = new Parse.Query(HuertoClass);
      const huertoObj = await queryHuerto.get(plagaData.huertoId);
      const acl = huertoObj.getACL();
      plaga.setACL(acl);

      await plaga.save();
      
      console.log('✅ Plaga creada:', plaga.id);
      return this._parsePlagaObject(plaga);
    } catch (error) {
      console.error('❌ Error al crear plaga:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las plagas de un huerto
   */
  async getAll(huertoId, incluirResueltas = false) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const HuertoClass = Parse.Object.extend('Huerto');
      
      const query = new Parse.Query(PlagaClass);
      const huertoPointer = HuertoClass.createWithoutData(huertoId);
      query.equalTo('huerto', huertoPointer);
      query.include('cultivosAfectados');
      query.descending('createdAt');

      if (!incluirResueltas) {
        query.notEqualTo('estadoControl', 'resuelta');
      }

      const resultados = await query.find();
      return resultados.map(p => this._parsePlagaObject(p));
    } catch (error) {
      console.error('❌ Error al obtener plagas:', error);
      throw error;
    }
  },

  /**
   * Obtener una plaga por ID
   */
  async getById(plagaId) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const query = new Parse.Query(PlagaClass);
      query.include('cultivosAfectados');
      
      const plaga = await query.get(plagaId);
      return this._parsePlagaObject(plaga);
    } catch (error) {
      console.error('❌ Error al obtener plaga:', error);
      throw error;
    }
  },

  /**
   * NUEVO: Editar información básica de una plaga
   */
  async editarPlaga(plagaId, datosActualizados) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      // Actualizar tipo de plaga si cambió
      if (datosActualizados.tipoPlaga !== undefined) {
        plaga.set('tipoPlaga', datosActualizados.tipoPlaga);
      }

      // Actualizar cultivos afectados si cambió
      if (datosActualizados.cultivosAfectados !== undefined) {
        const CultivoClass = Parse.Object.extend('Cultivo');
        const cultivosPointers = datosActualizados.cultivosAfectados.map(id =>
          CultivoClass.createWithoutData(id)
        );
        plaga.set('cultivosAfectados', cultivosPointers);
      }

      // Actualizar severidad si cambió
      if (datosActualizados.severidad !== undefined) {
        plaga.set('severidad', datosActualizados.severidad);
      }

      // Actualizar notas si cambió
      if (datosActualizados.notas !== undefined) {
        plaga.set('notas', datosActualizados.notas);
      }

      await plaga.save();
      
      console.log('✅ Plaga editada:', plagaId);
      return this._parsePlagaObject(plaga);
    } catch (error) {
      console.error('❌ Error al editar plaga:', error);
      throw error;
    }
  },

  /**
   * Añadir un tratamiento a una plaga
   */
  async addTratamiento(plagaId, tratamientoData) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      const tratamientos = plaga.get('tratamientos') || [];
      
      const nuevoTratamiento = {
        fecha: new Date(),
        metodo: tratamientoData.metodo,
        notas: tratamientoData.notas || '',
        mejoraObservada: tratamientoData.mejoraObservada || false
      };

      tratamientos.push(nuevoTratamiento);
      plaga.set('tratamientos', tratamientos);

      // Si es el primer tratamiento, cambiar estado a "en_tratamiento"
      if (tratamientos.length === 1 && plaga.get('estadoControl') === 'activa') {
        plaga.set('estadoControl', 'en_tratamiento');
        console.log('🔄 Estado cambiado automáticamente a "en_tratamiento"');
      }

      await plaga.save();
      
      console.log('✅ Tratamiento añadido a plaga:', plagaId);
      return this._parsePlagaObject(plaga);
    } catch (error) {
      console.error('❌ Error al añadir tratamiento:', error);
      throw error;
    }
  },

  /**
   * Cambiar el estado de control de una plaga
   */
  async cambiarEstado(plagaId, nuevoEstado) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    const estadosValidos = ['activa', 'en_tratamiento', 'controlada', 'resuelta'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      plaga.set('estadoControl', nuevoEstado);

      // Si se marca como resuelta, guardar fecha de resolución
      if (nuevoEstado === 'resuelta') {
        plaga.set('fechaResolucion', new Date());
      }

      await plaga.save();
      
      console.log(`✅ Estado de plaga cambiado a: ${nuevoEstado}`);
      return this._parsePlagaObject(plaga);
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      throw error;
    }
  },

  /**
   * Marcar plaga como controlada
   */
  async marcarControlada(plagaId) {
    return this.cambiarEstado(plagaId, 'controlada');
  },

  /**
   * Marcar plaga como resuelta (archivo)
   */
  async marcarResuelta(plagaId) {
    return this.cambiarEstado(plagaId, 'resuelta');
  },

  /**
   * Eliminar una plaga
   */
  async delete(plagaId) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);
      
      await plaga.destroy();
      
      console.log('✅ Plaga eliminada:', plagaId);
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar plaga:', error);
      throw error;
    }
  },

  /**
   * Obtener plagas que afectan a un cultivo específico
   */
  async getPlagasByCultivo(cultivoId) {
    const user = Parse.User.current();
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const PlagaClass = Parse.Object.extend('Plaga');
      const CultivoClass = Parse.Object.extend('Cultivo');
      
      const query = new Parse.Query(PlagaClass);
      const cultivoPointer = CultivoClass.createWithoutData(cultivoId);
      query.equalTo('cultivosAfectados', cultivoPointer);
      query.notEqualTo('estadoControl', 'resuelta');
      query.include('cultivosAfectados');
      
      const resultados = await query.find();
      return resultados.map(p => this._parsePlagaObject(p));
    } catch (error) {
      console.error('❌ Error al obtener plagas por cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de plagas del huerto
   */
  async getEstadisticas(huertoId) {
    const plagas = await this.getAll(huertoId, false);
    
    return {
      activas: plagas.filter(p => p.estadoControl === 'activa').length,
      enTratamiento: plagas.filter(p => p.estadoControl === 'en_tratamiento').length,
      controladas: plagas.filter(p => p.estadoControl === 'controlada').length,
      total: plagas.length
    };
  },

  /**
   * Calcular días desde la detección
   */
  diasDesdeDeteccion(fechaDeteccion) {
    const ahora = new Date();
    const deteccion = new Date(fechaDeteccion);
    const diferencia = ahora - deteccion;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  },

  /**
   * Obtener información de un tipo de plaga del catálogo
   */
  getInfoTipo(tipoPlaga) {
    if (!window.PLAGAS_MALAGA) {
      console.warn('⚠️ Catálogo de plagas no cargado');
      return null;
    }
    return window.PLAGAS_MALAGA[tipoPlaga] || null;
  },

  /**
   * Parser interno: Convertir objeto Parse a objeto JS
   */
  _parsePlagaObject(plagaObj) {
    const cultivosAfectados = plagaObj.get('cultivosAfectados') || [];
    
    return {
      id: plagaObj.id,
      tipoPlaga: plagaObj.get('tipoPlaga'),
      cultivosAfectados: cultivosAfectados.map(c => ({
        id: c.id,
        nombre: c.get('nombre')
      })),
      severidad: plagaObj.get('severidad'),
      estadoControl: plagaObj.get('estadoControl'),
      notas: plagaObj.get('notas') || '',
      fechaDeteccion: plagaObj.get('fechaDeteccion'),
      fechaResolucion: plagaObj.get('fechaResolucion') || null,
      tratamientos: plagaObj.get('tratamientos') || [],
      createdAt: plagaObj.createdAt,
      updatedAt: plagaObj.updatedAt
    };
  }
};

console.log('✅ PlagaService cargado (con edición)');