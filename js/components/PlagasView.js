const { useState, useMemo, useEffect } = React;
const h = React.createElement;

// ============================================
// COMPONENTE: HeaderStats
// ============================================
function HeaderStats({ stats }) {
  return h('div', { className: 'plagas-header-stats' },
    h('div', { className: 'stat-card stat-controladas' },
      h('div', { className: 'stat-icon' }, '🟢'),
      h('div', { className: 'stat-content' },
        h('div', { className: 'stat-number' }, stats.controladas),
        h('div', { className: 'stat-label' }, 'Controladas')
      )
    ),
    h('div', { className: 'stat-card stat-tratamiento' },
      h('div', { className: 'stat-icon' }, '🟡'),
      h('div', { className: 'stat-content' },
        h('div', { className: 'stat-number' }, stats.enTratamiento),
        h('div', { className: 'stat-label' }, 'En Tratamiento')
      )
    ),
    h('div', { className: 'stat-card stat-activas' },
      h('div', { className: 'stat-icon' }, '🔴'),
      h('div', { className: 'stat-content' },
        h('div', { className: 'stat-number' }, stats.activas),
        h('div', { className: 'stat-label' }, 'Activas')
      )
    )
  );
}

// ============================================
// COMPONENTE: BarraFiltros MEJORADA
// ============================================
function BarraFiltros({
  filtroEstado,
  onFiltroEstadoChange,
  filtroCultivo,
  onFiltroCultivoChange,
  filtroTipo,
  onFiltroTipoChange,
  mostrarResueltas,
  onToggleResueltas,
  cultivos
}) {
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);

  const filtrosActivosCount = [filtroCultivo, filtroTipo].filter(Boolean).length;

  const tiposPlagas = [
    { id: 'pulgon', nombre: 'Pulgón', emoji: '🐛' },
    { id: 'mosca_blanca', nombre: 'Mosca Blanca', emoji: '🦟' },
    { id: 'trips', nombre: 'Trips', emoji: '🦗' },
    { id: 'arana_roja', nombre: 'Araña Roja', emoji: '🕷️' },
    { id: 'cochinilla', nombre: 'Cochinilla', emoji: '🐚' },
    { id: 'orugas', nombre: 'Orugas', emoji: '🐛' },
    { id: 'caracoles', nombre: 'Caracoles/Babosas', emoji: '🐌' },
    { id: 'nematodos', nombre: 'Nematodos', emoji: '🪱' },
    { id: 'minador', nombre: 'Minador', emoji: '🦟' },
    { id: 'mosca_fruta', nombre: 'Mosca de la Fruta', emoji: '🪰' },
    { id: 'gorgojos', nombre: 'Gorgojos', emoji: '🪲' },
    { id: 'mildiu', nombre: 'Mildiu', emoji: '🍄' },
    { id: 'oidio', nombre: 'Oidio', emoji: '☁️' },
    { id: 'roya', nombre: 'Roya', emoji: '🟤' },
    { id: 'botrytis', nombre: 'Botrytis', emoji: '🦠' },
    { id: 'otra', nombre: 'Otra', emoji: '❓' }
  ];

  return h('div', { className: 'plagas-filtros-container' },
    h('div', { className: 'filtros-tabs-estado' },
      h('button', {
        className: `filtro-tab ${filtroEstado === 'todas' ? 'active' : ''}`,
        onClick: () => onFiltroEstadoChange('todas')
      }, 'Todas'),
      h('button', {
        className: `filtro-tab tab-activas ${filtroEstado === 'activa' ? 'active' : ''}`,
        onClick: () => onFiltroEstadoChange('activa')
      }, '🔴 Activas'),
      h('button', {
        className: `filtro-tab tab-tratamiento ${filtroEstado === 'en_tratamiento' ? 'active' : ''}`,
        onClick: () => onFiltroEstadoChange('en_tratamiento')
      }, '🟡 En Tratamiento'),
      h('button', {
        className: `filtro-tab tab-controladas ${filtroEstado === 'controlada' ? 'active' : ''}`,
        onClick: () => onFiltroEstadoChange('controlada')
      }, '🟢 Controladas')
    ),

    h('div', { className: 'filtros-expand-section' },
      h('button', {
        className: 'filtros-expand-button',
        onClick: () => setFiltrosExpanded(!filtrosExpanded)
      },
        h(window.Icons.Filter, { size: 16, className: 'icon' }),
        h('span', null, 'Más filtros'),
        filtrosActivosCount > 0 && h('span', { className: 'filtros-count-badge' }, filtrosActivosCount),
        h(filtrosExpanded ? window.Icons.ChevronUp : window.Icons.ChevronDown, { 
          size: 16, 
          className: 'icon-chevron' 
        })
      ),
      
      h('label', { className: 'toggle-resueltas' },
        h('input', {
          type: 'checkbox',
          checked: mostrarResueltas,
          onChange: (e) => onToggleResueltas(e.target.checked)
        }),
        h('span', null, 'Mostrar resueltas')
      )
    ),

    filtrosExpanded && h('div', { className: 'filtros-pills-container' },
      h('div', { className: 'filtros-pills-group' },
        h('div', { className: 'filtros-pills-label' }, 'Cultivo:'),
        h('div', { className: 'filtros-pills-list' },
          h('button', {
            className: `filtro-pill ${!filtroCultivo ? 'active' : ''}`,
            onClick: () => onFiltroCultivoChange(null)
          }, 'Todos'),
          cultivos.map(cultivo =>
            h('button', {
              key: cultivo.id,
              className: `filtro-pill ${filtroCultivo === cultivo.id ? 'active' : ''}`,
              onClick: () => onFiltroCultivoChange(cultivo.id === filtroCultivo ? null : cultivo.id)
            },
              h('span', null, `${cultivo.emoji || '🌱'} ${cultivo.nombre}`)
            )
          )
        )
      ),

      h('div', { className: 'filtros-pills-group' },
        h('div', { className: 'filtros-pills-label' }, 'Tipo de plaga:'),
        h('div', { className: 'filtros-pills-list' },
          h('button', {
            className: `filtro-pill ${!filtroTipo ? 'active' : ''}`,
            onClick: () => onFiltroTipoChange(null)
          }, 'Todos'),
          tiposPlagas.map(tipo =>
            h('button', {
              key: tipo.id,
              className: `filtro-pill ${filtroTipo === tipo.id ? 'active' : ''}`,
              onClick: () => onFiltroTipoChange(tipo.id === filtroTipo ? null : tipo.id)
            },
              h('span', null, `${tipo.emoji} ${tipo.nombre}`)
            )
          )
        )
      )
    )
  );
}

// ============================================
// COMPONENTE: TarjetaPlaga
// ============================================
function TarjetaPlaga({ plaga, cultivos, onAddTratamiento, onCambiarEstado, onEliminar, onClick }) {
  const infoPlagas = window.PLAGAS_MALAGA;
  const infoPlaga = infoPlagas[plaga.tipoPlaga] || { nombre: 'Desconocida', emoji: '❓' };

  // Extraer IDs - pueden venir como strings directamente o como objetos Parse
  const cultivosIds = (plaga.cultivosAfectados || []).map(item => {
    // Si es un string, devolverlo directamente
    if (typeof item === 'string') return item;
    // Si es un objeto Parse con .id
    if (item && item.id) return item.id;
    // Si tiene la propiedad objectId
    if (item && item.objectId) return item.objectId;
    return null;
  }).filter(Boolean);

  const cultivosAfectados = cultivosIds.map(cultivoId => {
    const cultivo = cultivos.find(c => c.id === cultivoId);
    if (cultivo) {
      return { id: cultivoId, nombre: cultivo.nombre, emoji: cultivo.emoji || '🌱' };
    }
    return null;
  }).filter(Boolean);

  const diasDesde = window.PlagaService.diasDesdeDeteccion(plaga);
  const ultimoTratamiento = plaga.tratamientos.length > 0
    ? plaga.tratamientos[plaga.tratamientos.length - 1]
    : null;

  const estadoClasses = {
    'activa': 'estado-activa',
    'en_tratamiento': 'estado-tratamiento',
    'controlada': 'estado-controlada',
    'resuelta': 'estado-resuelta'
  };

  const estadoTextos = {
    'activa': '🔴 Activa',
    'en_tratamiento': '🟡 En Tratamiento',
    'controlada': '🟢 Controlada',
    'resuelta': '✅ Resuelta'
  };

  const handleAction = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  return h('div', {
    className: `plaga-card ${estadoClasses[plaga.estadoControl]}`,
    onClick: onClick
  },
    h('div', { className: 'plaga-card-header' },
      h('div', { className: 'plaga-titulo' },
        h('span', { className: 'plaga-emoji' }, infoPlaga.emoji),
        h('span', { className: 'plaga-nombre' }, infoPlaga.nombre)
      ),
      h('span', {
        className: `plaga-estado-badge ${estadoClasses[plaga.estadoControl]}`
      }, estadoTextos[plaga.estadoControl])
    ),

    h('div', { className: 'plaga-card-body' },
      h('div', { className: 'plaga-info-item' },
        h('strong', null, 'Cultivos: '),
        cultivosAfectados.map((c, i) =>
          h('span', { key: c.id, className: 'cultivo-tag' },
            `${c.emoji} ${c.nombre}${i < cultivosAfectados.length - 1 ? ', ' : ''}`
          )
        )
      ),

      h('div', { className: 'plaga-info-item' },
        h('strong', null, 'Hace '),
        `${diasDesde} días`
      ),

      ultimoTratamiento && h('div', { className: 'plaga-info-item ultimo-tratamiento' },
        h('strong', null, 'Último tratamiento: '),
        ultimoTratamiento.metodo
      )
    ),

    h('div', { className: 'plaga-card-actions' },
      h('button', {
        className: 'btn-icon-small',
        onClick: (e) => handleAction(e, () => onAddTratamiento(plaga)),
        title: 'Añadir tratamiento'
      }, h(window.Icons.Plus, { size: 16 })),

      plaga.estadoControl === 'en_tratamiento' && h('button', {
        className: 'btn-small btn-success',
        onClick: (e) => handleAction(e, () => onCambiarEstado(plaga.id, 'controlada'))
      }, 'Controlada'),

      plaga.estadoControl !== 'resuelta' && h('button', {
        className: 'btn-small btn-primary',
        onClick: (e) => handleAction(e, () => onCambiarEstado(plaga.id, 'resuelta'))
      }, 'Resolver'),

      h('button', {
        className: 'btn-icon-small btn-danger',
        onClick: (e) => handleAction(e, () => {
          if (confirm('¿Eliminar esta plaga permanentemente?')) {
            onEliminar(plaga.id);
          }
        }),
        title: 'Eliminar'
      }, h(window.Icons.Trash2, { size: 16 }))
    )
  );
}

// ============================================
// MODAL: Nueva Plaga
// ============================================
function ModalNuevaPlaga({ cultivos, cultivoPreseleccionado, onGuardar, onCerrar }) {
  const [tipoPlaga, setTipoPlaga] = useState('');
  const [cultivosSeleccionados, setCultivosSeleccionados] = useState([]);
  const [severidad, setSeveridad] = useState('leve');
  const [notas, setNotas] = useState('');

  const infoPlagas = window.PLAGAS_MALAGA;
  const infoPlaga = tipoPlaga ? infoPlagas[tipoPlaga] : null;

  useEffect(() => {
    if (cultivoPreseleccionado) {
      setCultivosSeleccionados([cultivoPreseleccionado]);
    }
  }, [cultivoPreseleccionado]);

  const handleToggleCultivo = (cultivoId) => {
    setCultivosSeleccionados(prev =>
      prev.includes(cultivoId)
        ? prev.filter(id => id !== cultivoId)
        : [...prev, cultivoId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoPlaga || cultivosSeleccionados.length === 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Convertir IDs a objetos Parse Pointer
    const CultivoClass = Parse.Object.extend("Cultivo");
    const cultivosPointers = cultivosSeleccionados.map(id => {
      const cultivo = CultivoClass.createWithoutData(id);
      return cultivo;
    });

    await onGuardar({
      tipoPlaga,
      cultivosAfectados: cultivosPointers,
      severidad,
      notas,
      estadoControl: 'activa',
      fechaDeteccion: new Date(),
      tratamientos: []
    });
  };

  return h('div', { className: 'modal-overlay', onClick: onCerrar },
    h('div', { className: 'modal', onClick: (e) => e.stopPropagation() },
      h('div', { className: 'modal-header' },
        h('h2', null, '🐛 Reportar Nueva Plaga'),
        h('button', {
          className: 'modal-close',
          onClick: onCerrar
        }, h(window.Icons.X, { size: 20 }))
      ),

      h('form', { onSubmit: handleSubmit },
        h('div', { className: 'modal-body' },
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label required' }, 'Tipo de plaga'),
            h('select', {
              className: 'form-select',
              value: tipoPlaga,
              onChange: (e) => setTipoPlaga(e.target.value),
              required: true
            },
              h('option', { value: '' }, 'Selecciona un tipo...'),
              Object.keys(infoPlagas).map(key =>
                h('option', { key, value: key },
                  `${infoPlagas[key].emoji} ${infoPlagas[key].nombre}`
                )
              )
            )
          ),

          infoPlaga && h('div', { className: 'info-box' },
            h('div', { className: 'info-box-header' },
              h(window.Icons.Lightbulb, { size: 16 }),
              h('span', { className: 'info-box-title' }, 'Tratamientos recomendados')
            ),
            h('div', { className: 'info-box-content' },
              h('p', null, infoPlaga.descripcion),
              h('ul', { className: 'info-box-list' },
                infoPlaga.tratamientos.slice(0, 5).map((t, i) =>
                  h('li', { key: i }, t)
                )
              )
            )
          ),

          h('div', { className: 'form-group' },
            h('label', { className: 'form-label required' }, 
              cultivoPreseleccionado 
                ? `Cultivos afectados (${cultivos.find(c => c.id === cultivoPreseleccionado)?.nombre} preseleccionado)`
                : 'Cultivos afectados'
            ),
            h('div', { className: 'checkbox-group' },
              cultivos.map(cultivo =>
                h('div', { key: cultivo.id, className: 'checkbox-item' },
                  h('input', {
                    type: 'checkbox',
                    id: `cultivo-${cultivo.id}`,
                    checked: cultivosSeleccionados.includes(cultivo.id),
                    onChange: () => handleToggleCultivo(cultivo.id)
                  }),
                  h('label', { htmlFor: `cultivo-${cultivo.id}` },
                    `${cultivo.emoji || '🌱'} ${cultivo.nombre}`
                  )
                )
              )
            )
          ),

          h('div', { className: 'form-group' },
            h('label', { className: 'form-label required' }, 'Severidad'),
            h('div', { className: 'radio-group' },
              h('div', { className: 'radio-item' },
                h('input', {
                  type: 'radio',
                  id: 'sev-leve',
                  name: 'severidad',
                  value: 'leve',
                  checked: severidad === 'leve',
                  onChange: (e) => setSeveridad(e.target.value)
                }),
                h('label', { htmlFor: 'sev-leve' },
                  h('strong', null, '🟢 Leve'), ': Pocos individuos, daño mínimo'
                )
              ),
              h('div', { className: 'radio-item' },
                h('input', {
                  type: 'radio',
                  id: 'sev-moderada',
                  name: 'severidad',
                  value: 'moderada',
                  checked: severidad === 'moderada',
                  onChange: (e) => setSeveridad(e.target.value)
                }),
                h('label', { htmlFor: 'sev-moderada' },
                  h('strong', null, '🟡 Moderada'), ': Población visible, daño notable'
                )
              ),
              h('div', { className: 'radio-item' },
                h('input', {
                  type: 'radio',
                  id: 'sev-grave',
                  name: 'severidad',
                  value: 'grave',
                  checked: severidad === 'grave',
                  onChange: (e) => setSeveridad(e.target.value)
                }),
                h('label', { htmlFor: 'sev-grave' },
                  h('strong', null, '🔴 Grave'), ': Infestación, riesgo de pérdida'
                )
              )
            )
          ),

          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' }, 'Notas iniciales'),
            h('textarea', {
              className: 'form-textarea',
              value: notas,
              onChange: (e) => setNotas(e.target.value),
              placeholder: 'Observaciones adicionales...'
            })
          )
        ),

        h('div', { className: 'modal-footer' },
          h('button', {
            type: 'button',
            className: 'btn',
            onClick: onCerrar
          }, 'Cancelar'),
          h('button', {
            type: 'submit',
            className: 'btn btn-primary'
          }, h(window.Icons.AlertTriangle, { size: 16 }), ' Reportar Plaga')
        )
      )
    )
  );
}

// ============================================
// MODAL: Registrar Tratamiento
// ============================================
function ModalTratamiento({ plaga, onGuardar, onCerrar }) {
  const [metodo, setMetodo] = useState('');
  const [otroMetodo, setOtroMetodo] = useState('');
  const [notas, setNotas] = useState('');
  const [mejoraObservada, setMejoraObservada] = useState(false);

  const metodosTratamiento = window.METODOS_TRATAMIENTO || [
    'Jabón potásico',
    'Aceite de neem',
    'Purín de ortiga',
    'Purín de ajo',
    'Bacillus thuringiensis',
    'Trampas cromáticas amarillas',
    'Trampas cromáticas azules',
    'Tierra de diatomeas',
    'Recolección manual',
    'Control biológico (mariquitas)',
    'Control biológico (crisopas)',
    'Fungicida de cobre',
    'Azufre',
    'Bicarbonato sódico',
    'Infusión de cola de caballo',
    'Eliminación de partes afectadas',
    'Mejora de ventilación',
    'Reducción de humedad',
    'Rotación de cultivos',
    'Otro'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodo) {
      alert('Por favor selecciona un método de tratamiento');
      return;
    }

    const metodoFinal = metodo === 'Otro' && otroMetodo ? otroMetodo : metodo;

    await onGuardar({
      fecha: new Date(),
      metodo: metodoFinal,
      notas,
      mejoraObservada
    });
  };

  return h('div', { className: 'modal-overlay', onClick: onCerrar },
    h('div', { className: 'modal', onClick: (e) => e.stopPropagation() },
      h('div', { className: 'modal-header' },
        h('h2', null, '💊 Registrar Tratamiento'),
        h('button', {
          className: 'modal-close',
          onClick: onCerrar
        }, h(window.Icons.X, { size: 20 }))
      ),

      h('form', { onSubmit: handleSubmit },
        h('div', { className: 'modal-body' },
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label required' }, 'Método aplicado'),
            h('select', {
              className: 'form-select',
              value: metodo,
              onChange: (e) => setMetodo(e.target.value),
              required: true
            },
              h('option', { value: '' }, 'Selecciona un método...'),
              metodosTratamiento.map(m =>
                h('option', { key: m, value: m }, m)
              )
            )
          ),

          metodo === 'Otro' && h('div', { className: 'form-group' },
            h('label', { className: 'form-label required' }, 'Especifica el método'),
            h('input', {
              type: 'text',
              className: 'form-input',
              value: otroMetodo,
              onChange: (e) => setOtroMetodo(e.target.value),
              placeholder: 'Describe el método aplicado...',
              required: true
            })
          ),

          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' }, 'Notas sobre la aplicación'),
            h('textarea', {
              className: 'form-textarea',
              value: notas,
              onChange: (e) => setNotas(e.target.value),
              placeholder: 'Detalles de cómo/dónde se aplicó...'
            })
          ),

          h('div', { className: 'form-group' },
            h('div', { className: 'checkbox-item' },
              h('input', {
                type: 'checkbox',
                id: 'mejora',
                checked: mejoraObservada,
                onChange: (e) => setMejoraObservada(e.target.checked)
              }),
              h('label', { htmlFor: 'mejora' },
                '✅ ¿Mejora observada después del tratamiento?'
              )
            )
          )
        ),

        h('div', { className: 'modal-footer' },
          h('button', {
            type: 'button',
            className: 'btn',
            onClick: onCerrar
          }, 'Cancelar'),
          h('button', {
            type: 'submit',
            className: 'btn btn-primary'
          }, h(window.Icons.Check, { size: 16 }), ' Registrar')
        )
      )
    )
  );
}

// ============================================
// MODAL: Detalle de Plaga
// ============================================
function ModalDetalle({ plaga, cultivos, onAddTratamiento, onCambiarEstado, onEliminar, onCerrar }) {
  const infoPlagas = window.PLAGAS_MALAGA;
  const infoPlaga = infoPlagas[plaga.tipoPlaga] || { nombre: 'Desconocida', emoji: '❓' };

  const cultivosAfectados = plaga.cultivosAfectados.map(cultivoId => {
    const cultivo = cultivos.find(c => c.id === cultivoId);
    return cultivo ? { id: cultivoId, nombre: cultivo.nombre, emoji: cultivo.emoji || '🌱' } : null;
  }).filter(Boolean);

  const diasDesde = window.PlagaService.diasDesdeDeteccion(plaga);

  const estadoTextos = {
    'activa': '🔴 Activa',
    'en_tratamiento': '🟡 En Tratamiento',
    'controlada': '🟢 Controlada',
    'resuelta': '✅ Resuelta'
  };

  const severidadTextos = {
    'leve': '🟢 Leve',
    'moderada': '🟡 Moderada',
    'grave': '🔴 Grave'
  };

  return h('div', { className: 'modal-overlay', onClick: onCerrar },
    h('div', { className: 'modal modal-large', onClick: (e) => e.stopPropagation() },
      h('div', { className: 'modal-header' },
        h('h2', null, `${infoPlaga.emoji} ${infoPlaga.nombre}`),
        h('button', {
          className: 'modal-close',
          onClick: onCerrar
        }, h(window.Icons.X, { size: 20 }))
      ),

      h('div', { className: 'modal-body' },
        h('div', { className: 'detalle-seccion' },
          h('h3', null, 'Información General'),
          h('div', { className: 'detalle-grid' },
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Estado:'),
              h('span', null, estadoTextos[plaga.estadoControl])
            ),
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Severidad:'),
              h('span', null, severidadTextos[plaga.severidad])
            ),
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Detectada hace:'),
              h('span', null, `${diasDesde} días`)
            ),
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Fecha de detección:'),
              h('span', null, new Date(plaga.fechaDeteccion).toLocaleDateString())
            )
          ),

          h('div', { className: 'detalle-item' },
            h('strong', null, 'Cultivos afectados:'),
            h('div', { className: 'cultivos-list' },
              cultivosAfectados.map(c =>
                h('span', { key: c.id, className: 'cultivo-badge' },
                  `${c.emoji} ${c.nombre}`
                )
              )
            )
          ),

          plaga.notas && h('div', { className: 'detalle-item' },
            h('strong', null, 'Notas:'),
            h('p', null, plaga.notas)
          )
        ),

        plaga.tratamientos.length > 0 && h('div', { className: 'detalle-seccion' },
          h('h3', null, `📋 Historial de Tratamientos (${plaga.tratamientos.length})`),
          h('div', { className: 'tratamientos-timeline' },
            plaga.tratamientos.slice().reverse().map((t, i) =>
              h('div', { key: i, className: 'timeline-item' },
                h('div', { className: 'timeline-header' },
                  h('span', { className: 'timeline-date' },
                    `📅 ${new Date(t.fecha).toLocaleDateString()}`
                  ),
                  t.mejoraObservada && h('span', { className: 'timeline-mejora' },
                    h(window.Icons.CheckCircle, { size: 14 }),
                    ' Mejora observada'
                  )
                ),
                h('div', { className: 'timeline-metodo' }, t.metodo),
                t.notas && h('div', { className: 'timeline-notas' }, `"${t.notas}"`)
              )
            )
          )
        ),

        plaga.tratamientos.length === 0 && h('div', { className: 'detalle-seccion' },
          h('p', { style: { color: '#9ca3af', fontStyle: 'italic' } },
            'Aún no se han registrado tratamientos para esta plaga.'
          )
        )
      ),

      h('div', { className: 'modal-footer' },
        h('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } },
          h('button', {
            className: 'btn btn-primary',
            onClick: onAddTratamiento
          }, h(window.Icons.Plus, { size: 16 }), ' Añadir Tratamiento'),

          plaga.estadoControl === 'en_tratamiento' && h('button', {
            className: 'btn btn-success',
            onClick: () => {
              if (confirm('¿Marcar esta plaga como controlada?')) {
                onCambiarEstado(plaga.id, 'controlada');
                onCerrar();
              }
            }
          }, h(window.Icons.CheckCircle, { size: 16 }), ' Marcar Controlada'),

          plaga.estadoControl !== 'resuelta' && h('button', {
            className: 'btn btn-primary',
            onClick: () => {
              if (confirm('¿Marcar esta plaga como resuelta? Se archivará.')) {
                onCambiarEstado(plaga.id, 'resuelta');
                onCerrar();
              }
            }
          }, h(window.Icons.Check, { size: 16 }), ' Resolver'),

          h('button', {
            className: 'btn btn-danger',
            onClick: () => {
              if (confirm('¿Eliminar esta plaga permanentemente?')) {
                onEliminar(plaga.id);
                onCerrar();
              }
            }
          }, h(window.Icons.Trash2, { size: 16 }), ' Eliminar')
        ),
        h('button', {
          className: 'btn',
          onClick: onCerrar
        }, 'Cerrar')
      )
    )
  );
}

// ============================================
// COMPONENTE PRINCIPAL: PlagasView
// ============================================
function PlagasView({
  plagas,
  cultivos,
  cultivoPreseleccionado,
  onAgregarPlaga,
  onAddTratamiento,
  onCambiarEstado,
  onEliminar,
  onClearPreseleccion
}) {
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCultivo, setFiltroCultivo] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [mostrarResueltas, setMostrarResueltas] = useState(false);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  // Auto-abrir modal si hay cultivo preseleccionado
  useEffect(() => {
    if (cultivoPreseleccionado) {
      setModalNueva(true);
    }
  }, [cultivoPreseleccionado]);

  // Estadísticas
  const stats = useMemo(() => ({
    activas: plagas.filter(p => p.estadoControl === 'activa').length,
    enTratamiento: plagas.filter(p => p.estadoControl === 'en_tratamiento').length,
    controladas: plagas.filter(p => p.estadoControl === 'controlada').length
  }), [plagas]);

  // Filtrado de plagas
  const plagasFiltradas = useMemo(() => {
    let resultado = plagas;

    // Filtro por estado
    if (filtroEstado !== 'todas') {
      resultado = resultado.filter(p => p.estadoControl === filtroEstado);
    }

    // No mostrar resueltas por defecto
    if (!mostrarResueltas) {
      resultado = resultado.filter(p => p.estadoControl !== 'resuelta');
    }

    // Filtro por cultivo
    if (filtroCultivo) {
      resultado = resultado.filter(p => p.cultivosAfectados.includes(filtroCultivo));
    }

    // Filtro por tipo
    if (filtroTipo) {
      resultado = resultado.filter(p => p.tipoPlaga === filtroTipo);
    }

    // Ordenar por prioridad de estado
    const prioridades = { activa: 1, en_tratamiento: 2, controlada: 3, resuelta: 4 };
    return resultado.sort((a, b) => prioridades[a.estadoControl] - prioridades[b.estadoControl]);
  }, [plagas, filtroEstado, filtroCultivo, filtroTipo, mostrarResueltas]);

  return h('div', { className: 'plagas-view' },
    h('div', { className: 'view-header' },
      h('h1', null, '🦗 Control de Plagas'),
      h('button', {
        className: 'btn btn-primary',
        onClick: () => setModalNueva(true)
      }, h(window.Icons.Plus, { size: 20 }), ' Reportar Plaga')
    ),

    h(HeaderStats, { stats }),

    h(BarraFiltros, {
      filtroEstado,
      onFiltroEstadoChange: setFiltroEstado,
      filtroCultivo,
      onFiltroCultivoChange: setFiltroCultivo,
      filtroTipo,
      onFiltroTipoChange: setFiltroTipo,
      mostrarResueltas,
      onToggleResueltas: setMostrarResueltas,
      cultivos
    }),

    plagasFiltradas.length === 0
      ? h('div', { className: 'empty-state' },
          h(window.Icons.Bug, { size: 48 }),
          h('p', null, 'No hay plagas registradas con estos filtros')
        )
      : h('div', { className: 'plagas-grid' },
          plagasFiltradas.map(plaga =>
            h(TarjetaPlaga, {
              key: plaga.id,
              plaga,
              cultivos,
              onAddTratamiento: () => setModalTratamiento(plaga),
              onCambiarEstado,
              onEliminar,
              onClick: () => setModalDetalle(plaga)
            })
          )
        ),

    // MODALES
    modalNueva && h(ModalNuevaPlaga, {
      cultivos,
      cultivoPreseleccionado,
      onGuardar: async (plagaData) => {
        await onAgregarPlaga(plagaData);
        setModalNueva(false);
        onClearPreseleccion();
      },
      onCerrar: () => {
        setModalNueva(false);
        onClearPreseleccion();
      }
    }),

    modalTratamiento && h(ModalTratamiento, {
      plaga: modalTratamiento,
      onGuardar: async (tratamientoData) => {
        await onAddTratamiento(modalTratamiento.id, tratamientoData);
        setModalTratamiento(null);
      },
      onCerrar: () => setModalTratamiento(null)
    }),

    modalDetalle && h(ModalDetalle, {
      plaga: modalDetalle,
      cultivos,
      onAddTratamiento: () => {
        setModalTratamiento(modalDetalle);
        setModalDetalle(null);
      },
      onCambiarEstado,
      onEliminar: (id) => {
        onEliminar(id);
        setModalDetalle(null);
      },
      onCerrar: () => setModalDetalle(null)
    })
  );
}

window.PlagasView = PlagasView;