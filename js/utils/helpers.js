/**
 * Funciones Helper
 * Utilidades comunes de la aplicación
 */

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const getDaysSincePlanting = (fechaSiembra) => {
  if (!fechaSiembra) return 0;
  const hoy = new Date();
  const siembra = new Date(fechaSiembra);
  const diffTime = Math.abs(hoy - siembra);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getEstadoColor = (estado) => {
  const colores = {
    'creciendo': 'estado-creciendo',
    'floreciendo': 'estado-floreciendo',
    'cosecha': 'estado-cosecha',
    'problema': 'estado-problema'
  };
  return colores[estado] || 'estado-creciendo';
};

const getEstadoEmoji = (estado) => {
  const emojis = {
    'creciendo': '🌱',
    'floreciendo': '🌼',
    'cosecha': '🍅',
    'problema': '⚠️'
  };
  return emojis[estado] || '🌱';
};

const getEstadoText = (estado) => {
  const textos = {
    'creciendo': 'Creciendo',
    'floreciendo': 'Floreciendo',
    'cosecha': 'Listo para cosechar',
    'problema': 'Con problemas'
  };
  return textos[estado] || 'Creciendo';
};

const getPrioridadColor = (prioridad) => {
  const colores = {
    'alta': 'priority-alta',
    'media': 'priority-media',
    'baja': 'priority-baja'
  };
  return colores[prioridad] || 'priority-media';
};

const getPrioridadEmoji = (prioridad) => {
  const emojis = {
    'alta': '🔴',
    'media': '🟡',
    'baja': '🟢'
  };
  return emojis[prioridad] || '🟡';
};

const getPrioridadText = (prioridad) => {
  const textos = {
    'alta': 'Alta',
    'media': 'Media',
    'baja': 'Baja'
  };
  return textos[prioridad] || 'Media';
};

const getRiegoEmoji = (riego) => {
  const emojis = {
    'diario': '💧💧💧',
    'moderado': '💧💧',
    'bajo': '💧'
  };
  return emojis[riego] || '💧💧';
};

const getRiegoText = (riego) => {
  const textos = {
    'diario': 'Diario (verano: 1L/planta)',
    'moderado': 'Moderado (2-3 días)',
    'bajo': 'Bajo (semanal)'
  };
  return textos[riego] || 'Moderado';
};

const validateCultivo = (cultivo) => {
  const errors = {};
  
  if (!cultivo.nombre || cultivo.nombre.trim() === '') {
    errors.nombre = 'El nombre del cultivo es requerido';
  }
  
  if (!cultivo.parcela || cultivo.parcela.trim() === '') {
    errors.parcela = 'La parcela es requerida';
  }
  
  if (!cultivo.fechaSiembra) {
    errors.fechaSiembra = 'La fecha de siembra es requerida';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

const validateTarea = (tarea) => {
  const errors = {};
  
  if (!tarea.descripcion || tarea.descripcion.trim() === '') {
    errors.descripcion = 'La descripción de la tarea es requerida';
  }
  
  if (tarea.descripcion && tarea.descripcion.length > 200) {
    errors.descripcion = 'La descripción no puede exceder 200 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

const sortCultivos = (cultivos, criterio) => {
  criterio = criterio || 'fecha';
  const cultivosOrdenados = cultivos.slice();
  
  switch (criterio) {
    case 'nombre':
      return cultivosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    case 'fecha':
      return cultivosOrdenados.sort((a, b) => new Date(b.fechaSiembra) - new Date(a.fechaSiembra));
    case 'parcela':
      return cultivosOrdenados.sort((a, b) => a.parcela.localeCompare(b.parcela));
    default:
      return cultivosOrdenados;
  }
};

const filterCultivosByEstado = (cultivos, estado) => {
  if (!estado || estado === 'todos') return cultivos;
  return cultivos.filter(function(c) { return c.estado === estado; });
};

const sortTareas = (tareas) => {
  const prioridadOrden = { 'alta': 1, 'media': 2, 'baja': 3 };
  
  return tareas.slice().sort(function(a, b) {
    if (a.completada !== b.completada) {
      return a.completada ? 1 : -1;
    }
    return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
  });
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction() {
    const args = arguments;
    const later = function() {
      clearTimeout(timeout);
      func.apply(null, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const generateTempId = () => {
  return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Exportar
window.helpers = {
  formatDate: formatDate,
  getDaysSincePlanting: getDaysSincePlanting,
  getEstadoColor: getEstadoColor,
  getEstadoEmoji: getEstadoEmoji,
  getEstadoText: getEstadoText,
  getPrioridadColor: getPrioridadColor,
  getPrioridadEmoji: getPrioridadEmoji,
  getPrioridadText: getPrioridadText,
  getRiegoEmoji: getRiegoEmoji,
  getRiegoText: getRiegoText,
  validateCultivo: validateCultivo,
  validateTarea: validateTarea,
  sortCultivos: sortCultivos,
  filterCultivosByEstado: filterCultivosByEstado,
  sortTareas: sortTareas,
  debounce: debounce,
  generateTempId: generateTempId
};