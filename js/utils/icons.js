/**
 * Componentes de Iconos SVG
 * Versión SIN JSX - Usando React.createElement
 */

const Icon = ({ children, size = 20, className = '', ...props }) => {
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: className,
    role: 'img',
    ...props
  }, children);
};

const Icons = {
  Plus: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Agregar',
      children: [
        React.createElement('line', { key: 1, x1: '12', y1: '5', x2: '12', y2: '19' }),
        React.createElement('line', { key: 2, x1: '5', y1: '12', x2: '19', y2: '12' })
      ]
    });
  },

  Trash2: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Eliminar',
      children: [
        React.createElement('polyline', { key: 1, points: '3 6 5 6 21 6' }),
        React.createElement('path', { key: 2, d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
        React.createElement('line', { key: 3, x1: '10', y1: '11', x2: '10', y2: '17' }),
        React.createElement('line', { key: 4, x1: '14', y1: '11', x2: '14', y2: '17' })
      ]
    });
  },

  Check: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Completado',
      children: React.createElement('polyline', { points: '20 6 9 17 4 12' })
    });
  },

  X: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Cerrar',
      children: [
        React.createElement('line', { key: 1, x1: '18', y1: '6', x2: '6', y2: '18' }),
        React.createElement('line', { key: 2, x1: '6', y1: '6', x2: '18', y2: '18' })
      ]
    });
  },

  Menu: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Menú',
      children: [
        React.createElement('line', { key: 1, x1: '3', y1: '12', x2: '21', y2: '12' }),
        React.createElement('line', { key: 2, x1: '3', y1: '6', x2: '21', y2: '6' }),
        React.createElement('line', { key: 3, x1: '3', y1: '18', x2: '21', y2: '18' })
      ]
    });
  },

  Sprout: (props) => {
    return Icon({
      ...props,
      size: props.size || 32,
      'aria-label': 'Planta',
      children: [
        React.createElement('path', { key: 1, d: 'M7 20h10' }),
        React.createElement('path', { key: 2, d: 'M10 20c5.5-2.5.8-6.4 3-10' }),
        React.createElement('path', { key: 3, d: 'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z' }),
        React.createElement('path', { key: 4, d: 'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' })
      ]
    });
  },

  Droplet: (props) => {
    return Icon({
      ...props,
      size: props.size || 16,
      'aria-label': 'Agua',
      children: React.createElement('path', { d: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' })
    });
  },

  Sun: (props) => {
    return Icon({
      ...props,
      size: props.size || 32,
      'aria-label': 'Sol',
      children: [
        React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '5' }),
        React.createElement('line', { key: 2, x1: '12', y1: '1', x2: '12', y2: '3' }),
        React.createElement('line', { key: 3, x1: '12', y1: '21', x2: '12', y2: '23' }),
        React.createElement('line', { key: 4, x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' }),
        React.createElement('line', { key: 5, x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' }),
        React.createElement('line', { key: 6, x1: '1', y1: '12', x2: '3', y2: '12' }),
        React.createElement('line', { key: 7, x1: '21', y1: '12', x2: '23', y2: '12' }),
        React.createElement('line', { key: 8, x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' }),
        React.createElement('line', { key: 9, x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' })
      ]
    });
  },

  Calendar: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Calendario',
      children: [
        React.createElement('rect', { key: 1, x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
        React.createElement('line', { key: 2, x1: '16', y1: '2', x2: '16', y2: '6' }),
        React.createElement('line', { key: 3, x1: '8', y1: '2', x2: '8', y2: '6' }),
        React.createElement('line', { key: 4, x1: '3', y1: '10', x2: '21', y2: '10' })
      ]
    });
  },

  Info: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Información',
      children: [
        React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { key: 2, x1: '12', y1: '16', x2: '12', y2: '12' }),
        React.createElement('line', { key: 3, x1: '12', y1: '8', x2: '12.01', y2: '8' })
      ]
    });
  },

  AlertCircle: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Alerta',
      children: [
        React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { key: 2, x1: '12', y1: '8', x2: '12', y2: '12' }),
        React.createElement('line', { key: 3, x1: '12', y1: '16', x2: '12.01', y2: '16' })
      ]
    });
  },

  MapPin: (props) => {
    return Icon({
      ...props,
      size: props.size || 18,
      'aria-label': 'Ubicación',
      children: [
        React.createElement('path', { key: 1, d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
        React.createElement('circle', { key: 2, cx: '12', cy: '10', r: '3' })
      ]
    });
  },

  Thermometer: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Temperatura',
      children: React.createElement('path', { d: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z' })
    });
  },

  Cloud: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Conectado',
      children: React.createElement('path', { d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' })
    });
  },

  CloudOff: (props) => {
    return Icon({
      ...props,
      'aria-label': 'Desconectado',
      children: [
        React.createElement('path', { key: 1, d: 'M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3' }),
        React.createElement('line', { key: 2, x1: '2', y1: '2', x2: '22', y2: '22' })
      ]
    });
  }
};

// Exportar
window.Icons = Icons;