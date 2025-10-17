// app.js - Componente principal de la aplicación

function HuertoApp() {
  const { useState, useEffect } = React;
  
  const [parseReady, setParseReady] = useState(false);
  const [cultivos, setCultivos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [sincronizando, setSincronizando] = useState(false);
  const [conectado, setConectado] = useState(true);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState(9);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaParcela, setNuevaParcela] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [vistaActual, setVistaActual] = useState('cultivos');
  
  // Inicializar Parse
  useEffect(() => {
    try {
      Parse.initialize(
        BACK4APP_CONFIG.appId,
        BACK4APP_CONFIG.jsKey,
        BACK4APP_CONFIG.clientKey
      );
      Parse.serverURL = BACK4APP_CONFIG.serverURL;
      console.log('✅ Parse inicializado');
      setParseReady(true);
    } catch (error) {
      console.error('❌ Error:', error);
      setConectado(false);
    }
  }, []);

  // Cargar datos al iniciar
  useEffect(() => {
    if (parseReady) {
      cargarDatosDesdeNube();
    }
  }, [parseReady]);

  const mostrarMensaje = (texto) => {
    setMensajeEstado(texto);
    setTimeout(() => setMensajeEstado(''), 3000);
  };

  const cargarDatosDesdeNube = async () => {
    setSincronizando(true);
    try {
      // Cargar cultivos
      const CultivoClass = Parse.Object.extend("Cultivo");
      const queryCultivos = new Parse.Query(CultivoClass);
      queryCultivos.limit(1000);
      const resultados = await queryCultivos.find();
      
      const cultivosCargados = resultados.map(obj => ({
        id: obj.id,
        nombre: obj.get('nombre') || '',
        parcela: obj.get('parcela') || '',
        fechaSiembra: obj.get('fechaSiembra') || '',
        estado: obj.get('estado') || 'creciendo',
        riego: obj.get('riego') || 'moderado'
      }));

      // Cargar tareas
      const TareaClass = Parse.Object.extend("Tarea");
      const queryTareas = new Parse.Query(TareaClass);
      queryTareas.limit(1000);
      const resultadosTareas = await queryTareas.find();
      
      const tareasCargadas = resultadosTareas.map(obj => ({
        id: obj.id,
        descripcion: obj.get('descripcion') || '',
        prioridad: obj.get('prioridad') || 'media',
        completada: obj.get('completada') || false
      }));

      setCultivos(cultivosCargados);
      setTareas(tareasCargadas);
      setConectado(true);
      mostrarMensaje(`✅ ${cultivosCargados.length} cultivos, ${tareasCargadas.length} tareas`);
    } catch (error) {
      console.error('Error:', error);
      setConectado(false);
      mostrarMensaje('❌ Error de conexión');
    } finally {
      setSincronizando(false);
    }
  };

  // Funciones CRUD para cultivos
  const guardarCultivoEnNube = async (cultivo) => {
    const CultivoClass = Parse.Object.extend("Cultivo");
    const obj = new CultivoClass();
    Object.keys(cultivo).forEach(key => obj.set(key, cultivo[key]));
    const resultado = await obj.save();
    return resultado.id;
  };

  const actualizarCultivoEnNube = async (cultivo) => {
    const CultivoClass = Parse.Object.extend("Cultivo");
    const query = new Parse.Query(CultivoClass);
    const obj = await query.get(cultivo.id);
    obj.set('estado', cultivo.estado);
    obj.set('riego', cultivo.riego);
    await obj.save();
  };

  const eliminarCultivoDeNube = async (id) => {
    const CultivoClass = Parse.Object.extend("Cultivo");
    const query = new Parse.Query(CultivoClass);
    const obj = await query.get(id);
    await obj.destroy();
  };

  // Funciones CRUD para tareas
  const guardarTareaEnNube = async (tarea) => {
    const TareaClass = Parse.Object.extend("Tarea");
    const obj = new TareaClass();
    Object.keys(tarea).forEach(key => obj.set(key, tarea[key]));
    const resultado = await obj.save();
    return resultado.id;
  };

  const actualizarTareaEnNube = async (tarea) => {
    const TareaClass = Parse.Object.extend("Tarea");
    const query = new Parse.Query(TareaClass);
    const obj = await query.get(tarea.id);
    obj.set('descripcion', tarea.descripcion);
    obj.set('prioridad', tarea.prioridad);
    obj.set('completada', tarea.completada);
    await obj.save();
  };

  const eliminarTareaDeNube = async (id) => {
    const TareaClass = Parse.Object.extend("Tarea");
    const query = new Parse.Query(TareaClass);
    const obj = await query.get(id);
    await obj.destroy();
  };

  // Handlers para cultivos
  const agregarCultivo = async () => {
    if (nuevoNombre && nuevaParcela && nuevaFecha) {
      const nuevo = {
        nombre: nuevoNombre,
        parcela: nuevaParcela,
        fechaSiembra: nuevaFecha,
        estado: 'creciendo',
        riego: 'moderado'
      };
      
      setSincronizando(true);
      try {
        const id = await guardarCultivoEnNube(nuevo);
        setCultivos([...cultivos, { ...nuevo, id }]);
        setNuevoNombre('');
        setNuevaParcela('');
        setNuevaFecha('');
        mostrarMensaje('✅ Cultivo guardado');
      } catch (error) {
        mostrarMensaje('❌ Error al guardar');
      } finally {
        setSincronizando(false);
      }
    }
  };

  const eliminarCultivo = async (id) => {
    setSincronizando(true);
    try {
      await eliminarCultivoDeNube(id);
      setCultivos(cultivos.filter(c => c.id !== id));
      mostrarMensaje('✅ Eliminado');
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    const cultivo = cultivos.find(c => c.id === id);
    if (cultivo) {
      cultivo.estado = nuevoEstado;
      await actualizarCultivoEnNube(cultivo);
      setCultivos(cultivos.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    }
  };

  const cambiarRiego = async (id, nuevoRiego) => {
    const cultivo = cultivos.find(c => c.id === id);
    if (cultivo) {
      cultivo.riego = nuevoRiego;
      await actualizarCultivoEnNube(cultivo);
      setCultivos(cultivos.map(c => c.id === id ? { ...c, riego: nuevoRiego } : c));
    }
  };

  // Handlers para tareas
  const agregarTarea = async () => {
    if (nuevaDesc) {
      const nueva = {
        descripcion: nuevaDesc,
        prioridad: 'media',
        completada: false
      };
      
      setSincronizando(true);
      try {
        const id = await guardarTareaEnNube(nueva);
        setTareas([...tareas, { ...nueva, id }]);
        setNuevaDesc('');
        mostrarMensaje('✅ Tarea guardada');
      } catch (error) {
        mostrarMensaje('❌ Error');
      } finally {
        setSincronizando(false);
      }
    }
  };

  const toggleTarea = async (id) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      await actualizarTareaEnNube(tarea);
      setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
    }
  };

  const eliminarTarea = async (id) => {
    setSincronizando(true);
    try {
      await eliminarTareaDeNube(id);
      setTareas(tareas.filter(t => t.id !== id));
      mostrarMensaje('✅ Eliminado');
    } catch (error) {
      mostrarMensaje('❌ Error');
    } finally {
      setSincronizando(false);
    }
  };

  const cambiarPrioridad = async (id, nuevaPrioridad) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.prioridad = nuevaPrioridad;
      await actualizarTareaEnNube(tarea);
      setTareas(tareas.map(t => t.id === id ? { ...t, prioridad: nuevaPrioridad } : t));
    }
  };

  const infoMes = CALENDARIO_MALAGA[mesSeleccionado];
  const btnClass = (vista) => 
    'py-3 px-4 rounded-lg font-semibold transition-all ' + 
    (vistaActual === vista ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50');

  if (!parseReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Conectando con Back4app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Icons.Sprout />
              <h1 className="text-3xl font-bold text-gray-800">Mi Huerto de Ciudad</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Icons.MapPin />
                <span className="text-sm font-medium">Málaga, España</span>
              </div>
              <div className="flex items-center gap-2">
                {conectado ? <Icons.Cloud /> : <Icons.CloudOff />}
                {sincronizando && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Gestiona tus cultivos según el clima mediterráneo malagueño</p>
            {mensajeEstado && (
              <span className="text-sm text-green-600 font-medium">{mensajeEstado}</span>
            )}
          </div>
        </div>

        {/* Navegación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button onClick={() => setVistaActual('cultivos')} className={btnClass('cultivos')}>
            <span className="inline-flex items-center gap-2">
              <Icons.Sprout /> Cultivos
            </span>
          </button>
          <button onClick={() => setVistaActual('tareas')} className={btnClass('tareas')}>
            <span className="inline-flex items-center gap-2">
              <Icons.Calendar /> Tareas
            </span>
          </button>
          <button onClick={() => setVistaActual('calendario')} className={btnClass('calendario')}>
            <span className="inline-flex items-center gap-2">
              <Icons.Info /> Calendario
            </span>
          </button>
          <button onClick={() => setVistaActual('consejos')} className={btnClass('consejos')}>
            <span className="inline-flex items-center gap-2">
              <Icons.Sun /> Consejos
            </span>
          </button>
        </div>

        {/* Vista Cultivos */}
        {vistaActual === 'cultivos' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Agregar Cultivo</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={nuevoNombre} 
                  onChange={(e) => setNuevoNombre(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar cultivo...</option>
                  {CULTIVOS_MALAGA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Parcela (ej: A1)" 
                  value={nuevaParcela} 
                  onChange={(e) => setNuevaParcela(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input 
                  type="date" 
                  value={nuevaFecha} 
                  onChange={(e) => setNuevaFecha(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button 
                  onClick={agregarCultivo} 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Icons.Plus /> Agregar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cultivos.map(cultivo => (
                <div key={cultivo.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{cultivo.nombre}</h3>
                      <p className="text-gray-600">Parcela: {cultivo.parcela}</p>
                    </div>
                    <button 
                      onClick={() => eliminarCultivo(cultivo.id)} 
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Icons.Trash2 />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icons.Calendar />
                      <span className="text-sm text-gray-600">
                        Siembra: {new Date(cultivo.fechaSiembra).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Estado:</label>
                      <select 
                        value={cultivo.estado} 
                        onChange={(e) => cambiarEstado(cultivo.id, e.target.value)} 
                        className={`w-full px-3 py-2 rounded-lg font-medium ${getColorEstado(cultivo.estado)}`}
                      >
                        <option value="creciendo">🌱 Creciendo</option>
                        <option value="floreciendo">🌼 Floreciendo</option>
                        <option value="cosecha">🍅 Listo para cosechar</option>
                        <option value="problema">⚠️ Con problemas</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                        <Icons.Droplet /> Riego:
                      </label>
                      <select 
                        value={cultivo.riego} 
                        onChange={(e) => cambiarRiego(cultivo.id, e.target.value)} 
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg font-medium ${getColorRiego(cultivo.riego)}`}
                      >
                        <option value="diario">💧 Diario (verano: 1L/planta)</option>
                        <option value="moderado">💧 Moderado (2-3 días)</option>
                        <option value="bajo">💧 Bajo (semanal)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista Tareas */}
        {vistaActual === 'tareas' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nueva Tarea</h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Descripción de la tarea..." 
                  value={nuevaDesc} 
                  onChange={(e) => setNuevaDesc(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && agregarTarea()} 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button 
                  onClick={agregarTarea} 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Icons.Plus /> Agregar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {tareas.map(tarea => (
                <div 
                  key={tarea.id} 
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 ${getColorPrioridad(tarea.prioridad)}`}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={tarea.completada} 
                      onChange={() => toggleTarea(tarea.id)} 
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className={`flex-1 text-lg ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {tarea.descripcion}
                    </span>
                    <select 
                      value={tarea.prioridad} 
                      onChange={(e) => cambiarPrioridad(tarea.id, e.target.value)} 
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="alta">🔴 Alta</option>
                      <option value="media">🟡 Media</option>
                      <option value="baja">🟢 Baja</option>
                    </select>
                    <button 
                      onClick={() => eliminarTarea(tarea.id)} 
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Icons.Trash2 />
                    </button>
                  </div>
                </div>
              ))}
              {tareas.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-400">
                  <Icons.Calendar />
                  <p className="mt-4">No hay tareas pendientes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista Calendario - Simplificada por brevedad */}
        {vistaActual === 'calendario' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Calendario de Siembra - Málaga</h2>
            <select 
              value={mesSeleccionado} 
              onChange={(e) => setMesSeleccionado(parseInt(e.target.value))} 
              className="px-4 py-2 border border-gray-300 rounded-lg mb-6"
            >
              {MESES.map((mes, idx) => <option key={idx} value={idx}>{mes}</option>)}
            </select>
            <div className="bg-blue-50 p-4 rounded mb-4">
              <p className="font-semibold text-blue-900">{infoMes.clima}</p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-green-800 mb-2">🌱 Siembra Directa</h3>
                <div className="flex flex-wrap gap-2">
                  {infoMes.siembraDirecta.map((c, i) => (
                    <span key={i} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista Consejos - Simplificada */}
        {vistaActual === 'consejos' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Consejos para Málaga</h2>
            <p className="text-gray-700">
              Málaga goza de un clima mediterráneo excepcional con más de 300 días de sol al año.
              Los inviernos son suaves (15-18°C) y los veranos cálidos (30°C o más).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Renderizar la aplicación
ReactDOM.render(<HuertoApp />, document.getElementById('root'));