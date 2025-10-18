/**
 * Componente HuertosSelector
 * Selector de huerto activo y gestión de huertos
 */

function HuertosSelector({ huertos, huertoActual, onSeleccionar, onRecargar }) {
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarGestion, setMostrarGestion] = useState(false);

  // Prevenir que los clicks en botones cierren modales
  const handleAbrirModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setMostrarModal(true);
  };

  const handleAbrirGestion = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setMostrarGestion(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleCerrarGestion = () => {
    setMostrarGestion(false);
  };

  // DEBUG: Botón temporal para listar usuarios
  const handleDebugUsuarios = async () => {
    console.log('Ejecutando debug de usuarios...');
    await window.HuertoService.debugListarUsuarios();
  };

  if (huertos.length === 0) {
    return h('div', { className: 'info-box', style: { marginBottom: 'var(--space-6)' } },
      h('div', { className: 'info-box-header' },
        h(window.Icons.AlertCircle, { size: 20 }),
        h('span', null, 'Sin huertos')
      ),
      h('div', { className: 'info-box-content' },
        h('p', { style: { marginBottom: 'var(--space-4)' } }, 
          'No tienes huertos todavía. Crea tu primer huerto para comenzar.'
        ),
        h('button', {
          onClick: () => setMostrarModal(true),
          className: 'btn btn-primary'
        },
          h(window.Icons.Plus, { size: 20 }),
          'Crear Huerto'
        )
      ),
      mostrarModal && h(ModalNuevoHuerto, {
        onCerrar: () => setMostrarModal(false),
        onCreado: () => {
          setMostrarModal(false);
          onRecargar();
        }
      })
    );
  }

  const huerto = huertos.find(h => h.id === huertoActual);

  return h(React.Fragment, null,
    h('div', { 
      className: 'card',
      style: { marginBottom: 'var(--space-6)' }
    },
      h('div', { className: 'card-body' },
      h('div', { 
        style: { 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap'
        } 
      },
        // Selector
        h('div', { style: { flex: 1, minWidth: '250px' } },
          h('label', { className: 'form-label', style: { marginBottom: 'var(--space-2)' } },
            'Huerto activo'
          ),
          h('select', {
            value: huertoActual || '',
            onChange: (e) => {
              e.stopPropagation();
              onSeleccionar(e.target.value);
            },
            className: 'form-select form-select-lg'
          },
            ...huertos.map(h => 
              React.createElement('option', { key: h.id, value: h.id },
                `${h.nombre} - ${h.ciudad}${h.esDueno ? '' : ' (colaborador)'}`
              )
            )
          )
        ),

        // Botones
        h('div', { 
          style: { 
            display: 'flex', 
            gap: 'var(--space-3)',
            alignItems: 'flex-end'
          } 
        },
          h('button', {
            onClick: handleAbrirModal,
            className: 'btn btn-outline',
            title: 'Crear nuevo huerto'
          },
            h(window.Icons.Plus, { size: 20 }),
            h('span', { className: 'mobile-hidden' }, 'Nuevo')
          ),
          huerto && h('button', {
            onClick: handleAbrirGestion,
            className: 'btn btn-ghost',
            title: 'Gestionar huerto'
          },
            h(window.Icons.Info, { size: 20 }),
            h('span', { className: 'mobile-hidden' }, 'Gestionar')
          ),
          h('button', {
            onClick: handleDebugUsuarios,
            className: 'btn btn-ghost',
            title: 'Debug: Listar usuarios',
            style: { background: '#FEE2E2', color: '#DC2626' }
          },
            h(window.Icons.Info, { size: 20 }),
            h('span', { className: 'mobile-hidden' }, '🐛 Debug')
          )
        )
      )
    ),

    // Modales renderizados FUERA del card
    mostrarModal && h(ModalNuevoHuerto, {
      onCerrar: handleCerrarModal,
      onCreado: () => {
        handleCerrarModal();
        onRecargar();
      }
    }),

    mostrarGestion && huerto && h(ModalGestionHuerto, {
      huerto: huerto,
      onCerrar: handleCerrarGestion,
      onActualizado: () => {
        handleCerrarGestion();
        onRecargar();
      }
    })
  ));
}

function ModalNuevoHuerto({ onCerrar, onCreado }) {
  const h = React.createElement;
  const { useState, useRef, useEffect } = React;
  
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('Málaga');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => setListo(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!listo) return;
    
    const handleClickOutside = (e) => {
      if (modalRef.current && e.target === modalRef.current) {
        onCerrar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onCerrar, listo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await window.HuertoService.create({ nombre, ciudad });
      onCreado();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (!listo) return null;

  const modalContent = h('div', { 
    ref: modalRef,
    className: 'modal-overlay',
    style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }
  },
    h('div', { 
      className: 'modal-content'
    },
      h('div', { className: 'modal-header' },
        h('h2', { className: 'heading-3' }, 'Crear Nuevo Huerto'),
        h('button', {
          onClick: onCerrar,
          className: 'btn btn-ghost btn-sm'
        }, h(window.Icons.X, { size: 20 }))
      ),

      h('form', { onSubmit: handleSubmit },
        h('div', { className: 'modal-body' },
          error && h('div', { 
            style: { 
              padding: 'var(--space-3)', 
              background: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--font-size-sm)'
            } 
          }, error),

          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'huerto-nombre', className: 'form-label form-label-required' },
              'Nombre del huerto'
            ),
            h('input', {
              id: 'huerto-nombre',
              type: 'text',
              value: nombre,
              onChange: (e) => setNombre(e.target.value),
              className: 'form-input',
              placeholder: 'ej: Mi Huerto Urbano',
              required: true,
              disabled: cargando
            })
          ),

          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'huerto-ciudad', className: 'form-label form-label-required' },
              'Ciudad'
            ),
            h('input', {
              id: 'huerto-ciudad',
              type: 'text',
              value: ciudad,
              onChange: (e) => setCiudad(e.target.value),
              className: 'form-input',
              placeholder: 'ej: Málaga',
              required: true,
              disabled: cargando
            })
          )
        ),

        h('div', { className: 'modal-footer' },
          h('button', {
            type: 'button',
            onClick: onCerrar,
            className: 'btn btn-ghost',
            disabled: cargando
          }, 'Cancelar'),
          h('button', {
            type: 'submit',
            className: 'btn btn-primary',
            disabled: cargando
          },
            cargando && h('div', { className: 'spinner spinner-sm' }),
            cargando ? 'Creando...' : 'Crear Huerto'
          )
        )
      )
    )
  );

  // Usar ReactDOM.createPortal para renderizar en body
  if (typeof ReactDOM.createPortal !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
}

function ModalGestionHuerto({ huerto, onCerrar, onActualizado }) {
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  
  const [tab, setTab] = useState('info');
  const [detalles, setDetalles] = useState(null);
  const [emailInvitar, setEmailInvitar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => setListo(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    cargarDetalles();
  }, [huerto.id]);

  useEffect(() => {
    if (!listo) return;
    
    const handleClickOutside = (e) => {
      if (modalRef.current && e.target === modalRef.current) {
        onCerrar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onCerrar, listo]);

  const cargarDetalles = async () => {
    try {
      const data = await window.HuertoService.getById(huerto.id);
      setDetalles(data);
    } catch (err) {
      setError('Error al cargar detalles');
    }
  };

  const handleInvitar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await window.HuertoService.invitarColaborador(huerto.id, emailInvitar);
      setEmailInvitar('');
      await cargarDetalles();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleQuitar = async (colaboradorId) => {
    if (!confirm('¿Quitar a este colaborador?')) return;
    
    try {
      await window.HuertoService.quitarColaborador(huerto.id, colaboradorId);
      await cargarDetalles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async () => {
    if (!confirm(`¿Eliminar el huerto "${huerto.nombre}"? Esto eliminará todos los cultivos y tareas.`)) {
      return;
    }
    
    try {
      await window.HuertoService.delete(huerto.id);
      onActualizado();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!listo) return null;

  if (!detalles) {
    const loadingContent = h('div', { 
      ref: modalRef,
      className: 'modal-overlay',
      style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }
    },
      h('div', { className: 'modal-content' },
        h('div', { className: 'loading-container' },
          h('div', { className: 'spinner' })
        )
      )
    );
    
    if (typeof ReactDOM.createPortal !== 'undefined') {
      return ReactDOM.createPortal(loadingContent, document.body);
    }
    return loadingContent;
  }

  const modalContent = h('div', { 
    ref: modalRef,
    className: 'modal-overlay',
    style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }
  },
    h('div', { 
      className: 'modal-content modal-lg'
    },
      h('div', { className: 'modal-header' },
        h('h2', { className: 'heading-3' }, `Gestionar: ${huerto.nombre}`),
        h('button', {
          onClick: onCerrar,
          className: 'btn btn-ghost btn-sm'
        }, h(window.Icons.X, { size: 20 }))
      ),

      // Tabs
      h('div', { 
        style: { 
          display: 'flex', 
          gap: 'var(--space-2)',
          padding: 'var(--space-4)',
          borderBottom: '2px solid var(--color-neutral-200)'
        } 
      },
        h('button', {
          onClick: () => setTab('info'),
          className: `btn btn-sm ${tab === 'info' ? 'btn-primary' : 'btn-ghost'}`
        }, 'Información'),
        h('button', {
          onClick: () => setTab('colaboradores'),
          className: `btn btn-sm ${tab === 'colaboradores' ? 'btn-primary' : 'btn-ghost'}`
        }, `Colaboradores (${detalles.colaboradores.length})`)
      ),

      h('div', { className: 'modal-body' },
        error && h('div', { 
          style: { 
            padding: 'var(--space-3)', 
            background: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--font-size-sm)'
          } 
        }, error),

        // Tab Información
        tab === 'info' && h('div', null,
          h('div', { style: { marginBottom: 'var(--space-6)' } },
            h('p', { className: 'text-small text-muted', style: { marginBottom: 'var(--space-2)' } }, 
              'Nombre'
            ),
            h('p', { className: 'text-semibold' }, detalles.nombre)
          ),
          h('div', { style: { marginBottom: 'var(--space-6)' } },
            h('p', { className: 'text-small text-muted', style: { marginBottom: 'var(--space-2)' } }, 
              'Ciudad'
            ),
            h('p', { className: 'text-semibold' }, detalles.ciudad)
          ),
          h('div', { style: { marginBottom: 'var(--space-6)' } },
            h('p', { className: 'text-small text-muted', style: { marginBottom: 'var(--space-2)' } }, 
              'Dueño'
            ),
            h('p', { className: 'text-semibold' }, 
              `${detalles.duenoNombre} (${detalles.duenoEmail})`
            )
          ),

          detalles.esDueno && h('div', { 
            style: { 
              padding: 'var(--space-4)',
              background: 'var(--color-error-bg)',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid var(--color-error)'
            } 
          },
            h('p', { 
              className: 'text-semibold',
              style: { color: 'var(--color-error)', marginBottom: 'var(--space-3)' }
            }, '⚠️ Zona de peligro'),
            h('p', { 
              className: 'text-small',
              style: { marginBottom: 'var(--space-4)' }
            }, 'Eliminar el huerto borrará todos los cultivos, tareas y datos asociados.'),
            h('button', {
              onClick: handleEliminar,
              className: 'btn btn-danger'
            },
              h(window.Icons.Trash2, { size: 20 }),
              'Eliminar Huerto'
            )
          )
        ),

        // Tab Colaboradores
        tab === 'colaboradores' && h('div', null,
          detalles.esDueno && h('div', { style: { marginBottom: 'var(--space-6)' } },
            h('h4', { className: 'heading-4', style: { marginBottom: 'var(--space-4)' } },
              'Invitar Colaborador'
            ),
            h('form', { onSubmit: handleInvitar },
              h('div', { style: { display: 'flex', gap: 'var(--space-3)' } },
                h('input', {
                  type: 'email',
                  value: emailInvitar,
                  onChange: (e) => setEmailInvitar(e.target.value),
                  className: 'form-input',
                  placeholder: 'email@ejemplo.com',
                  required: true,
                  disabled: cargando
                }),
                h('button', {
                  type: 'submit',
                  className: 'btn btn-primary',
                  disabled: cargando
                },
                  cargando ? 'Invitando...' : 'Invitar'
                )
              )
            )
          ),

          h('h4', { className: 'heading-4', style: { marginBottom: 'var(--space-4)' } },
            `Colaboradores (${detalles.colaboradores.length})`
          ),

          detalles.colaboradores.length === 0 ?
            h('p', { className: 'text-small text-muted' }, 
              'No hay colaboradores todavía'
            ) :
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
              ...detalles.colaboradores.map(col =>
                h('div', {
                  key: col.id,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4)',
                    background: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-lg)'
                  }
                },
                  h('div', null,
                    h('p', { className: 'text-semibold' }, col.nombre),
                    h('p', { className: 'text-small text-muted' }, col.email)
                  ),
                  detalles.esDueno && h('button', {
                    onClick: () => handleQuitar(col.id),
                    className: 'btn btn-ghost btn-sm'
                  },
                    h(window.Icons.Trash2, { size: 18 }),
                    'Quitar'
                  )
                )
              )
            )
        )
      ),

      h('div', { className: 'modal-footer' },
        h('button', {
          onClick: onCerrar,
          className: 'btn btn-ghost'
        }, 'Cerrar'        )
      )
    )
  );

  // Usar ReactDOM.createPortal para renderizar en body
  if (typeof ReactDOM.createPortal !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
}

window.HuertosSelector = HuertosSelector;