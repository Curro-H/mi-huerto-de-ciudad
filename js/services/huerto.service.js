/**
 * Servicio de Huertos
 * Gestión de huertos y colaboradores
 */

const HuertoService = {
  // Crear nuevo huerto
  async create(huertoData) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const { nombre, ciudad } = huertoData;
      
      if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre del huerto es requerido');
      }
      if (!ciudad || ciudad.trim() === '') {
        throw new Error('La ciudad es requerida');
      }

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = new HuertoClass();
      
      huerto.set('nombre', nombre);
      huerto.set('ciudad', ciudad);
      huerto.set('dueno', user);
      huerto.set('colaboradores', []);
      
      // ACL: El dueño tiene todos los permisos
      const acl = new Parse.ACL(user);
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      huerto.setACL(acl);
      
      const resultado = await huerto.save();
      
      return {
        id: resultado.id,
        nombre: resultado.get('nombre'),
        ciudad: resultado.get('ciudad'),
        esDueno: true,
        colaboradores: []
      };
    } catch (error) {
      console.error('Error al crear huerto:', error);
      throw error;
    }
  },

  // Obtener huertos del usuario (como dueño o colaborador)
  async getMisHuertos() {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const HuertoClass = Parse.Object.extend("Huerto");
      
      // Huertos donde soy dueño
      const queryDueno = new Parse.Query(HuertoClass);
      queryDueno.equalTo('dueno', user);
      
      // Huertos donde soy colaborador
      const queryColaborador = new Parse.Query(HuertoClass);
      queryColaborador.equalTo('colaboradores', user);
      
      // Combinar queries
      const mainQuery = Parse.Query.or(queryDueno, queryColaborador);
      mainQuery.include('dueno');
      mainQuery.descending('createdAt');
      
      const resultados = await mainQuery.find();
      
      return resultados.map(h => ({
        id: h.id,
        nombre: h.get('nombre'),
        ciudad: h.get('ciudad'),
        esDueno: h.get('dueno').id === user.id,
        duenoNombre: h.get('dueno').get('nombre'),
        colaboradores: h.get('colaboradores') || []
      }));
    } catch (error) {
      console.error('Error al obtener huertos:', error);
      throw error;
    }
  },

  // Obtener detalles de un huerto
  async getById(huertoId) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const HuertoClass = Parse.Object.extend("Huerto");
      const query = new Parse.Query(HuertoClass);
      query.include('dueno');
      query.include('colaboradores');
      
      const huerto = await query.get(huertoId);
      
      const colaboradores = huerto.get('colaboradores') || [];
      
      return {
        id: huerto.id,
        nombre: huerto.get('nombre'),
        ciudad: huerto.get('ciudad'),
        esDueno: huerto.get('dueno').id === user.id,
        duenoId: huerto.get('dueno').id,
        duenoNombre: huerto.get('dueno').get('nombre'),
        duenoEmail: huerto.get('dueno').get('email'),
        colaboradores: colaboradores.map(c => ({
          id: c.id,
          nombre: c.get('nombre'),
          email: c.get('email')
        }))
      };
    } catch (error) {
      console.error('Error al obtener huerto:', error);
      throw error;
    }
  },

  // Actualizar huerto
  async update(huertoId, updates) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const HuertoClass = Parse.Object.extend("Huerto");
      const query = new Parse.Query(HuertoClass);
      const huerto = await query.get(huertoId);
      
      // Verificar que es el dueño
      if (huerto.get('dueno').id !== user.id) {
        throw new Error('Solo el dueño puede actualizar el huerto');
      }
      
      if (updates.nombre) huerto.set('nombre', updates.nombre);
      if (updates.ciudad) huerto.set('ciudad', updates.ciudad);
      
      await huerto.save();
      
      return {
        id: huerto.id,
        nombre: huerto.get('nombre'),
        ciudad: huerto.get('ciudad')
      };
    } catch (error) {
      console.error('Error al actualizar huerto:', error);
      throw error;
    }
  },

  // Eliminar huerto
  async delete(huertoId) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const HuertoClass = Parse.Object.extend("Huerto");
      const query = new Parse.Query(HuertoClass);
      const huerto = await query.get(huertoId);
      
      // Verificar que es el dueño
      if (huerto.get('dueno').id !== user.id) {
        throw new Error('Solo el dueño puede eliminar el huerto');
      }
      
      await huerto.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar huerto:', error);
      throw error;
    }
  },

  // Invitar colaborador por email
  async invitarColaborador(huertoId, emailColaborador) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      // Buscar el huerto
      const HuertoClass = Parse.Object.extend("Huerto");
      const queryHuerto = new Parse.Query(HuertoClass);
      queryHuerto.include('colaboradores');
      const huerto = await queryHuerto.get(huertoId);
      
      // Verificar que es el dueño
      if (huerto.get('dueno').id !== user.id) {
        throw new Error('Solo el dueño puede invitar colaboradores');
      }

      // Buscar usuario por email
      const queryUser = new Parse.Query(Parse.User);
      queryUser.equalTo('email', emailColaborador);
      const colaborador = await queryUser.first();
      
      if (!colaborador) {
        throw new Error('No se encontró un usuario con ese email');
      }

      if (colaborador.id === user.id) {
        throw new Error('No puedes agregarte a ti mismo como colaborador');
      }

      // Verificar que no esté ya agregado
      const colaboradores = huerto.get('colaboradores') || [];
      const yaExiste = colaboradores.some(c => c.id === colaborador.id);
      
      if (yaExiste) {
        throw new Error('Este usuario ya es colaborador del huerto');
      }

      // Agregar colaborador
      huerto.addUnique('colaboradores', colaborador);
      
      // Actualizar ACL para dar permisos al colaborador
      const acl = huerto.getACL();
      acl.setReadAccess(colaborador.id, true);
      acl.setWriteAccess(colaborador.id, true);
      huerto.setACL(acl);
      
      await huerto.save();

      return {
        id: colaborador.id,
        nombre: colaborador.get('nombre'),
        email: colaborador.get('email')
      };
    } catch (error) {
      console.error('Error al invitar colaborador:', error);
      throw error;
    }
  },

  // Quitar colaborador
  async quitarColaborador(huertoId, colaboradorId) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      const HuertoClass = Parse.Object.extend("Huerto");
      const query = new Parse.Query(HuertoClass);
      query.include('colaboradores');
      const huerto = await query.get(huertoId);
      
      // Verificar que es el dueño
      if (huerto.get('dueno').id !== user.id) {
        throw new Error('Solo el dueño puede quitar colaboradores');
      }

      const colaboradores = huerto.get('colaboradores') || [];
      const colaboradorAQuitar = colaboradores.find(c => c.id === colaboradorId);
      
      if (!colaboradorAQuitar) {
        throw new Error('El colaborador no existe en este huerto');
      }

      // Quitar del array
      huerto.remove('colaboradores', colaboradorAQuitar);
      
      // Actualizar ACL para quitar permisos
      const acl = huerto.getACL();
      acl.setReadAccess(colaboradorId, false);
      acl.setWriteAccess(colaboradorId, false);
      huerto.setACL(acl);
      
      await huerto.save();
      
      return true;
    } catch (error) {
      console.error('Error al quitar colaborador:', error);
      throw error;
    }
  },

  // Verificar permisos de escritura
  async tienePermisoEscritura(huertoId) {
    try {
      const user = Parse.User.current();
      if (!user) return false;

      const HuertoClass = Parse.Object.extend("Huerto");
      const query = new Parse.Query(HuertoClass);
      const huerto = await query.get(huertoId);
      
      // Es dueño o colaborador
      const esDueno = huerto.get('dueno').id === user.id;
      const colaboradores = huerto.get('colaboradores') || [];
      const esColaborador = colaboradores.some(c => c.id === user.id);
      
      return esDueno || esColaborador;
    } catch (error) {
      return false;
    }
  }
};

// Exportar
window.HuertoService = HuertoService;
