/**
 * Datos del Calendario de Siembra para Málaga
 * Información mensual específica del clima mediterráneo
 */

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CALENDARIO_MALAGA = {
  0: { // Enero
    siembraDirecta: ['Ajos', 'Habas', 'Guisantes', 'Zanahorias', 'Rabanitos', 'Espinacas'],
    semilleros: ['Tomates', 'Pimientos', 'Berenjenas', 'Lechugas', 'Cebollas', 'Puerros'],
    trasplante: ['Cebollas', 'Puerros', 'Lechugas'],
    cosecha: ['Lechugas', 'Espinacas', 'Acelgas', 'Coles', 'Coliflor', 'Brócoli', 'Habas', 'Apio', 'Escarola'],
    tareas: ['Planificar rotación de cultivos', 'Preparar compost', 'Proteger del frío', 'Aplicar abono orgánico'],
    clima: 'Temperaturas suaves 15-18°C. Mes de planificación.'
  },
  1: { // Febrero
    siembraDirecta: ['Ajos', 'Habas', 'Guisantes', 'Zanahorias', 'Rabanitos', 'Espinacas', 'Remolachas'],
    semilleros: ['Tomates', 'Pimientos', 'Berenjenas', 'Lechugas', 'Cebollas', 'Puerros'],
    trasplante: ['Cebollas', 'Puerros', 'Lechugas', 'Coles', 'Brócoli', 'Coliflor'],
    cosecha: ['Lechugas', 'Espinacas', 'Acelgas', 'Coles', 'Coliflor', 'Brócoli', 'Habas', 'Guisantes', 'Apio'],
    tareas: ['Preparar bancales', 'Continuar compost', 'Proteger semilleros', 'Riego moderado'],
    clima: 'Temperaturas ascendiendo. Preparación para primavera.'
  },
  2: { // Marzo
    siembraDirecta: ['Zanahorias', 'Rabanitos', 'Espinacas', 'Guisantes', 'Habas', 'Remolachas', 'Calabacines', 'Pepinos'],
    semilleros: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Melones'],
    trasplante: ['Lechugas', 'Cebollas', 'Coles', 'Brócoli', 'Coliflor', 'Tomates (finales)'],
    cosecha: ['Lechugas', 'Espinacas', 'Acelgas', 'Habas', 'Guisantes', 'Zanahorias', 'Rabanitos', 'Coles'],
    tareas: ['Limpiar malas hierbas', 'Aumentar riego', 'Preparar acolchado', 'Alistar tutores'],
    clima: 'Inicio temporada fuerte. Clima más cálido.'
  },
  3: { // Abril
    siembraDirecta: ['Judías verdes', 'Maíz dulce', 'Rabanitos', 'Zanahorias', 'Nabos'],
    semilleros: ['Calabacines', 'Pepinos', 'Melones', 'Lechugas'],
    trasplante: ['Tomates', 'Pimientos', 'Berenjenas', 'Lechugas'],
    cosecha: ['Lechugas', 'Espinacas', 'Habas', 'Guisantes', 'Zanahorias', 'Rabanitos', 'Espárragos', 'Fresas'],
    tareas: ['Instalar tutores', 'Controlar pulgón', 'Riego regular', 'Entutorar tomateras'],
    clima: 'Plena actividad primaveral. Clima cálido estable.'
  },
  4: { // Mayo
    siembraDirecta: ['Judías verdes', 'Maíz dulce', 'Rabanitos', 'Calabacines', 'Pepinos', 'Melones'],
    semilleros: ['Lechugas', 'Coles', 'Brócoli', 'Coliflor'],
    trasplante: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Melones'],
    cosecha: ['Lechugas', 'Habas', 'Guisantes', 'Zanahorias', 'Rabanitos', 'Espárragos', 'Fresas', 'Patatas'],
    tareas: ['Aplicar acolchado', 'Riego abundante', 'Podar aromáticas', 'Controlar plagas'],
    clima: 'Preparación del verano. Aumento de temperatura.'
  },
  5: { // Junio
    siembraDirecta: ['Judías verdes', 'Rabanitos', 'Nabos', 'Acelgas', 'Remolachas'],
    semilleros: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas', 'Escarola', 'Apio'],
    trasplante: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas', 'Puerros'],
    cosecha: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Judías', 'Lechugas', 'Cebollas'],
    tareas: ['Riego frecuente crucial', 'Sombrear si necesario', 'Cosechar regularmente', 'Mulching'],
    clima: 'Inicio del calor intenso. 25-30°C+'
  },
  6: { // Julio
    siembraDirecta: ['Rabanitos', 'Nabos', 'Acelgas'],
    semilleros: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas', 'Escarola'],
    trasplante: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas'],
    cosecha: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Judías', 'Melones', 'Sandías', 'Maíz'],
    tareas: ['Riego diario/cada 2 días', 'Eliminar frutos enfermos', 'Recolectar semillas', 'Regar temprano o tarde'],
    clima: 'Pleno verano. Calor máximo >30°C. 1L agua/planta/día'
  },
  7: { // Agosto
    siembraDirecta: ['Rabanitos', 'Nabos', 'Acelgas', 'Espinacas', 'Canónigos'],
    semilleros: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas', 'Escarola', 'Cebollas'],
    trasplante: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas'],
    cosecha: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Judías', 'Melones', 'Maíz'],
    tareas: ['Mantener riego constante', 'Preparar tierra otoño', 'Retirar plantas agotadas', 'Semilleros otoño-invierno'],
    clima: 'Transición otoño. Calor intenso continúa.'
  },
  8: { // Septiembre
    siembraDirecta: ['Rabanitos', 'Espinacas', 'Acelgas', 'Habas', 'Guisantes', 'Zanahorias'],
    semilleros: ['Lechugas', 'Escarola', 'Cebollas'],
    trasplante: ['Brócoli', 'Coliflor', 'Coles', 'Lechugas', 'Escarola'],
    cosecha: ['Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Pepinos', 'Judías', 'Melones'],
    tareas: ['Retirar cultivos verano', 'Abonar con compost', 'Planificar otoño-invierno', 'Laborear y estiércol'],
    clima: 'Transición otoñal. Solapamiento cultivos.'
  },
  9: { // Octubre
    siembraDirecta: ['Ajos', 'Habas', 'Guisantes', 'Espinacas', 'Rabanitos', 'Zanahorias', 'Acelgas'],
    semilleros: ['Lechugas', 'Cebollas', 'Puerros'],
    trasplante: ['Lechugas', 'Escarola', 'Cebollas'],
    cosecha: ['Tomates (últimos)', 'Pimientos (últimos)', 'Calabacines', 'Pepinos', 'Acelgas', 'Espinacas', 'Lechugas'],
    tareas: ['Trasplantar cultivos otoño', 'Riego moderado', 'Adaptarse a lluvias', 'Proteger de lluvias intensas'],
    clima: 'Otoño consolidado. Clima fresco ideal.'
  },
  10: { // Noviembre
    siembraDirecta: ['Ajos', 'Habas', 'Guisantes', 'Espinacas', 'Rabanitos'],
    semilleros: ['Cebollas', 'Puerros', 'Lechugas'],
    trasplante: ['Lechugas', 'Cebollas'],
    cosecha: ['Acelgas', 'Espinacas', 'Lechugas', 'Brócoli', 'Coliflor', 'Coles', 'Rabanitos', 'Zanahorias'],
    tareas: ['Proteger del frío', 'Mantener compost', 'Riego según lluvias', 'Eliminar malas hierbas'],
    clima: 'Hacia el invierno. Temperaturas descendiendo.'
  },
  11: { // Diciembre
    siembraDirecta: ['Ajos', 'Habas', 'Guisantes', 'Rabanitos'],
    semilleros: ['Cebollas', 'Puerros', 'Lechugas'],
    trasplante: ['Lechugas', 'Cebollas'],
    cosecha: ['Acelgas', 'Espinacas', 'Lechugas', 'Brócoli', 'Coliflor', 'Coles', 'Rabanitos'],
    tareas: ['Mantenimiento mínimo', 'Recoger hojas para compost', 'Podar aromáticas', 'Planificar próxima temporada'],
    clima: 'Cierre del año. Mes tranquilo pero productivo.'
  }
};

const CULTIVOS_MALAGA = [
  'Tomates', 'Pimientos', 'Berenjenas', 'Calabacines', 'Lechugas',
  'Espinacas', 'Acelgas', 'Fresas', 'Sandías', 'Melones',
  'Pepinos', 'Judías', 'Habas', 'Ajos', 'Cebollas', 'Zanahorias',
  'Rabanitos', 'Remolachas', 'Guisantes', 'Puerros', 'Nabos',
  'Brócoli', 'Coliflor', 'Coles', 'Escarola', 'Maíz dulce'
];

// Exportar
window.MESES = MESES;
window.CALENDARIO_MALAGA = CALENDARIO_MALAGA;
window.CULTIVOS_MALAGA = CULTIVOS_MALAGA;