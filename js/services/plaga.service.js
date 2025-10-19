/**
 * Servicio de Plagas
 * Gestión completa de plagas con Back4app
 */

const PlagaService = {
  
  // ============ CRUD BÁSICO ============
  
  /**
   * Obtener todas las plagas de un huerto
   * @param {string} huertoId - ID del huerto
   * @param {boolean} incluirResueltas - Si incluir plagas resueltas
   */
  async getAll(huertoId, incluirResueltas = false) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      query.equalTo('huerto', huerto);
      
      // Incluir cultivos afectados
      query.include('cultivosAfectados');
      
      // Filtrar resueltas si no se solicitan
      if (!incluirResueltas) {
        query.notEqualTo('estadoControl', 'resuelta');
      }
      
      query.limit(1000);
      query.descending("fechaDeteccion");
      
      const resultados = await query.find();
      
      return resultados.map(obj => this._parsePlagaObject(obj));
    } catch (error) {
      console.error('Error al obtener plagas:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva plaga
   * @param {string} huertoId - ID del huerto
   * @param {Object} plagaData - Datos de la plaga
   */
  async create(huertoId, plagaData) {
  try {
    console.log('🐛 Creando plaga con datos:', plagaData);
    
    if (!huertoId) throw new Error('Se requiere un huerto');
    
    // Validaciones
    if (!plagaData.tipoPlaga) {
      throw new Error('Debe seleccionar un tipo de plaga');
    }
    
    if (!plagaData.cultivosAfectados || plagaData.cultivosAfectados.length === 0) {
      throw new Error('Debe seleccionar al menos un cultivo afectado');
    }
    
    if (!plagaData.severidad) {
      throw new Error('Debe seleccionar la severidad');
    }

    // Crear objetos Parse
    const HuertoClass = Parse.Object.extend("Huerto");
    const huerto = HuertoClass.createWithoutData(huertoId);

    const PlagaClass = Parse.Object.extend("Plaga");
    const plaga = new PlagaClass();
    
    // Establecer relaciones y campos
    plaga.set('huerto', huerto);
    plaga.set('tipoPlaga', plagaData.tipoPlaga);
    plaga.set('severidad', plagaData.severidad);
    plaga.set('estadoControl', plagaData.estadoControl || 'activa');
    plaga.set('fechaDeteccion', plagaData.fechaDeteccion || new Date());
    plaga.set('notas', plagaData.notas || '');
    plaga.set('tratamientos', plagaData.tratamientos || []);
    
    // IMPORTANTE: cultivosAfectados ya viene como array de Parse Pointers
    // desde PlagasView después de la corrección
    plaga.set('cultivosAfectados', plagaData.cultivosAfectados);

    // Heredar ACL del huerto
    const queryHuerto = new Parse.Query(HuertoClass);
    const huertoObj = await queryHuerto.get(huertoId);
    const acl = huertoObj.getACL();
    plaga.setACL(acl);
    
    // Guardar
    const resultado = await plaga.save();
    
    console.log('✅ Plaga creada exitosamente:', resultado.id);
    
    // Retornar objeto formateado
    return {
      id: resultado.id,
      tipoPlaga: resultado.get('tipoPlaga'),
      cultivosAfectados: resultado.get('cultivosAfectados').map(c => c.id),
      severidad: resultado.get('severidad'),
      estadoControl: resultado.get('estadoControl'),
      fechaDeteccion: resultado.get('fechaDeteccion'),
      notas: resultado.get('notas'),
      tratamientos: resultado.get('tratamientos') || [],
      fechaResolucion: resultado.get('fechaResolucion') || null,
      createdAt: resultado.get('createdAt'),
      updatedAt: resultado.get('updatedAt')
    };
  } catch (error) {
    console.error('Error al crear plaga:', error);
    throw error;
  }
},

  /**
   * Obtener una plaga por ID
   */
  async getById(plagaId) {
    try {
      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      query.include('cultivosAfectados');
      
      const obj = await query.get(plagaId);
      return this._parsePlagaObject(obj);
    } catch (error) {
      console.error('Error al obtener plaga:', error);
      throw error;
    }
  },

  /**
   * Actualizar una plaga
   */
  async update(plagaId, updates) {
    try {
      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      // Actualizar campos permitidos
      if (updates.tipoPlaga !== undefined) plaga.set('tipoPlaga', updates.tipoPlaga);
      if (updates.severidad !== undefined) plaga.set('severidad', updates.severidad);
      if (updates.notas !== undefined) plaga.set('notas', updates.notas);
      if (updates.estadoControl !== undefined) plaga.set('estadoControl', updates.estadoControl);
      
      // Si se actualizan cultivos afectados
      if (updates.cultivosIds) {
        const CultivoClass = Parse.Object.extend("Cultivo");
        const cultivosPointers = updates.cultivosIds.map(id => 
          CultivoClass.createWithoutData(id)
        );
        plaga.set('cultivosAfectados', cultivosPointers);
      }

      await plaga.save();
      console.log('✅ Plaga actualizada:', plagaId);
      
      return await this.getById(plagaId);
    } catch (error) {
      console.error('Error al actualizar plaga:', error);
      throw error;
    }
  },

  /**
   * Eliminar una plaga
   */
  async delete(plagaId) {
    try {
      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);
      
      await plaga.destroy();
      console.log('✅ Plaga eliminada:', plagaId);
    } catch (error) {
      console.error('Error al eliminar plaga:', error);
      throw error;
    }
  },

  // ============ TRATAMIENTOS ============

  /**
   * Añadir un tratamiento a una plaga
   */
  async addTratamiento(plagaId, tratamientoData) {
    try {
      if (!tratamientoData.metodo) throw new Error('El método de tratamiento es requerido');

      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      const estadoActual = plaga.get('estadoControl');
      const tratamientos = plaga.get('tratamientos') || [];

      // Crear objeto de tratamiento
      const nuevoTratamiento = {
        fecha: tratamientoData.fecha || new Date(),
        metodo: tratamientoData.metodo,
        notas: tratamientoData.notas || '',
        mejoraObservada: tratamientoData.mejoraObservada || false
      };

      // Añadir al array
      tratamientos.push(nuevoTratamiento);
      plaga.set('tratamientos', tratamientos);

      // Cambio automático de estado: si está "activa" y es el primer tratamiento
      if (estadoActual === 'activa' && tratamientos.length === 1) {
        plaga.set('estadoControl', 'en_tratamiento');
        console.log('📝 Estado cambiado automáticamente a "en_tratamiento"');
      }

      await plaga.save();
      console.log('✅ Tratamiento añadido a plaga:', plagaId);
      
      return await this.getById(plagaId);
    } catch (error) {
      console.error('Error al añadir tratamiento:', error);
      throw error;
    }
  },

  // ============ CAMBIOS DE ESTADO ============

  /**
   * Cambiar el estado de una plaga
   */
  async cambiarEstado(plagaId, nuevoEstado) {
    try {
      const estadosValidos = ['activa', 'en_tratamiento', 'controlada', 'resuelta'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('Estado no válido');
      }

      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      const plaga = await query.get(plagaId);

      plaga.set('estadoControl', nuevoEstado);

      // Si se marca como resuelta, guardar fecha de resolución
      if (nuevoEstado === 'resuelta') {
        plaga.set('fechaResolucion', new Date());
      } else {
        // Si vuelve a otro estado, limpiar fecha de resolución
        plaga.unset('fechaResolucion');
      }

      await plaga.save();
      console.log('✅ Estado cambiado a:', nuevoEstado);
      
      return await this.getById(plagaId);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  },

  /**
   * Marcar una plaga como controlada
   */
  async marcarControlada(plagaId) {
    return await this.cambiarEstado(plagaId, 'controlada');
  },

  /**
   * Marcar una plaga como resuelta (archivo)
   */
  async marcarResuelta(plagaId) {
    return await this.cambiarEstado(plagaId, 'resuelta');
  },

  // ============ CONSULTAS ESPECIALES ============

  /**
   * Obtener plagas que afectan a un cultivo específico
   */
  async getPlagasByCultivo(cultivoId, incluirResueltas = false) {
    try {
      const CultivoClass = Parse.Object.extend("Cultivo");
      const cultivo = CultivoClass.createWithoutData(cultivoId);

      const PlagaClass = Parse.Object.extend("Plaga");
      const query = new Parse.Query(PlagaClass);
      query.equalTo('cultivosAfectados', cultivo);
      query.include('cultivosAfectados');
      
      if (!incluirResueltas) {
        query.notEqualTo('estadoControl', 'resuelta');
      }
      
      query.descending("fechaDeteccion");
      
      const resultados = await query.find();
      return resultados.map(obj => this._parsePlagaObject(obj));
    } catch (error) {
      console.error('Error al obtener plagas por cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de plagas de un huerto
   */
  async getEstadisticas(huertoId) {
    try {
      const todasLasPlagas = await this.getAll(huertoId, true); // Incluir resueltas

      const stats = {
        total: todasLasPlagas.length,
        activas: todasLasPlagas.filter(p => p.estadoControl === 'activa').length,
        enTratamiento: todasLasPlagas.filter(p => p.estadoControl === 'en_tratamiento').length,
        controladas: todasLasPlagas.filter(p => p.estadoControl === 'controlada').length,
        resueltas: todasLasPlagas.filter(p => p.estadoControl === 'resuelta').length,
        porTipo: {},
        porSeveridad: {
          leve: 0,
          moderada: 0,
          grave: 0
        }
      };

      // Contar por tipo de plaga
      todasLasPlagas.forEach(plaga => {
        stats.porTipo[plaga.tipoPlaga] = (stats.porTipo[plaga.tipoPlaga] || 0) + 1;
        stats.porSeveridad[plaga.severidad] = (stats.porSeveridad[plaga.severidad] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // ============ UTILIDADES ============

  /**
   * Parsear objeto Parse a objeto JavaScript plano
   * @private
   */
  _parsePlagaObject(obj) {
    const cultivosAfectados = obj.get('cultivosAfectados') || [];
    
    return {
      id: obj.id,
      tipoPlaga: obj.get('tipoPlaga') || '',
      fechaDeteccion: obj.get('fechaDeteccion'),
      severidad: obj.get('severidad') || '',
      estadoControl: obj.get('estadoControl') || 'activa',
      notas: obj.get('notas') || '',
      tratamientos: obj.get('tratamientos') || [],
      fechaResolucion: obj.get('fechaResolucion') || null,
      cultivosAfectados: cultivosAfectados.map(c => ({
        id: c.id,
        nombre: c.get('nombre') || '',
        parcela: c.get('parcela') || ''
      })),
      createdAt: obj.get('createdAt'),
      updatedAt: obj.get('updatedAt')
    };
  },

  /**
   * Calcular días desde detección
   */
  diasDesdeDeteccion(plaga) {
    if (!plaga.fechaDeteccion) return 0;
    const ahora = new Date();
    const diff = ahora - plaga.fechaDeteccion;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * Obtener info de catálogo por tipo
   */
  getInfoTipo(tipoPlaga) {
    return window.PLAGAS_MALAGA[tipoPlaga] || window.PLAGAS_MALAGA.otro;
  }
};

// Exportar
window.PlagaService = PlagaService;