/**
 * Aplicación Principal - Mi Huerto de Ciudad
 * Con sistema de autenticación, huertos y plagas
 */

function HuertoApp() {
  const { useState, useEffect, createElement: h } = React;
  
  // ===== ESTADOS =====
  const [parseReady, setParseReady] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [huertos, setHuertos] = useState([]);
  const [huertoActual, setHuertoActual] = useState(null);
  const [cultivos, setCultivos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [plagas, setPlagas] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);
  const [conectado, setConectado] = useState(true);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [vistaActual, setVistaActual] = useState('cultivos');
  const [cultivoParaPlaga, setCultivoParaPlaga] = useState(null); // ← NUEVO: cultivo preseleccionado
  
  // ===== FUNCIONES AUXILIARES =====
  const mostrarMensaje = (texto) => {
    setMensajeEstado(texto);
    setTimeout(() => setMensajeEstado(''), 3000);
  };

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

  const verificarSesion = () => {
    const usuarioActual = window.AuthService.getCurrentUser();
    if (usuarioActual) {
      setUsuario(usuarioActual);
      cargarHuertos();
    }
  };

  // ===== HANDLERS DE AUTENTICACIÓN =====
  const handleLoginSuccess = (user) => {
    setUsuario(user);
    cargarHuertos();
  };

  const handleLogout = async () => {
    if (!confirm('¿Cerrar sesión?')) return;
    
    try {
      await window.AuthService.logout();
      setUsuario(null);
      setHuertos([]);
      setHuertoActual(null);
      setCultivos([]);
      setTareas([]);
      setPlagas([]); // ← NUEVO
      mostrarMensaje('Sesión cerrada');
    } catch (error) {
      mostrarMensaje('Error al cerrar sesión');
    }
  };

  // ===== CARGA DE DATOS =====
  const cargarHuertos = async () => {
    setSincronizando(true);
    try {
      const huertosList = await window.HuertoService.getMisHuertos();
      setHuertos(huertosList);
      setConectado(true);
      console.log(`✅ ${huertosList.length} huertos cargados`);
    } catch (error) {
      console.error('❌ Error al cargar huertos:', error);
      setConectado(false);
      mostrarMensaje('Error al cargar huertos');
    } finally {
      setSincronizando(false);
    }
  };

  const cargarDatosHuerto = async () => {
    if (!huertoActual) return;
    
    setSincronizando(true);
    try {
      // Verificar si PlagaService existe antes de llamarlo
      const plagasPromise = window.PlagaService 
        ? window.PlagaService.getAll(huertoActual)
        : Promise.resolve([]);

      const [cultivosData, tareasData, plagasData] = await Promise.all([
        window.CultivoService.getAll(huertoActual),
        window.TareaService.getAll(huertoActual),
        plagasPromise // ← NUEVO
      ]);
      
      setCultivos(cultivosData);
      setTareas(tareasData);
      setPlagas(plagasData); // ← NUEVO
      setConectado(true);
      console.log(`✅ ${cultivosData.length} cultivos, ${tareasData.length} tareas, ${plagasData.length} plagas`);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      setConectado(false);
      mostrarMensaje('Error al cargar');
    } finally {
      setSincronizando(false);
    }
  };

  // ===== HANDLERS CULTIVOS =====
  const handleAgregarCultivo = async (cultivoData) => {
    if (!huertoActual) return;
    
    setSincronizando(true);
    try {
      const nuevo = await window.CultivoService.create(huertoActual, {
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

  // ===== HANDLERS TAREAS =====
  const handleAgregarTarea = async (tareaData) => {
    if (!huertoActual) return;
    
    setSincronizando(true);
    try {
      const nueva = await window.TareaService.create(huertoActual, {
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

  // ===== HANDLERS PLAGAS (NUEVO) =====
  const handleReportarPlagaDesdeCultivo = (cultivo) => {
    setCultivoParaPlaga(cultivo);
    setVistaActual('plagas');
  };

  const handleAgregarPlaga = async (plagaData) => {
    if (!huertoActual) return;
    
    setSincronizando(true);
    try {
      const nueva = await window.PlagaService.create(huertoActual, plagaData);
      setPlagas([nueva, ...plagas]);
      mostrarMensaje('✅ Plaga reportada');
      setCultivoParaPlaga(null); // Limpiar después de crear
    } catch (error) {
      console.error(error);
      mostrarMensaje('❌ Error al reportar plaga');
    } finally {
      setSincronizando(false);
    }
  };

  const handleAddTratamiento = async (plagaId, tratamientoData) => {
    setSincronizando(true);
    try {
      const actualizada = await window.PlagaService.addTratamiento(plagaId, tratamientoData);
      setPlagas(plagas.map(p => p.id === plagaId ? actualizada : p));
      mostrarMensaje('✅ Tratamiento añadido');
    } catch (error) {
      console.error(error);
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleCambiarEstadoPlaga = async (plagaId, nuevoEstado) => {
    setSincronizando(true);
    try {
      const actualizada = await window.PlagaService.cambiarEstado(plagaId, nuevoEstado);
      setPlagas(plagas.map(p => p.id === plagaId ? actualizada : p));
      mostrarMensaje('✅ Estado actualizado');
    } catch (error) {
      console.error(error);
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const handleEliminarPlaga = async (id) => {
    if (!confirm('¿Eliminar esta plaga?')) return;
    setSincronizando(true);
    try {
      await window.PlagaService.delete(id);
      setPlagas(plagas.filter(p => p.id !== id));
      mostrarMensaje('✅ Plaga eliminada');
    } catch (error) {
      console.error(error);
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    inicializarParse();
  }, []);

  useEffect(() => {
    if (parseReady) {
      verificarSesion();
    }
  }, [parseReady]);

  useEffect(() => {
    if (usuario && huertos.length > 0) {
      // Si hay huertos pero no hay uno seleccionado, seleccionar el primero
      if (!huertoActual) {
        setHuertoActual(huertos[0].id);
      }
    }
  }, [usuario, huertos, huertoActual]);

  useEffect(() => {
    if (huertoActual) {
      cargarDatosHuerto();
    }
  }, [huertoActual]);

  // ===== RENDERIZADO =====
  if (!parseReady) {
    return h('div', { className: 'loading-container' },
      h('div', { className: 'spinner' }),
      h('p', { className: 'loading-text' }, 'Conectando con Back4app...')
    );
  }

  // Si no hay usuario, mostrar login
  if (!usuario) {
    return h(window.LoginView, { onLoginSuccess: handleLoginSuccess });
  }

  const renderVista = () => {
    if (!huertoActual) {
      return h('div', { className: 'info-box' },
        h('div', { className: 'info-box-header' },
          h(window.Icons.AlertCircle, { size: 20 }),
          h('span', null, 'Selecciona o crea un huerto')
        ),
        h('p', { className: 'info-box-content' }, 
          'Necesitas seleccionar un huerto para comenzar a trabajar'
        )
      );
    }

    switch (vistaActual) {
      case 'cultivos':
        return h(window.CultivosView, {
          cultivos,
          plagas,
          onAgregarCultivo: handleAgregarCultivo,
          onEliminarCultivo: handleEliminarCultivo,
          onCambiarEstado: handleCambiarEstado,
          onCambiarRiego: handleCambiarRiego,
          onReportarPlaga: handleReportarPlagaDesdeCultivo // ← NUEVO
        });
      case 'tareas':
        return h(window.TareasView, {
          tareas,
          onAgregarTarea: handleAgregarTarea,
          onToggleTarea: handleToggleTarea,
          onEliminarTarea: handleEliminarTarea,
          onCambiarPrioridad: handleCambiarPrioridad
        });
      case 'plagas': // ← NUEVO
        // Verificar que PlagasView existe antes de renderizar
        if (window.PlagasView) {
          return h(window.PlagasView, {
            plagas,
            cultivos,
            cultivoPreseleccionado: cultivoParaPlaga, // ← NUEVO: pasar cultivo
            onAgregarPlaga: handleAgregarPlaga,
            onAddTratamiento: handleAddTratamiento,
            onCambiarEstado: handleCambiarEstadoPlaga,
            onEliminar: handleEliminarPlaga,
            onClearPreseleccion: () => setCultivoParaPlaga(null) // ← NUEVO: limpiar
          });
        } else {
          return h('div', { className: 'info-box' },
            h('div', { className: 'info-box-header' },
              h(window.Icons.AlertCircle, { size: 20 }),
              h('span', null, 'Módulo de plagas no disponible')
            ),
            h('p', { className: 'info-box-content' }, 
              'El módulo de plagas no está cargado. Verifica que plaga.service.js y PlagasView.js estén incluidos.'
            )
          );
        }
      case 'calendario':
        return h(window.CalendarioView);
      case 'consejos':
        return h(window.ConsejosView);
      default:
        return h('div', null, 'Vista no encontrada');
    }
  };

  return h('div', { className: 'app-container' },
    h(window.Header, { 
      usuario, 
      conectado, 
      sincronizando, 
      mensajeEstado,
      onLogout: handleLogout
    }),
    h(window.HuertosSelector, {
      huertos,
      huertoActual,
      onSeleccionar: setHuertoActual,
      onRecargar: cargarHuertos
    }),
    h(window.Navigation, { 
      vistaActual, 
      setVistaActual,
      plagas // ← NUEVO: para mostrar badge
    }),
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