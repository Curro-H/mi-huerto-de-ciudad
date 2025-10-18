/**
 * Servicio de Tareas - Actualizado con Huertos
 * Gestión de tareas con Back4app filtrado por huerto
 */

const TareaService = {
  // Obtener todas las tareas de un huerto
  async getAll(huertoId) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const TareaClass = Parse.Object.extend("Tarea");
      const query = new Parse.Query(TareaClass);
      query.equalTo('huerto', huerto);
      query.limit(1000);
      query.descending("createdAt");
      
      const resultados = await query.find();
      
      return resultados.map(obj => ({
        id: obj.id,
        descripcion: obj.get('descripcion') || '',
        prioridad: obj.get('prioridad') || 'media',
        completada: obj.get('completada') || false,
        fechaLimite: obj.get('fechaLimite') || null,
        createdAt: obj.get('createdAt'),
        updatedAt: obj.get('updatedAt')
      }));
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw error;
    }
  },

  // Crear una nueva tarea
  async create(huertoId, tareaData) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      // Validar datos
      const { isValid, errors } = window.helpers.validateTarea(tareaData);
      if (!isValid) {
        throw new Error(Object.values(errors).join(', '));
      }

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const TareaClass = Parse.Object.extend("Tarea");
      const tarea = new TareaClass();
      
      tarea.set('huerto', huerto);
      tarea.set('descripcion', tareaData.descripcion);
      tarea.set('prioridad', tareaData.prioridad || 'media');
      tarea.set('completada', tareaData.completada || false);
      tarea.set('fechaLimite', tareaData.fechaLimite || null);

      // Heredar ACL del huerto
      const queryHuerto = new Parse.Query(HuertoClass);
      const huertoObj = await queryHuerto.get(huertoId);
      const acl = huertoObj.getACL();
      tarea.setACL(acl);
      
      const resultado = await tarea.save();
      
      return {
        id: resultado.id,
        ...tareaData,
        completada: tareaData.completada || false,
        createdAt: resultado.get('createdAt'),
        updatedAt: resultado.get('updatedAt')
      };
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  },

  // Actualizar una tarea
  async update(id, updates) {
    try {
      const TareaClass = Parse.Object.extend("Tarea");
      const query = new Parse.Query(TareaClass);
      const tarea = await query.get(id);
      
      // Actualizar solo los campos proporcionados
      if (updates.descripcion !== undefined) tarea.set('descripcion', updates.descripcion);
      if (updates.prioridad !== undefined) tarea.set('prioridad', updates.prioridad);
      if (updates.completada !== undefined) tarea.set('completada', updates.completada);
      if (updates.fechaLimite !== undefined) tarea.set('fechaLimite', updates.fechaLimite);
      
      await tarea.save();
      
      return {
        id: tarea.id,
        descripcion: tarea.get('descripcion'),
        prioridad: tarea.get('prioridad'),
        completada: tarea.get('completada'),
        fechaLimite: tarea.get('fechaLimite'),
        updatedAt: tarea.get('updatedAt')
      };
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw error;
    }
  },

  // Cambiar estado de completada
  async toggleCompletada(id) {
    try {
      const TareaClass = Parse.Object.extend("Tarea");
      const query = new Parse.Query(TareaClass);
      const tarea = await query.get(id);
      
      const completada = !tarea.get('completada');
      tarea.set('completada', completada);
      
      await tarea.save();
      
      return {
        id: tarea.id,
        completada
      };
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error);
      throw error;
    }
  },

  // Eliminar una tarea
  async delete(id) {
    try {
      const TareaClass = Parse.Object.extend("Tarea");
      const query = new Parse.Query(TareaClass);
      const tarea = await query.get(id);
      await tarea.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
  },

  // Eliminar tareas completadas de un huerto
  async deleteCompleted(huertoId) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const TareaClass = Parse.Object.extend("Tarea");
      const query = new Parse.Query(TareaClass);
      query.equalTo('huerto', huerto);
      query.equalTo('completada', true);
      
      const tareas = await query.find();
      await Parse.Object.destroyAll(tareas);
      
      return tareas.length;
    } catch (error) {
      console.error('Error al eliminar tareas completadas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de un huerto
  async getStats(huertoId) {
    try {
      const tareas = await this.getAll(huertoId);
      
      const completadas = tareas.filter(t => t.completada).length;
      const pendientes = tareas.length - completadas;
      
      const porPrioridad = tareas.reduce((acc, t) => {
        if (!t.completada) {
          acc[t.prioridad] = (acc[t.prioridad] || 0) + 1;
        }
        return acc;
      }, {});
      
      return {
        total: tareas.length,
        completadas,
        pendientes,
        porPrioridad
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

// Exportar
window.TareaService = TareaService;