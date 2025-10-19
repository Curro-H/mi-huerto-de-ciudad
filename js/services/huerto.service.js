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

  // Invitar colaborador por email - CON CLOUD FUNCTION
  // Invitar colaborador por email
async invitarColaborador(huertoId, emailColaborador) {
  try {
    console.log('=== INICIO invitarColaborador ===');
    const user = Parse.User.current();
    console.log('1. HuertoId:', huertoId);
    console.log('2. Email colaborador:', emailColaborador);
    
    if (!user) throw new Error('Usuario no autenticado');
    console.log('3. Usuario actual:', user.id);

    // Buscar el huerto
    console.log('4. Buscando huerto...');
    const HuertoClass = Parse.Object.extend("Huerto");
    const queryHuerto = new Parse.Query(HuertoClass);
    queryHuerto.include('colaboradores');
    const huerto = await queryHuerto.get(huertoId);
    
    console.log('5. Huerto encontrado:', huerto.id);
    console.log('6. Dueño del huerto:', huerto.get('dueno').id);
    
    // Verificar que es el dueño
    if (huerto.get('dueno').id !== user.id) {
      throw new Error('Solo el dueño puede invitar colaboradores');
    }
    console.log('7. Verificación de dueño: OK');

    // Verificar que no se está agregando a sí mismo
    if (user.get('email') === emailColaborador) {
      throw new Error('No puedes agregarte a ti mismo como colaborador');
    }

    console.log('8. Ejecutando Cloud Function...');
    
    // Buscar usuario con Cloud Function
    const resultado = await Parse.Cloud.run('buscarUsuarioPorEmail', { 
      email: emailColaborador 
    });
    
    console.log('9. Cloud Function exitosa, resultado:', resultado);

    // ✅ AQUÍ ESTÁ EL CAMBIO CLAVE:
    // No intentar hacer .get(), usar directamente createWithoutData
    const colaboradorId = resultado.objectId || resultado.id;
    console.log('10. ID del colaborador:', colaboradorId);

    // Crear pointer al usuario usando solo el ID
    const colaborador = Parse.User.createWithoutData(colaboradorId);
    console.log('11. Pointer creado para colaborador');

    // Verificar que no esté ya agregado
    const colaboradores = huerto.get('colaboradores') || [];
    const yaExiste = colaboradores.some(c => c.id === colaboradorId);
    
    if (yaExiste) {
      throw new Error('Este usuario ya es colaborador del huerto');
    }
    console.log('12. Usuario no está duplicado, continuando...');

    // Agregar colaborador
    huerto.addUnique('colaboradores', colaborador);
    console.log('13. Colaborador agregado al array');
    
    // Actualizar ACL para dar permisos al colaborador
    const acl = huerto.getACL() || new Parse.ACL(user);
    acl.setReadAccess(colaboradorId, true);
    acl.setWriteAccess(colaboradorId, true);
    huerto.setACL(acl);
    console.log('14. ACL actualizado');
    
    await huerto.save();
    console.log('15. Huerto guardado exitosamente');

    // Retornar la info del colaborador
    return {
      id: colaboradorId,
      nombre: resultado.nombre,
      email: resultado.email
    };
  } catch (error) {
    console.error('❌ Error en invitarColaborador:', error);
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
  },

  // Método de debug para listar todos los usuarios - VERSION SIMPLE
  async debugListarUsuarios() {
    try {
      console.log('=== DEBUG: LISTANDO USUARIOS ===');
      console.log('Intentando con query directa...');
      
      const query = new Parse.Query(Parse.User);
      query.limit(100);
      
      let usuarios;
      try {
        usuarios = await query.find();
        console.log(`✅ Query ejecutada exitosamente`);
        console.log(`Total de usuarios encontrados: ${usuarios.length}`);
      } catch (queryError) {
        console.error('❌ Error en query:', queryError);
        console.error('Tipo:', queryError.constructor.name);
        console.error('Mensaje:', queryError.message);
        console.error('Code:', queryError.code);
        
        // Mensaje más claro del problema
        if (queryError.message && queryError.message.includes('not allowed')) {
          console.error('\n⚠️ PROBLEMA DE PERMISOS ⚠️');
          console.error('Los permisos de Find en la clase _User no están configurados correctamente.');
          console.error('Ve a Back4app → Core → Browser → User → More → Security');
          console.error('Marca: Find → requiresAuthentication');
        }
        
        return [];
      }
      
      if (usuarios.length === 0) {
        console.log('⚠️ No se encontraron usuarios (la query funcionó pero retornó 0 resultados)');
        return [];
      }
      
      console.log('\n=== LISTA DE USUARIOS ===');
      usuarios.forEach((u, index) => {
        console.log(`\n👤 Usuario ${index + 1}:`);
        console.log('  🆔 ObjectId:', u.id);
        console.log('  📧 Username:', u.get('username'));
        console.log('  ✉️  Email:', u.get('email'));
        console.log('  👤 Nombre:', u.get('nombre'));
        console.log('  📅 Creado:', u.get('createdAt'));
      });
      console.log('\n=== FIN LISTA ===\n');
      
      return usuarios.map(u => ({
        id: u.id,
        username: u.get('username'),
        email: u.get('email'),
        nombre: u.get('nombre')
      }));
    } catch (error) {
      console.error('❌ Error general listando usuarios:', error);
      return [];
    }
  }
};

// Exportar
window.HuertoService = HuertoService;