/**
 * Aplicación Principal - Mi Huerto de Ciudad
 * Versión sin JSX para compatibilidad directa
 */

function HuertoApp() {
  const { useState, useEffect, createElement: h } = React;
  
  const [parseReady, setParseReady] = useState(false);
  const [cultivos, setCultivos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);
  const [conectado, setConectado] = useState(true);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [vistaActual, setVistaActual] = useState('cultivos');
  
  useEffect(() => {
    inicializarParse();
  }, []);

  useEffect(() => {
    if (parseReady) {
      cargarDatos();
    }
  }, [parseReady]);

  const inicializarParse = () => {
    try {
      Parse.initialize(
        window.BACK4APP_CONFIG.appId,
        window.BACK4APP_CONFIG.jsKey,
        window.BACK4APP_CONFIG.clientKey
      );
      Parse.serverURL = window.BACK4APP_CONFIG.serverURL;
      console.log('✅ Parse inicializado correctamente');
      setParseReady(true);
      setConectado(true);
    } catch (error) {
      console.error('❌ Error al inicializar Parse:', error);
      setConectado(false);
      mostrarMensaje('Error de conexión');
    }
  };

  const cargarDatos = async () => {
    setSincronizando(true);
    try {
      const [cultivosData, tareasData] = await Promise.all([
        window.CultivoService.getAll(),
        window.TareaService.getAll()
      ]);
      
      setCultivos(cultivosData);
      setTareas(tareasData);
      setConectado(true);
      console.log(`✅ ${cultivosData.length} cultivos, ${tareasData.length} tareas`);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      setConectado(false);
      mostrarMensaje('Error al cargar');
    } finally {
      setSincronizando(false);
    }
  };

  const mostrarMensaje = (texto) => {
    setMensajeEstado(texto);
    setTimeout(() => setMensajeEstado(''), 3000);
  };

  // Handlers Cultivos
  const handleAgregarCultivo = async (cultivoData) => {
    setSincronizando(true);
    try {
      const nuevo = await window.CultivoService.create({
        ...cultivoData,
        estado: 'creciendo',
        riego: 'moderado'
      });
      setCultivos([nuevo, ...cultivos]);
      mostrarMensaje('✅ Cultivo agregado');
    } catch (error) {
      console.error(error);
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleEliminarCultivo = async (id) => {
    if (!confirm('¿Eliminar este cultivo?')) return;
    setSincronizando(true);
    try {
      await window.CultivoService.delete(id);
      setCultivos(cultivos.filter(c => c.id !== id));
      mostrarMensaje('✅ Eliminado');
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setSincronizando(true);
    try {
      await window.CultivoService.update(id, { estado: nuevoEstado });
      setCultivos(cultivos.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleCambiarRiego = async (id, nuevoRiego) => {
    setSincronizando(true);
    try {
      await window.CultivoService.update(id, { riego: nuevoRiego });
      setCultivos(cultivos.map(c => c.id === id ? { ...c, riego: nuevoRiego } : c));
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  // Handlers Tareas
  const handleAgregarTarea = async (tareaData) => {
    setSincronizando(true);
    try {
      const nueva = await window.TareaService.create({
        ...tareaData,
        prioridad: 'media',
        completada: false
      });
      setTareas([nueva, ...tareas]);
      mostrarMensaje('✅ Tarea agregada');
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleToggleTarea = async (id) => {
    setSincronizando(true);
    try {
      const resultado = await window.TareaService.toggleCompletada(id);
      setTareas(tareas.map(t => t.id === id ? { ...t, completada: resultado.completada } : t));
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleEliminarTarea = async (id) => {
    setSincronizando(true);
    try {
      await window.TareaService.delete(id);
      setTareas(tareas.filter(t => t.id !== id));
      mostrarMensaje('✅ Eliminado');
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleCambiarPrioridad = async (id, nuevaPrioridad) => {
    setSincronizando(true);
    try {
      await window.TareaService.update(id, { prioridad: nuevaPrioridad });
      setTareas(tareas.map(t => t.id === id ? { ...t, prioridad: nuevaPrioridad } : t));
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  // Renderizado
  if (!parseReady) {
    return h('div', { className: 'loading-container' },
      h('div', { className: 'spinner' }),
      h('p', { className: 'loading-text' }, 'Conectando con Back4app...')
    );
  }

  const renderVista = () => {
    switch (vistaActual) {
      case 'cultivos':
        return h(window.CultivosView, {
          cultivos,
          onAgregarCultivo: handleAgregarCultivo,
          onEliminarCultivo: handleEliminarCultivo,
          onCambiarEstado: handleCambiarEstado,
          onCambiarRiego: handleCambiarRiego
        });
      case 'tareas':
        return h(window.TareasView, {
          tareas,
          onAgregarTarea: handleAgregarTarea,
          onToggleTarea: handleToggleTarea,
          onEliminarTarea: handleEliminarTarea,
          onCambiarPrioridad: handleCambiarPrioridad
        });
      case 'calendario':
        return h(window.CalendarioView);
      case 'consejos':
        return h(window.ConsejosView);
      default:
        return h('div', null, 'Vista no encontrada');
    }
  };

  return h('div', { className: 'app-container' },
    h(window.Header, { conectado, sincronizando, mensajeEstado }),
    h(window.Navigation, { vistaActual, setVistaActual }),
    h('main', { id: 'main-content', role: 'main' }, renderVista())
  );
}

// Renderizar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(React.createElement(HuertoApp), document.getElementById('root'));
  });
} else {
  ReactDOM.render(React.createElement(HuertoApp), document.getElementById('root'));
}