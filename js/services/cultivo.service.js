/**
 * Servicio de Cultivos - Actualizado con Huertos
 * Gestión de datos con Back4app filtrado por huerto
 */

const CultivoService = {
  // Obtener todos los cultivos de un huerto
  async getAll(huertoId) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const CultivoClass = Parse.Object.extend("Cultivo");
      const query = new Parse.Query(CultivoClass);
      query.equalTo('huerto', huerto);
      query.limit(1000);
      query.descending("createdAt");
      
      const resultados = await query.find();
      
      return resultados.map(obj => ({
        id: obj.id,
        nombre: obj.get('nombre') || '',
        parcela: obj.get('parcela') || '',
        fechaSiembra: obj.get('fechaSiembra') || '',
        estado: obj.get('estado') || 'creciendo',
        riego: obj.get('riego') || 'moderado',
        notas: obj.get('notas') || '',
        createdAt: obj.get('createdAt'),
        updatedAt: obj.get('updatedAt')
      }));
    } catch (error) {
      console.error('Error al obtener cultivos:', error);
      throw error;
    }
  },

  // Crear un nuevo cultivo
  async create(huertoId, cultivoData) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      // Validar datos
      const { isValid, errors } = window.helpers.validateCultivo(cultivoData);
      if (!isValid) {
        throw new Error(Object.values(errors).join(', '));
      }

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const CultivoClass = Parse.Object.extend("Cultivo");
      const cultivo = new CultivoClass();
      
      cultivo.set('huerto', huerto);
      cultivo.set('nombre', cultivoData.nombre);
      cultivo.set('parcela', cultivoData.parcela);
      cultivo.set('fechaSiembra', cultivoData.fechaSiembra);
      cultivo.set('estado', cultivoData.estado || 'creciendo');
      cultivo.set('riego', cultivoData.riego || 'moderado');
      cultivo.set('notas', cultivoData.notas || '');

      // Heredar ACL del huerto
      const queryHuerto = new Parse.Query(HuertoClass);
      const huertoObj = await queryHuerto.get(huertoId);
      const acl = huertoObj.getACL();
      cultivo.setACL(acl);
      
      const resultado = await cultivo.save();
      
      return {
        id: resultado.id,
        ...cultivoData,
        createdAt: resultado.get('createdAt'),
        updatedAt: resultado.get('updatedAt')
      };
    } catch (error) {
      console.error('Error al crear cultivo:', error);
      throw error;
    }
  },

  // Actualizar un cultivo
  async update(id, updates) {
    try {
      const CultivoClass = Parse.Object.extend("Cultivo");
      const query = new Parse.Query(CultivoClass);
      const cultivo = await query.get(id);
      
      // Actualizar solo los campos proporcionados
      if (updates.nombre !== undefined) cultivo.set('nombre', updates.nombre);
      if (updates.parcela !== undefined) cultivo.set('parcela', updates.parcela);
      if (updates.fechaSiembra !== undefined) cultivo.set('fechaSiembra', updates.fechaSiembra);
      if (updates.estado !== undefined) cultivo.set('estado', updates.estado);
      if (updates.riego !== undefined) cultivo.set('riego', updates.riego);
      if (updates.notas !== undefined) cultivo.set('notas', updates.notas);
      
      await cultivo.save();
      
      return {
        id: cultivo.id,
        nombre: cultivo.get('nombre'),
        parcela: cultivo.get('parcela'),
        fechaSiembra: cultivo.get('fechaSiembra'),
        estado: cultivo.get('estado'),
        riego: cultivo.get('riego'),
        notas: cultivo.get('notas'),
        updatedAt: cultivo.get('updatedAt')
      };
    } catch (error) {
      console.error('Error al actualizar cultivo:', error);
      throw error;
    }
  },

  // Eliminar un cultivo
  async delete(id) {
    try {
      const CultivoClass = Parse.Object.extend("Cultivo");
      const query = new Parse.Query(CultivoClass);
      const cultivo = await query.get(id);
      await cultivo.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar cultivo:', error);
      throw error;
    }
  },

  // Buscar cultivos en un huerto
  async search(huertoId, searchTerm) {
    try {
      if (!huertoId) throw new Error('Se requiere un huerto');

      const HuertoClass = Parse.Object.extend("Huerto");
      const huerto = HuertoClass.createWithoutData(huertoId);

      const CultivoClass = Parse.Object.extend("Cultivo");
      
      const queryNombre = new Parse.Query(CultivoClass);
      queryNombre.equalTo('huerto', huerto);
      queryNombre.matches('nombre', searchTerm, 'i');
      
      const queryParcela = new Parse.Query(CultivoClass);
      queryParcela.equalTo('huerto', huerto);
      queryParcela.matches('parcela', searchTerm, 'i');
      
      const mainQuery = Parse.Query.or(queryNombre, queryParcela);
      mainQuery.limit(1000);
      
      const resultados = await mainQuery.find();
      
      return resultados.map(obj => ({
        id: obj.id,
        nombre: obj.get('nombre'),
        parcela: obj.get('parcela'),
        fechaSiembra: obj.get('fechaSiembra'),
        estado: obj.get('estado'),
        riego: obj.get('riego'),
        notas: obj.get('notas')
      }));
    } catch (error) {
      console.error('Error al buscar cultivos:', error);
      throw error;
    }
  },

  // Obtener estadísticas de un huerto
  async getStats(huertoId) {
    try {
      const cultivos = await this.getAll(huertoId);
      
      const estadosCuenta = cultivos.reduce((acc, c) => {
        acc[c.estado] = (acc[c.estado] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total: cultivos.length,
        porEstado: estadosCuenta,
        parcelasUnicas: [...new Set(cultivos.map(c => c.parcela))].length
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

// Exportar
window.CultivoService = CultivoService;