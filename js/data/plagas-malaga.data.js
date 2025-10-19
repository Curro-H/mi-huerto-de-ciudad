/**
 * Catálogo COMPLETO de Plagas Comunes en Huertos Urbanos de Málaga
 * Basado en "Plagas Comunes en Huertos Urbanos de Málaga_ Guía.md"
 * INCLUYE TODAS LAS PLAGAS DEL DOCUMENTO
 */

const PLAGAS_MALAGA = {
  pulgon: {
    nombre: "Pulgón",
    emoji: "🐛",
    tratamientos: [
      "Jabón potásico (1-2% en agua)",
      "Aceite de neem (1ml/litro)",
      "Purín de ortiga (diluir 1:10)",
      "Control biológico: mariquitas, crisopas",
      "Trampas cromáticas amarillas",
      "Extracto de ajo",
      "Piretrinas naturales"
    ],
    descripcion: "Insectos de 1-3mm verdes, marrones o negros que succionan savia. Causan hojas enrolladas y segregan melaza",
    cultivosAfectados: ["Tomate", "Pimiento", "Habas", "Calabacín", "Lechuga", "Judías", "Aromáticas"]
  },
  
  mosca_blanca: {
    nombre: "Mosca Blanca",
    emoji: "🦟",
    tratamientos: [
      "Jabón potásico (envés de hojas)",
      "Aceite de neem",
      "Trampas cromáticas amarillas",
      "Control biológico: Encarsia formosa",
      "Purín de ajo",
      "Extracto de piretro natural"
    ],
    descripcion: "Insectos blancos de 1-2mm en envés de hojas. Forman nubes al agitar la planta. Vectores de virus",
    cultivosAfectados: ["Tomate", "Pepino", "Calabacín", "Berenjena", "Melón", "Pimiento", "Judías"]
  },
  
  trips: {
    nombre: "Trips",
    emoji: "🪲",
    tratamientos: [
      "Jabón potásico o jabón negro",
      "Aceite de neem",
      "Trampas cromáticas azules",
      "Control biológico: nematodos Steinernema feltiae",
      "Tierra de diatomeas",
      "Productos con Beauveria bassiana",
      "Mantener humedad alta"
    ],
    descripcion: "Insectos de 1-2mm amarillos/negros. Causan manchas plateadas y deformaciones. Vectores de virus",
    cultivosAfectados: ["Tomate", "Pimiento", "Pepino", "Judía verde", "Cebolla", "Ajo"]
  },
  
  arana_roja: {
    nombre: "Araña Roja",
    emoji: "🕷️",
    tratamientos: [
      "Aumentar humedad (riego por aspersión)",
      "Aceite de neem",
      "Jabón potásico",
      "Azufre mojable",
      "Control biológico: Phytoseiulus persimilis",
      "Extracto de ajo",
      "Pulverizar agua en envés"
    ],
    descripcion: "Ácaros diminutos (<0.5mm) que forman telarañas. Prefieren ambiente seco y caluroso",
    cultivosAfectados: ["Judías", "Pepino", "Calabacín", "Tomate", "Berenjena", "Pimiento"]
  },
  
  cochinilla_algodonosa: {
    nombre: "Cochinilla Algodonosa",
    emoji: "🐜",
    tratamientos: [
      "Alcohol de farmacia diluido (1:3 con agua)",
      "Aceite de neem",
      "Jabón potásico",
      "Retirada manual con algodón + alcohol",
      "Control biológico: Cryptolaemus montrouzieri",
      "Purín de cola de caballo"
    ],
    descripcion: "Insectos cubiertos de cera blanca algodonosa. Se adhieren a tallos y hojas",
    cultivosAfectados: ["Cítricos", "Tomate", "Pimiento", "Berenjena", "Calabacín", "Frutales"]
  },
  
  cochinilla_acanalada: {
    nombre: "Cochinilla Acanalada",
    emoji: "🦗",
    tratamientos: [
      "Aceite mineral o vegetal",
      "Jabón potásico",
      "Retirada manual",
      "Control biológico: Rodolia cardinalis",
      "Aceite de parafina en invierno",
      "Poda de ramas afectadas"
    ],
    descripcion: "Cochinilla con caparazón duro acanalado. Menos común pero muy resistente",
    cultivosAfectados: ["Cítricos", "Frutales en maceta", "Aromáticas leñosas"]
  },
  
  orugas: {
    nombre: "Orugas (Tuta absoluta, Helicoverpa)",
    emoji: "🐛",
    tratamientos: [
      "Bacillus thuringiensis (Bt) - específico",
      "Recolección manual (revisar envés)",
      "Purín de tomate",
      "Trampas de feromonas para adultos",
      "Control biológico: Trichogramma",
      "Mallas anti-insectos preventivas",
      "Plantas repelentes: albahaca, caléndula"
    ],
    descripcion: "Larvas verdes con rayas de polillas nocturnas. Hacen galerías en hojas y frutos",
    cultivosAfectados: ["Tomate", "Col", "Coliflor", "Brócoli", "Berenjena", "Pimiento", "Lechuga"]
  },
  
  caracoles_babosas: {
    nombre: "Caracoles y Babosas",
    emoji: "🐌",
    tratamientos: [
      "Barreras: cobre, ceniza, cáscaras huevo",
      "Trampas de cerveza",
      "Recolección manual nocturna",
      "Tierra de diatomeas alrededor",
      "Eliminar refugios (piedras, maderas)",
      "Fosfato de hierro (ecológico)",
      "Plantas sacrificio"
    ],
    descripcion: "Moluscos nocturnos que dejan rastro de baba. Prefieren humedad",
    cultivosAfectados: ["Lechuga", "Col", "Repollo", "Calabacín", "Fresa", "Plántulas"]
  },
  
  nematodos: {
    nombre: "Nematodos Fitopatógenos",
    emoji: "🪱",
    tratamientos: [
      "Solarización del suelo (verano)",
      "Rotación de cultivos estricta",
      "Tagetes patula como planta trampa",
      "Añadir materia orgánica y compost",
      "Biofumigación con crucíferas",
      "Variedades resistentes",
      "Nematicidas biológicos (azadiractina)"
    ],
    descripcion: "Gusanos microscópicos que atacan raíces formando nódulos. Muy difíciles de controlar",
    cultivosAfectados: ["Tomate", "Pepino", "Melón", "Zanahoria", "Patata", "Berenjena", "Judías"]
  },

  mildiu: {
    nombre: "Mildiu",
    emoji: "🍄",
    tratamientos: [
      "Caldo bordelés (preventivo)",
      "Bicarbonato sódico (5g/litro)",
      "Infusión de cola de caballo",
      "Extracto de ajo",
      "Eliminar hojas afectadas",
      "Evitar mojar follaje al regar",
      "Mejorar ventilación"
    ],
    descripcion: "Hongo que causa manchas marrones con moho grisáceo en envés. Favorecido por humedad",
    cultivosAfectados: ["Tomate", "Patata", "Pimiento", "Pepino", "Calabacín", "Vid", "Lechuga"]
  },

  oidio: {
    nombre: "Oidio (Oídio)",
    emoji: "☁️",
    tratamientos: [
      "Azufre en polvo o mojable",
      "Bicarbonato sódico (5g/litro + aceite)",
      "Leche diluida (1:10 con agua)",
      "Infusión de cola de caballo",
      "Extracto de ajo",
      "Eliminar hojas afectadas",
      "Mejorar circulación de aire"
    ],
    descripcion: "Polvo blanco/grisáceo como ceniza en hojas. Aparece con tiempo seco y cálido",
    cultivosAfectados: ["Calabacín", "Pepino", "Melón", "Tomate", "Fresa", "Vid", "Rosas"]
  },

  roya: {
    nombre: "Roya",
    emoji: "🟤",
    tratamientos: [
      "Azufre mojable",
      "Caldo bordelés",
      "Infusión de cola de caballo",
      "Bicarbonato sódico",
      "Eliminar hojas afectadas",
      "No mojar follaje al regar",
      "Rotación de cultivos"
    ],
    descripcion: "Hongos que causan pústulas naranjas/marrones en envés. Favorecidos por humedad",
    cultivosAfectados: ["Judías", "Habas", "Ajo", "Espárragos", "Remolacha", "Aromáticas"]
  },

  botrytis: {
    nombre: "Botrytis (Moho Gris)",
    emoji: "⚫",
    tratamientos: [
      "Eliminar partes afectadas inmediatamente",
      "Mejorar ventilación",
      "Reducir humedad ambiental",
      "Bicarbonato sódico pulverizado",
      "Infusión de cola de caballo",
      "No mojar flores y frutos",
      "Espaciar bien las plantas"
    ],
    descripcion: "Moho gris-marrón aterciopelado en flores, frutos y tallos. Favorecido por humedad alta",
    cultivosAfectados: ["Tomate", "Fresa", "Lechuga", "Col", "Vid", "Plantas de flor"]
  },

  minador_hojas: {
    nombre: "Minador de Hojas",
    emoji: "🪰",
    tratamientos: [
      "Retirar y destruir hojas afectadas",
      "Trampas cromáticas amarillas",
      "Aceite de neem",
      "Control biológico: Diglyphus isaea",
      "Evitar exceso de nitrógeno",
      "Mallas anti-insectos",
      "Bacillus thuringiensis"
    ],
    descripcion: "Larvas de mosca que crean galerías (túneles serpenteantes) dentro de las hojas",
    cultivosAfectados: ["Tomate", "Pimiento", "Berenjena", "Judías", "Acelga", "Espinaca"]
  },

  pulgon_raiz: {
    nombre: "Pulgón de la Raíz",
    emoji: "🐜",
    tratamientos: [
      "Riego con infusión de ajo",
      "Tierra de diatomeas en sustrato",
      "Control de hormigas (protectoras)",
      "Renovar sustrato (macetas)",
      "Bacillus subtilis",
      "Evitar exceso de humedad",
      "Nematodos beneficiosos"
    ],
    descripcion: "Pulgones que atacan raíces. Plantas se marchitan sin causa aparente",
    cultivosAfectados: ["Lechuga", "Col", "Brócoli", "Zanahoria", "Aromáticas"]
  },

  mosca_fruta: {
    nombre: "Mosca de la Fruta",
    emoji: "🍊",
    tratamientos: [
      "Trampas cromáticas amarillas",
      "Trampas con proteína hidrolizada",
      "Recolectar frutos caídos",
      "Mosquiteros en frutos",
      "Spinosad (insecticida biológico)",
      "Trampas con vinagre + jabón",
      "Recolección temprana"
    ],
    descripcion: "Moscas que depositan huevos en frutos. Las larvas se alimentan del interior",
    cultivosAfectados: ["Tomate", "Pimiento", "Cítricos", "Melocotón", "Higuera", "Frutales"]
  },

  gorgojos: {
    nombre: "Gorgojos",
    emoji: "🪲",
    tratamientos: [
      "Recolección manual",
      "Trampas con feromonas",
      "Tierra de diatomeas",
      "Aceite de neem",
      "Rotación de cultivos",
      "Eliminar restos vegetales",
      "Nematodos entomopatógenos"
    ],
    descripcion: "Escarabajos pequeños que perforan semillas, tallos y raíces. Larvas viven en el suelo",
    cultivosAfectados: ["Judías", "Guisantes", "Habas", "Legumbres secas", "Cereales"]
  },

  otro: {
    nombre: "Otra Plaga",
    emoji: "⚠️",
    tratamientos: [
      "Identificar correctamente primero",
      "Consultar con expertos",
      "Tomar fotos claras",
      "Tratamientos generales: jabón, neem",
      "Revisar guías especializadas",
      "Aislar plantas afectadas"
    ],
    descripcion: "Plaga no identificada. Identificar correctamente antes de aplicar tratamientos",
    cultivosAfectados: []
  }
};

// Métodos de tratamiento dropdown
const METODOS_TRATAMIENTO = [
  "Jabón potásico",
  "Aceite de neem",
  "Bacillus thuringiensis (Bt)",
  "Purín de ortiga",
  "Purín de ajo",
  "Purín de tomate",
  "Purín de cola de caballo",
  "Tierra de diatomeas",
  "Trampas cromáticas (amarillas/azules)",
  "Trampas de feromonas",
  "Trampas de cerveza",
  "Recolección manual",
  "Control biológico (insectos beneficiosos)",
  "Alcohol diluido",
  "Azufre (polvo o mojable)",
  "Caldo bordelés",
  "Bicarbonato sódico",
  "Solarización del suelo",
  "Barreras físicas",
  "Mallas anti-insectos",
  "Rotación de cultivos",
  "Biofumigación",
  "Otro"
];

// Estados posibles de una plaga
const ESTADOS_PLAGA = {
  activa: {
    label: "Activa",
    color: "#dc2626",
    emoji: "🔴",
    descripcion: "Plaga detectada, sin tratamiento aplicado"
  },
  en_tratamiento: {
    label: "En Tratamiento",
    color: "#f59e0b",
    emoji: "🟡",
    descripcion: "Se han aplicado tratamientos, monitorizando evolución"
  },
  controlada: {
    label: "Controlada",
    color: "#10b981",
    emoji: "🟢",
    descripcion: "Plaga bajo control, población mínima"
  },
  resuelta: {
    label: "Resuelta",
    color: "#6b7280",
    emoji: "✅",
    descripcion: "Plaga eliminada completamente"
  }
};

// Niveles de severidad
const SEVERIDADES = {
  leve: {
    label: "Leve",
    emoji: "🟢",
    descripcion: "Pocos individuos, daño mínimo"
  },
  moderada: {
    label: "Moderada",
    emoji: "🟡",
    descripcion: "Población visible, daño notable"
  },
  grave: {
    label: "Grave",
    emoji: "🔴",
    descripcion: "Infestación severa, riesgo de pérdida"
  }
};

// Exportar
window.PLAGAS_MALAGA = PLAGAS_MALAGA;
window.METODOS_TRATAMIENTO = METODOS_TRATAMIENTO;
window.ESTADOS_PLAGA = ESTADOS_PLAGA;
window.SEVERIDADES = SEVERIDADES;