/**
 * Vista de Gestión de Plagas
 * Componente principal con modales y funcionalidad completa
 */

const { createElement: h, useState, useEffect, useMemo } = React;
const { 
  Sprout, Plus, Filter, AlertCircle, Bug, Droplet, 
  Calendar, Trash2, ChevronRight, X, CheckCircle 
} = window.Icons;

function PlagasView({ 
  plagas, 
  cultivos,
  cultivoPreseleccionado, // ← NUEVO
  onAgregarPlaga,
  onAddTratamiento,
  onCambiarEstado,
  onEliminar,
  onClearPreseleccion // ← NUEVO
}) {
  // Estados
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCultivo, setFiltroCultivo] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [mostrarResueltas, setMostrarResueltas] = useState(false);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalTratamiento, setModalTratamiento] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  // ← NUEVO: Abrir modal automáticamente si hay cultivo preseleccionado
  useEffect(() => {
    if (cultivoPreseleccionado && !modalNueva) {
      setModalNueva(true);
    }
  }, [cultivoPreseleccionado]);

  // Estadísticas
  const stats = useMemo(() => ({
    activas: plagas.filter(p => p.estadoControl === 'activa').length,
    enTratamiento: plagas.filter(p => p.estadoControl === 'en_tratamiento').length,
    controladas: plagas.filter(p => p.estadoControl === 'controlada').length,
    resueltas: plagas.filter(p => p.estadoControl === 'resuelta').length
  }), [plagas]);

  // Plagas filtradas
  const plagasFiltradas = useMemo(() => {
    let resultado = plagas;

    // Filtrar por resueltas
    if (!mostrarResueltas) {
      resultado = resultado.filter(p => p.estadoControl !== 'resuelta');
    }

    // Filtrar por estado
    if (filtroEstado !== 'todas') {
      resultado = resultado.filter(p => p.estadoControl === filtroEstado);
    }

    // Filtrar por cultivo
    if (filtroCultivo) {
      resultado = resultado.filter(p => 
        p.cultivosAfectados.some(c => c.id === filtroCultivo)
      );
    }

    // Filtrar por tipo
    if (filtroTipo) {
      resultado = resultado.filter(p => p.tipoPlaga === filtroTipo);
    }

    // Ordenar por prioridad de estado
    const ordenEstados = { activa: 1, en_tratamiento: 2, controlada: 3, resuelta: 4 };
    resultado.sort((a, b) => {
      const ordenA = ordenEstados[a.estadoControl];
      const ordenB = ordenEstados[b.estadoControl];
      if (ordenA !== ordenB) return ordenA - ordenB;
      return b.fechaDeteccion - a.fechaDeteccion;
    });

    return resultado;
  }, [plagas, filtroEstado, filtroCultivo, filtroTipo, mostrarResueltas]);

  return h('div', { className: 'plagas-view' },
    // Header con estadísticas
    h(HeaderStats, { stats }),
    
    // Barra de filtros
    h(BarraFiltros, {
      filtroEstado,
      setFiltroEstado,
      filtroCultivo,
      setFiltroCultivo,
      filtroTipo,
      setFiltroTipo,
      mostrarResueltas,
      setMostrarResueltas,
      cultivos
    }),

    // Botón principal
    h('div', { className: 'view-actions' },
      h('button', {
        className: 'btn btn-primary',
        onClick: () => setModalNueva(true)
      },
        h(Plus, { size: 18 }),
        h('span', null, 'Reportar Plaga')
      )
    ),

    // Lista de plagas
    h('div', { className: 'plagas-grid' },
      plagasFiltradas.length === 0 
        ? h('div', { className: 'info-box' },
            h('div', { className: 'info-box-header' },
              h(AlertCircle, { size: 20 }),
              h('span', null, 'No hay plagas')
            ),
            h('p', { className: 'info-box-content' },
              filtroEstado !== 'todas' || filtroCultivo || filtroTipo
                ? 'No se encontraron plagas con los filtros aplicados'
                : '¡Genial! No hay plagas reportadas en este huerto'
            )
          )
        : plagasFiltradas.map(plaga => 
            h(TarjetaPlaga, {
              key: plaga.id,
              plaga,
              onVerDetalle: () => setModalDetalle(plaga),
              onAddTratamiento: () => setModalTratamiento(plaga),
              onCambiarEstado,
              onEliminar
            })
          )
    ),

    // Modales
    modalNueva && h(ModalNuevaPlaga, {
      cultivos,
      cultivoPreseleccionado, // ← NUEVO: pasar cultivo
      onClose: () => {
        setModalNueva(false);
        if (onClearPreseleccion) onClearPreseleccion(); // ← NUEVO: limpiar al cerrar
      },
      onSubmit: onAgregarPlaga
    }),

    modalTratamiento && h(ModalTratamiento, {
      plaga: modalTratamiento,
      onClose: () => setModalTratamiento(null),
      onSubmit: onAddTratamiento
    }),

    modalDetalle && h(ModalDetalle, {
      plaga: modalDetalle,
      onClose: () => setModalDetalle(null),
      onAddTratamiento: () => {
        setModalDetalle(null);
        setModalTratamiento(modalDetalle);
      },
      onCambiarEstado,
      onEliminar: (id) => {
        setModalDetalle(null);
        onEliminar(id);
      }
    })
  );
}

// ============ SUB-COMPONENTES ============

function HeaderStats({ stats }) {
  return h('div', { className: 'plagas-stats' },
    h('div', { className: 'stat-item stat-controlada' },
      h('span', { className: 'stat-emoji' }, '🟢'),
      h('span', { className: 'stat-value' }, stats.controladas),
      h('span', { className: 'stat-label' }, 'Controladas')
    ),
    h('div', { className: 'stat-item stat-tratamiento' },
      h('span', { className: 'stat-emoji' }, '🟡'),
      h('span', { className: 'stat-value' }, stats.enTratamiento),
      h('span', { className: 'stat-label' }, 'En tratamiento')
    ),
    h('div', { className: 'stat-item stat-activa' },
      h('span', { className: 'stat-emoji' }, '🔴'),
      h('span', { className: 'stat-value' }, stats.activas),
      h('span', { className: 'stat-label' }, 'Activas')
    )
  );
}

function BarraFiltros({ 
  filtroEstado, setFiltroEstado,
  filtroCultivo, setFiltroCultivo,
  filtroTipo, setFiltroTipo,
  mostrarResueltas, setMostrarResueltas,
  cultivos
}) {
  const tiposPlaga = Object.keys(window.PLAGAS_MALAGA);

  return h('div', { className: 'filtros-container' },
    h('div', { className: 'filtros-row' },
      // Filtro por estado
      h('div', { className: 'filtro-group' },
        h('label', null, 'Estado'),
        h('select', {
          value: filtroEstado,
          onChange: (e) => setFiltroEstado(e.target.value),
          className: 'filter-select'
        },
          h('option', { value: 'todas' }, 'Todas'),
          h('option', { value: 'activa' }, '🔴 Activas'),
          h('option', { value: 'en_tratamiento' }, '🟡 En tratamiento'),
          h('option', { value: 'controlada' }, '🟢 Controladas')
        )
      ),

      // Filtro por cultivo
      h('div', { className: 'filtro-group' },
        h('label', null, 'Cultivo'),
        h('select', {
          value: filtroCultivo || '',
          onChange: (e) => setFiltroCultivo(e.target.value || null),
          className: 'filter-select'
        },
          h('option', { value: '' }, 'Todos los cultivos'),
          cultivos.map(c => 
            h('option', { key: c.id, value: c.id }, `${c.nombre} - ${c.parcela}`)
          )
        )
      ),

      // Filtro por tipo
      h('div', { className: 'filtro-group' },
        h('label', null, 'Tipo de plaga'),
        h('select', {
          value: filtroTipo || '',
          onChange: (e) => setFiltroTipo(e.target.value || null),
          className: 'filter-select'
        },
          h('option', { value: '' }, 'Todos los tipos'),
          tiposPlaga.map(tipo => {
            const info = window.PLAGAS_MALAGA[tipo];
            return h('option', { key: tipo, value: tipo }, 
              `${info.emoji} ${info.nombre}`
            );
          })
        )
      )
    ),

    // Toggle mostrar resueltas
    h('div', { className: 'filtro-toggle' },
      h('label', { className: 'toggle-label' },
        h('input', {
          type: 'checkbox',
          checked: mostrarResueltas,
          onChange: (e) => setMostrarResueltas(e.target.checked)
        }),
        h('span', null, 'Mostrar historial (plagas resueltas)')
      )
    )
  );
}

function TarjetaPlaga({ plaga, onVerDetalle, onAddTratamiento, onCambiarEstado, onEliminar }) {
  const infoCatalogo = window.PlagaService.getInfoTipo(plaga.tipoPlaga);
  const diasActiva = window.PlagaService.diasDesdeDeteccion(plaga);
  const estadoInfo = window.ESTADOS_PLAGA[plaga.estadoControl];
  const ultimoTratamiento = plaga.tratamientos.length > 0 
    ? plaga.tratamientos[plaga.tratamientos.length - 1]
    : null;

  // ← NUEVO: Determinar si la tarjeta debe ser clickeable
  const esResuelta = plaga.estadoControl === 'resuelta';

  return h('div', { 
    className: `plaga-card estado-${plaga.estadoControl}`,
    onClick: () => onVerDetalle(), // ← NUEVO: Click en toda la tarjeta
    style: { cursor: 'pointer' },
    title: 'Click para ver detalles'
  },
    // Header
    h('div', { 
      className: 'plaga-card-header',
      onClick: (e) => e.stopPropagation() // ← NUEVO: Evitar propagación en header
    },
      h('div', { className: 'plaga-title' },
        h('span', { className: 'plaga-emoji' }, infoCatalogo.emoji),
        h('h3', null, infoCatalogo.nombre)
      ),
      h('span', { 
        className: `estado-badge estado-${plaga.estadoControl}` 
      }, 
        estadoInfo.emoji,
        ' ',
        estadoInfo.label
      )
    ),

    // Cultivos afectados
    h('div', { className: 'plaga-cultivos' },
      h(Sprout, { size: 16 }),
      h('span', null, 
        plaga.cultivosAfectados.map(c => `${c.nombre} (${c.parcela})`).join(', ')
      )
    ),

    // Info adicional
    h('div', { className: 'plaga-info' },
      h('div', { className: 'info-item' },
        h(Calendar, { size: 14 }),
        h('span', null, `Hace ${diasActiva} día${diasActiva !== 1 ? 's' : ''}`)
      ),
      ultimoTratamiento && h('div', { className: 'info-item' },
        h(Droplet, { size: 14 }),
        h('span', null, `Último: ${ultimoTratamiento.metodo}`)
      )
    ),

    // Acciones - NUEVO: Siempre visible y mejorado
    h('div', { 
      className: 'plaga-actions',
      onClick: (e) => e.stopPropagation() // ← NUEVO: Evitar propagación en acciones
    },
      // Botón añadir tratamiento
      h('button', {
        className: 'btn-icon btn-action',
        onClick: (e) => {
          e.stopPropagation();
          onAddTratamiento();
        },
        title: 'Añadir tratamiento',
        disabled: esResuelta
      },
        h(Plus, { size: 16 })
      ),
      
      // Botón cambiar a controlada (solo si está en tratamiento)
      plaga.estadoControl === 'en_tratamiento' && h('button', {
        className: 'btn-text btn-success btn-compact',
        onClick: (e) => {
          e.stopPropagation();
          onCambiarEstado(plaga.id, 'controlada');
        },
        title: 'Marcar como controlada'
      }, 
        h(CheckCircle, { size: 14 }),
        ' Controlada'
      ),

      // Botón resolver - SIEMPRE VISIBLE (excepto si ya está resuelta)
      !esResuelta && h('button', {
        className: 'btn-text btn-resolver btn-compact',
        onClick: (e) => {
          e.stopPropagation();
          if (confirm('¿Marcar esta plaga como resuelta? Se archivará en el historial.')) {
            onCambiarEstado(plaga.id, 'resuelta');
          }
        },
        title: 'Resolver plaga'
      }, 
        h(CheckCircle, { size: 14 }),
        ' Resolver'
      ),
      
      // Botón eliminar
      h('button', {
        className: 'btn-icon btn-danger',
        onClick: (e) => {
          e.stopPropagation();
          if (confirm('¿Eliminar esta plaga?')) {
            onEliminar(plaga.id);
          }
        },
        title: 'Eliminar'
      },
        h(Trash2, { size: 16 })
      )
    )
  );
}

// ============ MODALES ============

function ModalNuevaPlaga({ cultivos, cultivoPreseleccionado, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tipoPlaga: '',
    cultivosIds: [],
    severidad: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);

  // ← NUEVO: useEffect para preseleccionar cultivo cuando cambia
  useEffect(() => {
    if (cultivoPreseleccionado) {
      setFormData(prev => ({
        ...prev,
        cultivosIds: [cultivoPreseleccionado.id]
      }));
    }
  }, [cultivoPreseleccionado]);

  const infoCatalogo = formData.tipoPlaga 
    ? window.PlagaService.getInfoTipo(formData.tipoPlaga)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tipoPlaga || formData.cultivosIds.length === 0 || !formData.severidad) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      alert('Error al crear plaga: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCultivo = (cultivoId) => {
    setFormData(prev => ({
      ...prev,
      cultivosIds: prev.cultivosIds.includes(cultivoId)
        ? prev.cultivosIds.filter(id => id !== cultivoId)
        : [...prev.cultivosIds, cultivoId]
    }));
  };

  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { 
      className: 'modal-content modal-large',
      onClick: (e) => e.stopPropagation()
    },
      h('div', { className: 'modal-header' },
        h('h2', null, h(Bug, { size: 24 }), ' Reportar Nueva Plaga'),
        h('button', { className: 'btn-close', onClick: onClose },
          h(X, { size: 20 })
        )
      ),

      h('form', { onSubmit: handleSubmit },
        h('div', { className: 'modal-body' },
          
          // Tipo de plaga
          h('div', { className: 'form-group' },
            h('label', null, 'Tipo de plaga *'),
            h('select', {
              value: formData.tipoPlaga,
              onChange: (e) => setFormData(prev => ({ ...prev, tipoPlaga: e.target.value })),
              required: true
            },
              h('option', { value: '' }, 'Selecciona el tipo de plaga'),
              Object.entries(window.PLAGAS_MALAGA).map(([key, info]) =>
                h('option', { key, value: key }, `${info.emoji} ${info.nombre}`)
              )
            )
          ),

          // Sugerencias de tratamiento
          infoCatalogo && h('div', { className: 'info-box info-box-tratamientos' },
            h('div', { className: 'info-box-header' },
              h(AlertCircle, { size: 18 }),
              h('strong', null, '💡 Tratamientos recomendados')
            ),
            h('div', { className: 'info-box-content' },
              h('p', { className: 'text-small' }, infoCatalogo.descripcion),
              h('ul', { className: 'tratamientos-list' },
                infoCatalogo.tratamientos.slice(0, 5).map((t, i) =>
                  h('li', { key: i }, t)
                )
              )
            )
          ),

          // Cultivos afectados
          h('div', { className: 'form-group' },
            h('label', null, 'Cultivo(s) afectado(s) *'),
            cultivoPreseleccionado && h('div', { 
              className: 'info-box',
              style: { marginBottom: 'var(--space-3)', padding: 'var(--space-3)' }
            },
              h('p', { style: { margin: 0, fontSize: '0.875rem' } },
                '🌱 Reportando plaga para: ',
                h('strong', null, `${cultivoPreseleccionado.nombre} - ${cultivoPreseleccionado.parcela}`)
              )
            ),
            h('div', { className: 'cultivos-checkbox-group' },
              cultivos.length === 0 
                ? h('p', { className: 'text-muted' }, 'No hay cultivos en este huerto')
                : cultivos.map(cultivo =>
                    h('label', { key: cultivo.id, className: 'checkbox-label' },
                      h('input', {
                        type: 'checkbox',
                        checked: formData.cultivosIds.includes(cultivo.id),
                        onChange: () => toggleCultivo(cultivo.id)
                      }),
                      h('span', null, `${cultivo.nombre} - ${cultivo.parcela}`)
                    )
                  )
            )
          ),

          // Severidad
          h('div', { className: 'form-group' },
            h('label', null, 'Severidad *'),
            h('div', { className: 'severidad-options' },
              Object.entries(window.SEVERIDADES).map(([key, info]) =>
                h('label', { 
                  key, 
                  className: `severidad-option ${formData.severidad === key ? 'selected' : ''}`
                },
                  h('input', {
                    type: 'radio',
                    name: 'severidad',
                    value: key,
                    checked: formData.severidad === key,
                    onChange: (e) => setFormData(prev => ({ ...prev, severidad: e.target.value }))
                  }),
                  h('div', { className: 'severidad-content' },
                    h('span', { className: 'severidad-emoji' }, info.emoji),
                    h('strong', null, info.label),
                    h('p', { className: 'text-small' }, info.descripcion)
                  )
                )
              )
            )
          ),

          // Notas
          h('div', { className: 'form-group' },
            h('label', null, 'Notas iniciales (opcional)'),
            h('textarea', {
              value: formData.notas,
              onChange: (e) => setFormData(prev => ({ ...prev, notas: e.target.value })),
              rows: 3,
              placeholder: 'Observaciones adicionales sobre la plaga...'
            })
          )
        ),

        h('div', { className: 'modal-footer' },
          h('button', { 
            type: 'button', 
            className: 'btn btn-secondary',
            onClick: onClose 
          }, 'Cancelar'),
          h('button', { 
            type: 'submit', 
            className: 'btn btn-primary',
            disabled: loading
          }, loading ? 'Guardando...' : 'Reportar Plaga')
        )
      )
    )
  );
}

function ModalTratamiento({ plaga, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    metodo: '',
    notas: '',
    mejoraObservada: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.metodo) {
      alert('Por favor selecciona un método de tratamiento');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(plaga.id, formData);
      onClose();
    } catch (error) {
      alert('Error al añadir tratamiento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { 
      className: 'modal-content',
      onClick: (e) => e.stopPropagation()
    },
      h('div', { className: 'modal-header' },
        h('h2', null, h(Droplet, { size: 24 }), ' Registrar Tratamiento'),
        h('button', { className: 'btn-close', onClick: onClose },
          h(X, { size: 20 })
        )
      ),

      h('form', { onSubmit: handleSubmit },
        h('div', { className: 'modal-body' },
          
          // Método
          h('div', { className: 'form-group' },
            h('label', null, 'Método aplicado *'),
            h('select', {
              value: formData.metodo,
              onChange: (e) => setFormData(prev => ({ ...prev, metodo: e.target.value })),
              required: true
            },
              h('option', { value: '' }, 'Selecciona el método'),
              window.METODOS_TRATAMIENTO.map((metodo, i) =>
                h('option', { key: i, value: metodo }, metodo)
              )
            )
          ),

          // Notas
          h('div', { className: 'form-group' },
            h('label', null, 'Notas sobre la aplicación'),
            h('textarea', {
              value: formData.notas,
              onChange: (e) => setFormData(prev => ({ ...prev, notas: e.target.value })),
              rows: 3,
              placeholder: 'Detalles de cómo/dónde se aplicó el tratamiento...'
            })
          ),

          // Mejora observada
          h('div', { className: 'form-group' },
            h('label', { className: 'checkbox-label' },
              h('input', {
                type: 'checkbox',
                checked: formData.mejoraObservada,
                onChange: (e) => setFormData(prev => ({ ...prev, mejoraObservada: e.target.checked }))
              }),
              h('span', null, '✓ Se observa mejoría tras este tratamiento')
            )
          )
        ),

        h('div', { className: 'modal-footer' },
          h('button', { 
            type: 'button', 
            className: 'btn btn-secondary',
            onClick: onClose 
          }, 'Cancelar'),
          h('button', { 
            type: 'submit', 
            className: 'btn btn-primary',
            disabled: loading
          }, loading ? 'Guardando...' : 'Registrar Tratamiento')
        )
      )
    )
  );
}

function ModalDetalle({ plaga, onClose, onAddTratamiento, onCambiarEstado, onEliminar }) {
  const infoCatalogo = window.PlagaService.getInfoTipo(plaga.tipoPlaga);
  const diasActiva = window.PlagaService.diasDesdeDeteccion(plaga);
  const estadoInfo = window.ESTADOS_PLAGA[plaga.estadoControl];
  const severidadInfo = window.SEVERIDADES[plaga.severidad];

  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { 
      className: 'modal-content modal-large',
      onClick: (e) => e.stopPropagation()
    },
      h('div', { className: 'modal-header' },
        h('h2', null, 
          h('span', { className: 'plaga-emoji-large' }, infoCatalogo.emoji),
          ' ',
          infoCatalogo.nombre
        ),
        h('button', { className: 'btn-close', onClick: onClose },
          h(X, { size: 20 })
        )
      ),

      h('div', { className: 'modal-body' },
        
        // Información general
        h('section', { className: 'detalle-section' },
          h('h3', null, 'Información General'),
          h('div', { className: 'detalle-grid' },
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Estado:'),
              h('span', { className: `estado-badge estado-${plaga.estadoControl}` },
                estadoInfo.emoji, ' ', estadoInfo.label
              )
            ),
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Severidad:'),
              h('span', null, severidadInfo.emoji, ' ', severidadInfo.label)
            ),
            h('div', { className: 'detalle-item' },
              h('strong', null, 'Detectada:'),
              h('span', null, plaga.fechaDeteccion.toLocaleDateString(), ` (hace ${diasActiva} días)`)
            ),
            plaga.fechaResolucion && h('div', { className: 'detalle-item' },
              h('strong', null, 'Resuelta:'),
              h('span', null, plaga.fechaResolucion.toLocaleDateString())
            )
          )
        ),

        // Cultivos afectados
        h('section', { className: 'detalle-section' },
          h('h3', null, 'Cultivos Afectados'),
          h('div', { className: 'cultivos-list' },
            plaga.cultivosAfectados.map(c =>
              h('span', { key: c.id, className: 'cultivo-tag' },
                `${c.nombre} - ${c.parcela}`
              )
            )
          )
        ),

        // Notas
        plaga.notas && h('section', { className: 'detalle-section' },
          h('h3', null, 'Notas'),
          h('p', null, plaga.notas)
        ),

        // Timeline de tratamientos
        h('section', { className: 'detalle-section' },
          h('h3', null, 'Historial de Tratamientos'),
          plaga.tratamientos.length === 0 
            ? h('p', { className: 'text-muted' }, 'No se han aplicado tratamientos aún')
            : h('div', { className: 'timeline' },
                plaga.tratamientos.slice().reverse().map((t, i) =>
                  h('div', { key: i, className: 'timeline-item' },
                    h('div', { className: 'timeline-marker' }),
                    h('div', { className: 'timeline-content' },
                      h('div', { className: 'timeline-header' },
                        h('strong', null, t.metodo),
                        h('span', { className: 'timeline-date' },
                          t.fecha.toLocaleDateString()
                        )
                      ),
                      t.mejoraObservada && h('div', { className: 'timeline-mejora' },
                        h(CheckCircle, { size: 14 }),
                        h('span', null, 'Mejora observada')
                      ),
                      t.notas && h('p', { className: 'timeline-notes' }, t.notas)
                    )
                  )
                )
              )
        )
      ),

      h('div', { className: 'modal-footer' },
        h('button', {
          className: 'btn btn-danger',
          onClick: () => onEliminar(plaga.id)
        }, 'Eliminar'),
        
        h('div', { className: 'modal-footer-right' },
          h('button', {
            className: 'btn btn-secondary',
            onClick: onAddTratamiento
          }, h(Plus, { size: 16 }), ' Añadir Tratamiento'),
          
          plaga.estadoControl === 'en_tratamiento' && h('button', {
            className: 'btn btn-success',
            onClick: () => {
              onCambiarEstado(plaga.id, 'controlada');
              onClose();
            }
          }, '✓ Marcar como Controlada'),
          
          plaga.estadoControl === 'controlada' && h('button', {
            className: 'btn btn-success',
            onClick: () => {
              onCambiarEstado(plaga.id, 'resuelta');
              onClose();
            }
          }, '✓ Marcar como Resuelta')
        )
      )
    )
  );
}

// Exportar
window.PlagasView = PlagasView;