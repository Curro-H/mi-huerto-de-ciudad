/**
 * Vista de Gestión de Plagas
 * Sistema completo con CRUD, filtros, modales y edición
 */

function PlagasView({ 
  plagas, 
  cultivos,
  cultivoPreseleccionado,
  onAgregarPlaga,
  onAddTratamiento,
  onCambiarEstado,
  onEliminar,
  onEditar,  // NUEVO: Handler para editar plaga
  onClearPreseleccion
}) {
  const { useState, useEffect, useMemo, createElement: h } = React;

  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCultivo, setFiltroCultivo] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [mostrarResueltas, setMostrarResueltas] = useState(false);
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);

  // Estados de modales
  const [modalNueva, setModalNueva] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalEditar, setModalEditar] = useState(null); // NUEVO

  // Auto-abrir modal si hay cultivo preseleccionado
  useEffect(() => {
    if (cultivoPreseleccionado) {
      setModalNueva(true);
    }
  }, [cultivoPreseleccionado]);

  // ============================================
  // ESTADÍSTICAS
  // ============================================
  const stats = useMemo(() => ({
    controladas: plagas.filter(p => p.estadoControl === 'controlada').length,
    enTratamiento: plagas.filter(p => p.estadoControl === 'en_tratamiento').length,
    activas: plagas.filter(p => p.estadoControl === 'activa').length
  }), [plagas]);

  // ============================================
  // LÓGICA DE FILTRADO
  // ============================================
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
      resultado = resultado.filter(p => 
        p.cultivosAfectados.some(c => c.id === filtroCultivo)
      );
    }

    // Filtro por tipo
    if (filtroTipo) {
      resultado = resultado.filter(p => p.tipoPlaga === filtroTipo);
    }

    // Ordenar por prioridad
    const prioridades = { activa: 1, en_tratamiento: 2, controlada: 3, resuelta: 4 };
    return resultado.sort((a, b) => 
      prioridades[a.estadoControl] - prioridades[b.estadoControl]
    );
  }, [plagas, filtroEstado, filtroCultivo, filtroTipo, mostrarResueltas]);

  // ============================================
  // HANDLERS - MODALES
  // ============================================
  const handleAbrirModalNueva = () => setModalNueva(true);
  const handleCerrarModalNueva = () => {
    setModalNueva(false);
    if (onClearPreseleccion) onClearPreseleccion();
  };

  const handleAbrirModalTratamiento = (plaga) => setModalTratamiento(plaga);
  const handleCerrarModalTratamiento = () => setModalTratamiento(null);

  const handleAbrirModalDetalle = (plaga) => setModalDetalle(plaga);
  const handleCerrarModalDetalle = () => setModalDetalle(null);

  // NUEVO: Handlers para modal editar
  const handleAbrirModalEditar = (plaga) => {
    setModalEditar(plaga);
    setModalDetalle(null); // Cerrar modal de detalle
  };
  const handleCerrarModalEditar = () => setModalEditar(null);

  // ============================================
  // HANDLERS - ACCIONES
  // ============================================
  const handleAgregarPlaga = async (plagaData) => {
    await onAgregarPlaga(plagaData);
    handleCerrarModalNueva();
  };

  const handleRegistrarTratamiento = async (plagaId, tratamientoData) => {
    await onAddTratamiento(plagaId, tratamientoData);
    handleCerrarModalTratamiento();
  };

  const handleCambiarEstadoDesdeDetalle = async (nuevoEstado) => {
    if (!modalDetalle) return;
    await onCambiarEstado(modalDetalle.id, nuevoEstado);
    handleCerrarModalDetalle();
  };

  const handleEliminarDesdeDetalle = async () => {
    if (!modalDetalle) return;
    const confirmar = window.confirm('¿Estás seguro de eliminar esta plaga?');
    if (confirmar) {
      await onEliminar(modalDetalle.id);
      handleCerrarModalDetalle();
    }
  };

  // NUEVO: Handler para editar plaga
  const handleEditarPlaga = async (plagaId, datosActualizados) => {
    await onEditar(plagaId, datosActualizados);
    handleCerrarModalEditar();
  };

  // ============================================
  // SUB-COMPONENTES
  // ============================================

  // Header con Estadísticas
  function HeaderStats({ stats }) {
    return h('div', { className: 'plagas-stats-header' },
      h('div', { className: 'stat-card stat-controladas' },
        h('div', { className: 'stat-icon' }, '🟢'),
        h('div', { className: 'stat-content' },
          h('div', { className: 'stat-value' }, stats.controladas),
          h('div', { className: 'stat-label' }, 'Controladas')
        )
      ),
      h('div', { className: 'stat-card stat-tratamiento' },
        h('div', { className: 'stat-icon' }, '🟡'),
        h('div', { className: 'stat-content' },
          h('div', { className: 'stat-value' }, stats.enTratamiento),
          h('div', { className: 'stat-label' }, 'En Tratamiento')
        )
      ),
      h('div', { className: 'stat-card stat-activas' },
        h('div', { className: 'stat-icon' }, '🔴'),
        h('div', { className: 'stat-content' },
          h('div', { className: 'stat-value' }, stats.activas),
          h('div', { className: 'stat-label' }, 'Activas')
        )
      )
    );
  }

  // Barra de Filtros
  function BarraFiltros() {
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

    return h('div', { className: 'filtros-container' },
      // Tabs de Estado (siempre visibles)
      h('div', { className: 'filtros-tabs-estado' },
        h('button', {
          className: `filtro-tab ${filtroEstado === 'todas' ? 'active' : ''}`,
          onClick: () => setFiltroEstado('todas')
        }, 'Todas'),
        h('button', {
          className: `filtro-tab filtro-activa ${filtroEstado === 'activa' ? 'active' : ''}`,
          onClick: () => setFiltroEstado('activa')
        }, '🔴 Activas'),
        h('button', {
          className: `filtro-tab filtro-tratamiento ${filtroEstado === 'en_tratamiento' ? 'active' : ''}`,
          onClick: () => setFiltroEstado('en_tratamiento')
        }, '🟡 En Tratamiento'),
        h('button', {
          className: `filtro-tab filtro-controlada ${filtroEstado === 'controlada' ? 'active' : ''}`,
          onClick: () => setFiltroEstado('controlada')
        }, '🟢 Controladas')
      ),

      // Botón expandir + Toggle resueltas
      h('div', { className: 'filtros-expand-section' },
        h('button', {
          className: 'btn-expand-filtros',
          onClick: () => setFiltrosExpanded(!filtrosExpanded)
        },
          h(window.Icons.Filter, { size: 16 }),
          h('span', null, 'Más filtros'),
          filtrosActivosCount > 0 && h('span', { className: 'filtros-badge' }, filtrosActivosCount),
          h(filtrosExpanded ? window.Icons.ChevronUp : window.Icons.ChevronDown, { size: 16 })
        ),
        
        h('label', { className: 'toggle-resueltas' },
          h('input', {
            type: 'checkbox',
            checked: mostrarResueltas,
            onChange: (e) => setMostrarResueltas(e.target.checked)
          }),
          h('span', null, 'Mostrar resueltas')
        )
      ),

      // Pills colapsables
      filtrosExpanded && h('div', { className: 'filtros-pills-container' },
        // Pills de Cultivo
        h('div', { className: 'filtros-grupo' },
          h('span', { className: 'filtros-grupo-label' }, 'CULTIVO:'),
          h('div', { className: 'filtros-pills' },
            h('button', {
              className: `filtro-pill ${!filtroCultivo ? 'active' : ''}`,
              onClick: () => setFiltroCultivo(null)
            }, 'Todos'),
            cultivos.map(cultivo =>
              h('button', {
                key: cultivo.id,
                className: `filtro-pill ${filtroCultivo === cultivo.id ? 'active' : ''}`,
                onClick: () => setFiltroCultivo(cultivo.id)
              }, `${cultivo.nombre}`)
            )
          )
        ),

        // Pills de Tipo de Plaga
        h('div', { className: 'filtros-grupo' },
          h('span', { className: 'filtros-grupo-label' }, 'TIPO DE PLAGA:'),
          h('div', { className: 'filtros-pills' },
            h('button', {
              className: `filtro-pill ${!filtroTipo ? 'active' : ''}`,
              onClick: () => setFiltroTipo(null)
            }, 'Todos'),
            tiposPlagas.map(tipo =>
              h('button', {
                key: tipo.id,
                className: `filtro-pill ${filtroTipo === tipo.id ? 'active' : ''}`,
                onClick: () => setFiltroTipo(tipo.id)
              }, `${tipo.emoji} ${tipo.nombre}`)
            )
          )
        )
      )
    );
  }

  // Tarjeta de Plaga
  function TarjetaPlaga({ plaga }) {
    const infoPlaga = window.PlagaService?.getInfoTipo(plaga.tipoPlaga);
    const diasActiva = window.PlagaService?.diasDesdeDeteccion(plaga.fechaDeteccion) || 0;
    const ultimoTratamiento = plaga.tratamientos.length > 0 
      ? plaga.tratamientos[plaga.tratamientos.length - 1]
      : null;

    const estadoClasses = {
      activa: 'estado-activa',
      en_tratamiento: 'estado-tratamiento',
      controlada: 'estado-controlada',
      resuelta: 'estado-resuelta'
    };

    const estadoTextos = {
      activa: '🔴 Activa',
      en_tratamiento: '🟡 En Tratamiento',
      controlada: '🟢 Controlada',
      resuelta: '✅ Resuelta'
    };

    return h('div', {
      className: `tarjeta-plaga ${plaga.estadoControl === 'resuelta' ? 'resuelta' : ''}`,
      onClick: () => handleAbrirModalDetalle(plaga)
    },
      // Header
      h('div', { className: 'tarjeta-plaga-header' },
        h('h3', null,
          h('span', { className: 'plaga-emoji' }, infoPlaga?.emoji || '🐛'),
          infoPlaga?.nombre || plaga.tipoPlaga
        ),
        h('span', {
          className: `estado-badge ${estadoClasses[plaga.estadoControl]}`
        }, estadoTextos[plaga.estadoControl])
      ),

      // Cultivos afectados
      h('div', { className: 'plaga-cultivos' },
        h('strong', null, 'Cultivos: '),
        plaga.cultivosAfectados.map(c => c.nombre).join(', ')
      ),

      // Info adicional
      h('div', { className: 'plaga-info' },
        h('span', null, `Hace ${diasActiva} días`),
        ultimoTratamiento && h('span', null, `Último: ${ultimoTratamiento.metodo}`)
      ),

      // Acciones rápidas
      h('div', { className: 'tarjeta-plaga-acciones', onClick: e => e.stopPropagation() },
        h('button', {
          className: 'btn-icon btn-tratamiento-quick',
          onClick: () => handleAbrirModalTratamiento(plaga),
          title: 'Añadir tratamiento',
          'aria-label': 'Añadir tratamiento'
        }, h(window.Icons.Plus, { size: 18 })),

        plaga.estadoControl === 'en_tratamiento' && h('button', {
          className: 'btn-icon btn-controlada-quick',
          onClick: () => onCambiarEstado(plaga.id, 'controlada'),
          title: 'Marcar como controlada',
          'aria-label': 'Marcar como controlada'
        }, h(window.Icons.CheckCircle, { size: 18 })),

        plaga.estadoControl !== 'resuelta' && h('button', {
          className: 'btn-icon btn-resolver-quick',
          onClick: () => {
            const confirmar = window.confirm('¿Marcar esta plaga como resuelta?');
            if (confirmar) onCambiarEstado(plaga.id, 'resuelta');
          },
          title: 'Resolver plaga',
          'aria-label': 'Resolver plaga'
        }, h(window.Icons.Check, { size: 18 })),

        h('button', {
          className: 'btn-icon btn-eliminar-quick',
          onClick: () => {
            const confirmar = window.confirm('¿Eliminar esta plaga?');
            if (confirmar) onEliminar(plaga.id);
          },
          title: 'Eliminar',
          'aria-label': 'Eliminar'
        }, h(window.Icons.Trash2, { size: 18 }))
      )
    );
  }

  // ============================================
  // MODAL: NUEVA PLAGA
  // ============================================
  function ModalNuevaPlaga() {
    const [tipoPlaga, setTipoPlaga] = useState('');
    const [cultivosSeleccionados, setCultivosSeleccionados] = useState(
      cultivoPreseleccionado ? [cultivoPreseleccionado] : []
    );
    const [severidad, setSeveridad] = useState('');
    const [notas, setNotas] = useState('');

    const infoPlaga = tipoPlaga ? window.PLAGAS_MALAGA?.[tipoPlaga] : null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!tipoPlaga || cultivosSeleccionados.length === 0 || !severidad) {
        alert('❌ Completa todos los campos requeridos');
        return;
      }

      handleAgregarPlaga({
        tipoPlaga,
        cultivosAfectados: cultivosSeleccionados,
        severidad,
        notas: notas.trim()
      });
    };

    const toggleCultivo = (cultivoId) => {
      if (cultivosSeleccionados.includes(cultivoId)) {
        setCultivosSeleccionados(cultivosSeleccionados.filter(id => id !== cultivoId));
      } else {
        setCultivosSeleccionados([...cultivosSeleccionados, cultivoId]);
      }
    };

    return h('div', { className: 'modal-overlay', onClick: handleCerrarModalNueva },
      h('div', { 
        className: 'modal-content modal-nueva-plaga',
        onClick: (e) => e.stopPropagation()
      },
        h('div', { className: 'modal-header' },
          h('h2', null, '🐛 Reportar Nueva Plaga'),
          h('button', {
            className: 'modal-close',
            onClick: handleCerrarModalNueva,
            'aria-label': 'Cerrar'
          }, '×')
        ),

        h('form', { className: 'modal-body', onSubmit: handleSubmit },
          // Tipo de plaga
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' },
              'Tipo de plaga ',
              h('span', { className: 'required' }, '*')
            ),
            h('select', {
              className: 'form-select',
              value: tipoPlaga,
              onChange: (e) => setTipoPlaga(e.target.value),
              required: true
            },
              h('option', { value: '' }, '-- Selecciona un tipo --'),
              Object.entries(window.PLAGAS_MALAGA || {}).map(([key, info]) =>
                h('option', { key, value: key },
                  `${info.emoji} ${info.nombre}`
                )
              )
            )
          ),

          // Info box
          infoPlaga && h('div', { className: 'info-box info-tratamientos' },
            h('div', { className: 'info-box-header' },
              h(window.Icons.Lightbulb, { size: 18 }),
              h('span', null, 'Tratamientos recomendados')
            ),
            h('div', { className: 'info-box-content' },
              h('p', { style: { marginBottom: '8px', fontSize: '0.875rem' } },
                infoPlaga.descripcion
              ),
              h('ul', { className: 'lista-tratamientos' },
                infoPlaga.tratamientos.map((trat, idx) =>
                  h('li', { key: idx }, `• ${trat}`)
                )
              )
            )
          ),

          // Cultivos afectados
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' },
              'Cultivo(s) afectado(s) ',
              h('span', { className: 'required' }, '*')
            ),
            cultivoPreseleccionado && h('div', { className: 'info-box' },
              h('p', { style: { margin: 0, fontSize: '0.875rem' } },
                `📌 Reportando para: ${cultivos.find(c => c.id === cultivoPreseleccionado)?.nombre}`
              )
            ),
            h('div', { className: 'checkbox-grid' },
              cultivos.length === 0 ?
                h('p', { className: 'texto-ayuda' },
                  'No hay cultivos en este huerto'
                ) :
                cultivos.map(cultivo =>
                  h('label', {
                    key: cultivo.id,
                    className: 'checkbox-card'
                  },
                    h('input', {
                      type: 'checkbox',
                      checked: cultivosSeleccionados.includes(cultivo.id),
                      onChange: () => toggleCultivo(cultivo.id)
                    }),
                    h('span', { className: 'checkbox-label' },
                      `${cultivo.nombre} (${cultivo.parcela})`
                    )
                  )
                )
            )
          ),

          // Severidad
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' },
              'Nivel de severidad ',
              h('span', { className: 'required' }, '*')
            ),
            h('div', { className: 'radio-group-severidad' },
              [
                { value: 'leve', emoji: '🟢', label: 'Leve', desc: 'Pocos individuos, daño mínimo' },
                { value: 'moderada', emoji: '🟡', label: 'Moderada', desc: 'Población visible, daño notable' },
                { value: 'grave', emoji: '🔴', label: 'Grave', desc: 'Infestación, riesgo de pérdida' }
              ].map(opcion =>
                h('label', {
                  key: opcion.value,
                  className: `radio-card ${severidad === opcion.value ? 'selected' : ''}`
                },
                  h('input', {
                    type: 'radio',
                    name: 'severidad',
                    value: opcion.value,
                    checked: severidad === opcion.value,
                    onChange: (e) => setSeveridad(e.target.value)
                  }),
                  h('div', { className: 'radio-content' },
                    h('div', { className: 'radio-header' },
                      h('span', { className: 'radio-emoji' }, opcion.emoji),
                      h('span', { className: 'radio-label' }, opcion.label)
                    ),
                    h('p', { className: 'radio-desc' }, opcion.desc)
                  )
                )
              )
            )
          ),

          // Notas
          h('div', { className: 'form-group' },
            h('label', { className: 'form-label' }, 'Notas iniciales'),
            h('textarea', {
              className: 'form-textarea',
              value: notas,
              onChange: (e) => setNotas(e.target.value),
              placeholder: 'Observaciones sobre la plaga...',
              rows: 3
            })
          ),

          // Botones
          h('div', { className: 'modal-footer' },
            h('button', {
              type: 'button',
              className: 'btn-secondary',
              onClick: handleCerrarModalNueva
            }, 'Cancelar'),
            h('button', {
              type: 'submit',
              className: 'btn-primary'
            }, 'Reportar Plaga')
          )
        )
      )
    );
  }

  // ============================================
  // MODAL: REGISTRAR TRATAMIENTO
  // ============================================
function ModalTratamiento() {
  if (!modalTratamiento) return null;

  const [metodo, setMetodo] = useState('');
  const [notas, setNotas] = useState('');
  const [mejoraObservada, setMejoraObservada] = useState(false);

  // NUEVO: Obtener info de la plaga para mostrar recomendaciones
  const infoPlaga = window.PlagaService?.getInfoTipo(modalTratamiento.tipoPlaga);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!metodo) {
      alert('❌ Selecciona un método de tratamiento');
      return;
    }

    handleRegistrarTratamiento(modalTratamiento.id, {
      metodo,
      notas: notas.trim(),
      mejoraObservada
    });
  };

  const metodosTratamiento = [
    'Jabón potásico',
    'Aceite de neem',
    'Purín de ortiga',
    'Purín de ajo',
    'Bacillus thuringiensis',
    'Trampas cromáticas',
    'Tierra de diatomeas',
    'Recolección manual',
    'Control biológico (mariquitas/crisopas)',
    'Azufre',
    'Cobre',
    'Bicarbonato de sodio',
    'Otro'
  ];

  return h('div', { className: 'modal-overlay', onClick: handleCerrarModalTratamiento },
    h('div', { 
      className: 'modal-content modal-tratamiento',
      onClick: (e) => e.stopPropagation()
    },
      h('div', { className: 'modal-header' },
        h('h2', null, '💊 Registrar Tratamiento'),
        h('button', {
          className: 'modal-close',
          onClick: handleCerrarModalTratamiento,
          'aria-label': 'Cerrar'
        }, '×')
      ),

      h('form', { className: 'modal-body', onSubmit: handleSubmit },
        
        // NUEVO: Info box con plaga y recomendaciones
        h('div', { className: 'info-box info-plaga-actual' },
          h('div', { className: 'info-box-header' },
            h('span', { style: { fontSize: '1.5rem' } }, infoPlaga?.emoji || '🐛'),
            h('span', null, `Tratando: ${infoPlaga?.nombre || modalTratamiento.tipoPlaga}`)
          ),
          infoPlaga && h('div', { className: 'info-box-content' },
            h('p', { 
              style: { 
                marginBottom: '8px', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af'
              } 
            }, '💡 Tratamientos recomendados:'),
            h('ul', { className: 'lista-tratamientos-recomendados' },
              infoPlaga.tratamientos.map((trat, idx) =>
                h('li', { key: idx }, `• ${trat}`)
              )
            )
          )
        ),

        // Método
        h('div', { className: 'form-group' },
          h('label', { className: 'form-label' },
            'Método aplicado ',
            h('span', { className: 'required' }, '*')
          ),
          h('select', {
            className: 'form-select',
            value: metodo,
            onChange: (e) => setMetodo(e.target.value),
            required: true
          },
            h('option', { value: '' }, '-- Selecciona un método --'),
            metodosTratamiento.map(m =>
              h('option', { key: m, value: m }, m)
            )
          )
        ),

        // Notas
        h('div', { className: 'form-group' },
          h('label', { className: 'form-label' }, 'Notas sobre la aplicación'),
          h('textarea', {
            className: 'form-textarea',
            value: notas,
            onChange: (e) => setNotas(e.target.value),
            placeholder: 'Detalles de cómo/dónde se aplicó...',
            rows: 3
          })
        ),

        // Mejora observada
        h('div', { className: 'form-group' },
          h('label', { className: 'checkbox-label' },
            h('input', {
              type: 'checkbox',
              checked: mejoraObservada,
              onChange: (e) => setMejoraObservada(e.target.checked)
            }),
            h('span', null, '✅ Mejora observada')
          )
        ),

        // Botones
        h('div', { className: 'modal-footer' },
          h('button', {
            type: 'button',
            className: 'btn-secondary',
            onClick: handleCerrarModalTratamiento
          }, 'Cancelar'),
          h('button', {
            type: 'submit',
            className: 'btn-primary'
          }, 'Registrar Tratamiento')
        )
      )
    )
  );
}

  // ============================================
  // MODAL: DETALLE DE PLAGA
  // ============================================
  function ModalDetalle() {
    if (!modalDetalle) return null;

    const plaga = modalDetalle;
    const infoPlaga = window.PlagaService?.getInfoTipo(plaga.tipoPlaga);
    const diasActiva = window.PlagaService?.diasDesdeDeteccion(plaga.fechaDeteccion) || 0;

    const handleResolver = () => {
      const confirmar = window.confirm('¿Marcar esta plaga como resuelta? Se archivará.');
      if (confirmar) {
        handleCambiarEstadoDesdeDetalle('resuelta');
      }
    };

    return h('div', { className: 'modal-overlay', onClick: handleCerrarModalDetalle },
      h('div', { 
        className: 'modal-content modal-detalle-plaga',
        onClick: (e) => e.stopPropagation()
      },
        h('div', { className: 'modal-header' },
          h('h2', null, 
            h('span', null, infoPlaga?.emoji || '🐛'),
            ' ',
            infoPlaga?.nombre || plaga.tipoPlaga
          ),
          h('button', {
            className: 'modal-close',
            onClick: handleCerrarModalDetalle,
            'aria-label': 'Cerrar'
          }, '×')
        ),

        h('div', { className: 'modal-body' },
          // Información General
          h('div', { className: 'detalle-seccion' },
            h('h3', null, 'Información General'),
            h('div', { className: 'detalle-info-grid' },
              h('div', { className: 'detalle-info-item' },
                h('strong', null, 'Estado:'),
                h('span', {
                  className: `estado-badge ${
                    plaga.estadoControl === 'activa' ? 'estado-activa' :
                    plaga.estadoControl === 'en_tratamiento' ? 'estado-tratamiento' :
                    plaga.estadoControl === 'controlada' ? 'estado-controlada' :
                    'estado-resuelta'
                  }`
                }, 
                  plaga.estadoControl === 'activa' ? '🔴 Activa' :
                  plaga.estadoControl === 'en_tratamiento' ? '🟡 En Tratamiento' :
                  plaga.estadoControl === 'controlada' ? '🟢 Controlada' :
                  '✅ Resuelta'
                )
              ),
              h('div', { className: 'detalle-info-item' },
                h('strong', null, 'Severidad:'),
                h('span', null,
                  plaga.severidad === 'leve' ? '🟢 Leve' :
                  plaga.severidad === 'moderada' ? '🟡 Moderada' :
                  '🔴 Grave'
                )
              ),
              h('div', { className: 'detalle-info-item' },
                h('strong', null, 'Cultivos afectados:'),
                h('span', null, plaga.cultivosAfectados.map(c => c.nombre).join(', '))
              ),
              h('div', { className: 'detalle-info-item' },
                h('strong', null, 'Detectada hace:'),
                h('span', null, `${diasActiva} días`)
              )
            ),
            plaga.notas && h('div', { className: 'detalle-notas' },
              h('strong', null, 'Notas:'),
              h('p', null, plaga.notas)
            )
          ),

          // Historial de Tratamientos
          h('div', { className: 'detalle-seccion' },
            h('h3', null, 'Historial de Tratamientos'),
            plaga.tratamientos.length === 0 ?
              h('p', { className: 'texto-ayuda' }, 'No se han aplicado tratamientos aún') :
              h('div', { className: 'timeline-tratamientos' },
                plaga.tratamientos
                  .slice()
                  .reverse()
                  .map((tratamiento, idx) =>
                    h('div', { key: idx, className: 'timeline-item' },
                      h('div', { className: 'timeline-marker' }),
                      h('div', { className: 'timeline-content' },
                        h('div', { className: 'timeline-header' },
                          h('strong', null, tratamiento.metodo),
                          h('span', { className: 'timeline-fecha' },
                            new Date(tratamiento.fecha).toLocaleDateString()
                          )
                        ),
                        tratamiento.mejoraObservada && h('div', { className: 'timeline-mejora' },
                          '✅ Mejora observada'
                        ),
                        tratamiento.notas && h('p', { className: 'timeline-notas' },
                          tratamiento.notas
                        )
                      )
                    )
                  )
              )
          ),

          // Acciones
          h('div', { className: 'acciones-plaga' },
            h('h3', null, 'Acciones'),
            h('div', { className: 'acciones-grid' },
              // Añadir tratamiento
              h('button', {
                className: 'btn-accion btn-tratamiento',
                onClick: () => {
                  handleCerrarModalDetalle();
                  handleAbrirModalTratamiento(plaga);
                }
              },
                h(window.Icons.Plus, { size: 18 }),
                h('span', null, 'Añadir tratamiento')
              ),

              // NUEVO: Editar información
              h('button', {
                className: 'btn-accion btn-editar',
                onClick: () => handleAbrirModalEditar(plaga)
              },
                h(window.Icons.Edit, { size: 18 }),
                h('span', null, 'Editar información')
              ),

              // Marcar como controlada
              plaga.estadoControl === 'en_tratamiento' && h('button', {
                className: 'btn-accion btn-controlada',
                onClick: () => handleCambiarEstadoDesdeDetalle('controlada')
              },
                h(window.Icons.CheckCircle, { size: 18 }),
                h('span', null, 'Marcar como controlada')
              ),

              // Resolver
              plaga.estadoControl !== 'resuelta' && h('button', {
                className: 'btn-accion btn-resolver',
                onClick: handleResolver
              },
                h(window.Icons.Check, { size: 18 }),
                h('span', null, 'Resolver plaga')
              ),

              // Eliminar
              h('button', {
                className: 'btn-accion btn-eliminar',
                onClick: handleEliminarDesdeDetalle
              },
                h(window.Icons.Trash2, { size: 18 }),
                h('span', null, 'Eliminar plaga')
              )
            )
          )
        )
      )
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return h('div', { className: 'plagas-view' },
    // Header con estadísticas
    h(HeaderStats, { stats }),

    // Barra de filtros
    h(BarraFiltros),

    // Botón principal
    h('div', { className: 'plagas-acciones-principales' },
      h('button', {
        className: 'btn-primary btn-reportar-plaga',
        onClick: handleAbrirModalNueva
      },
        h(window.Icons.Plus, { size: 20 }),
        h('span', null, 'Reportar Plaga')
      )
    ),

    // Grid de plagas
    plagasFiltradas.length === 0 ?
      h('div', { className: 'empty-state' },
        h(window.Icons.Bug, { size: 48, style: { opacity: 0.3 } }),
        h('p', null, 
          filtroEstado !== 'todas' || filtroCultivo || filtroTipo ?
          'No hay plagas con estos filtros' :
          'No hay plagas reportadas en este huerto'
        )
      ) :
      h('div', { className: 'plagas-grid' },
        plagasFiltradas.map(plaga =>
          h(TarjetaPlaga, { key: plaga.id, plaga })
        )
      ),

    // Modales
    modalNueva && h(ModalNuevaPlaga),
    modalTratamiento && h(ModalTratamiento),
    modalDetalle && h(ModalDetalle),
    
    // NUEVO: Modal Editar
    modalEditar && h(window.ModalEditarPlaga, {
      plaga: modalEditar,
      cultivos,
      onEditar: handleEditarPlaga,
      onCerrar: handleCerrarModalEditar
    })
  );
}

// Exportar
window.PlagasView = PlagasView;
console.log('✅ PlagasView cargado (con edición)');