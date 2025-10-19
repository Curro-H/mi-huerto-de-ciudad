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
      queryDueno.include('dueno');
      
      // Huertos donde soy colaborador
      const queryColaborador = new Parse.Query(HuertoClass);
      queryColaborador.equalTo('colaboradores', user);
      queryColaborador.include('dueno');
      
      // Combinar queries
      const mainQuery = Parse.Query.or(queryDueno, queryColaborador);
      mainQuery.descending('createdAt');
      
      const resultados = await mainQuery.find();
      
      return resultados.map(h => {
        const dueno = h.get('dueno');
        
        if (!dueno) {
          console.error('Huerto sin dueño:', h.id);
          return null;
        }
        
        return {
          id: h.id,
          nombre: h.get('nombre'),
          ciudad: h.get('ciudad'),
          esDueno: dueno.id === user.id,
          duenoNombre: dueno.get('nombre') || 'Desconocido',
          colaboradores: h.get('colaboradores') || []
        };
      }).filter(h => h !== null);
      
    } catch (error) {
      console.error('Error al obtener huertos:', error);
      throw error;
    }
  },

  // Obtener detalles de un huerto (usando Cloud Function)
  async getById(huertoId) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('Usuario no autenticado');

      // Usar Cloud Function para obtener todos los detalles
      const detalles = await Parse.Cloud.run('obtenerDetallesHuerto', { 
        huertoId: huertoId 
      });
      
      return detalles;
    } catch (error) {
      console.error('Error al obtener huerto:', error);
      throw error;
    }
  },

  // Actualizar huerto (solo dueño)
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

  // Eliminar huerto (solo dueño)
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

  // Invitar colaborador por email (dueño O colaborador pueden invitar)
 // Invitar colaborador por email - VERSIÓN FINAL CORREGIDA
async invitarColaborador(huertoId, emailColaborador) {
  try {
    console.log('=== INICIO invitarColaborador ===');
    console.log('1. HuertoId:', huertoId);
    console.log('2. Email colaborador:', emailColaborador);
    
    const user = Parse.User.current();
    console.log('3. Usuario actual:', user ? user.id : 'NO HAY USUARIO');
    
    if (!user) throw new Error('Usuario no autenticado');

    // Buscar el huerto
    console.log('4. Buscando huerto...');
    const HuertoClass = Parse.Object.extend("Huerto");
    const queryHuerto = new Parse.Query(HuertoClass);
    const huerto = await queryHuerto.get(huertoId);
    console.log('5. Huerto encontrado:', huerto.id);
    console.log('6. Dueño del huerto:', huerto.get('dueno').id);
    
    // Verificar que es el dueño
    if (huerto.get('dueno').id !== user.id) {
      throw new Error('Solo el dueño puede invitar colaboradores');
    }
    console.log('7. Verificación de dueño: OK');

    // Buscar usuario
    console.log('8. Preparando búsqueda de usuario...');
    const emailNormalizado = emailColaborador.toLowerCase().trim();
    console.log('9. Email normalizado:', emailNormalizado);
    
    // Usar Cloud Function para buscar usuario
    console.log('10. Intentando con Cloud Function buscarUsuarioPorEmail...');
    let resultadoBusqueda;
    try {
      resultadoBusqueda = await Parse.Cloud.run('buscarUsuarioPorEmail', {
        email: emailNormalizado
      });
      
      console.log('11. Cloud Function ejecutada exitosamente');
      console.log('12. Resultado:', resultadoBusqueda);
    } catch (cloudError) {
      console.log('11. Cloud Function falló:', cloudError.message);
      throw new Error('No se encontró un usuario registrado con ese email. El usuario debe crear una cuenta primero.');
    }
    
    if (!resultadoBusqueda) {
      console.log('13. Cloud Function retornó null');
      throw new Error('No se encontró un usuario registrado con ese email.');
    }

    console.log('13. Usuario encontrado con Cloud Function');
    const colaboradorId = resultadoBusqueda.objectId || resultadoBusqueda.id;
    console.log('14. ID del colaborador:', colaboradorId);

    // Crear pointer del colaborador
    const colaborador = Parse.User.createWithoutData(colaboradorId);
    colaborador.id = colaboradorId;

    console.log('20. Verificando que no sea el mismo usuario...');
    if (colaboradorId === user.id) {
      throw new Error('No puedes agregarte a ti mismo como colaborador');
    }
    console.log('21. Verificación: OK, no es el mismo usuario');

    // Verificar que no esté ya agregado
    console.log('22. Verificando colaboradores existentes...');
    const colaboradores = huerto.get('colaboradores') || [];
    console.log('23. Número de colaboradores actuales:', colaboradores.length);
    const yaExiste = colaboradores.some(c => c.id === colaboradorId);
    console.log('24. ¿Ya existe?:', yaExiste);
    
    if (yaExiste) {
      throw new Error('Este usuario ya es colaborador del huerto');
    }

    // Agregar colaborador
    console.log('25. Agregando colaborador al huerto...');
    huerto.addUnique('colaboradores', colaborador);
    
    // Actualizar ACL del huerto
    console.log('26. Actualizando ACL del huerto...');
    const acl = huerto.getACL();
    console.log('27. ACL actual obtenido');
    acl.setReadAccess(colaboradorId, true);
    acl.setWriteAccess(colaboradorId, true);
    huerto.setACL(acl);
    console.log('28. ACL del huerto actualizado en memoria');
    
    console.log('29. Guardando huerto...');
    await huerto.save();
    console.log('30. Huerto guardado exitosamente');

    // Actualizar ACL de todos los cultivos del huerto
    console.log('31. Actualizando ACL de cultivos existentes...');
    try {
      const CultivoClass = Parse.Object.extend("Cultivo");
      const queryCultivos = new Parse.Query(CultivoClass);
      queryCultivos.equalTo('huerto', huerto);
      queryCultivos.limit(1000);
      const cultivos = await queryCultivos.find();
      
      console.log(`32. Encontrados ${cultivos.length} cultivos para actualizar`);
      
      for (const cultivo of cultivos) {
        const cultivoACL = cultivo.getACL();
        if (cultivoACL) {
          cultivoACL.setReadAccess(colaboradorId, true);
          cultivoACL.setWriteAccess(colaboradorId, true);
          cultivo.setACL(cultivoACL);
        }
      }
      
      if (cultivos.length > 0) {
        await Parse.Object.saveAll(cultivos);
        console.log('33. ACL de cultivos actualizados correctamente');
      }
    } catch (cultivoError) {
      console.error('Error al actualizar ACL de cultivos:', cultivoError);
      // No lanzar error, continuar con las tareas
    }

    // Actualizar ACL de todas las tareas del huerto
    console.log('34. Actualizando ACL de tareas existentes...');
    try {
      const TareaClass = Parse.Object.extend("Tarea");
      const queryTareas = new Parse.Query(TareaClass);
      queryTareas.equalTo('huerto', huerto);
      queryTareas.limit(1000);
      const tareas = await queryTareas.find();
      
      console.log(`35. Encontradas ${tareas.length} tareas para actualizar`);
      
      for (const tarea of tareas) {
        const tareaACL = tarea.getACL();
        if (tareaACL) {
          tareaACL.setReadAccess(colaboradorId, true);
          tareaACL.setWriteAccess(colaboradorId, true);
          tarea.setACL(tareaACL);
        }
      }
      
      if (tareas.length > 0) {
        await Parse.Object.saveAll(tareas);
        console.log('36. ACL de tareas actualizados correctamente');
      }
    } catch (tareaError) {
      console.error('Error al actualizar ACL de tareas:', tareaError);
      // No lanzar error
    }

    // Preparar objeto de retorno
    const datosColaborador = {
      id: colaboradorId,
      nombre: resultadoBusqueda.nombre || 'Usuario',
      email: resultadoBusqueda.email || emailNormalizado
    };
    
    console.log('37. Resultado final:', datosColaborador);
    console.log('=== FIN invitarColaborador - ÉXITO ===');
    
    return datosColaborador;
  } catch (error) {
    console.error('=== ERROR en invitarColaborador ===');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== FIN ERROR ===');
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