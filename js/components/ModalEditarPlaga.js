/**
 * Modal para Editar Información Básica de una Plaga
 * Se integra en PlagasView.js
 */

function ModalEditarPlaga({ plaga, cultivos, onEditar, onCerrar }) {
  const { useState, useEffect, createElement: h } = React;

  // Estados del formulario
  const [tipoPlaga, setTipoPlaga] = useState(plaga.tipoPlaga);
  const [cultivosSeleccionados, setCultivosSeleccionados] = useState(
    plaga.cultivosAfectados.map(c => c.id)
  );
  const [severidad, setSeveridad] = useState(plaga.severidad);
  const [notas, setNotas] = useState(plaga.notas || '');
  const [guardando, setGuardando] = useState(false);

  // Info del tipo de plaga seleccionado
  const infoPlaga = window.PLAGAS_MALAGA?.[tipoPlaga];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!tipoPlaga) {
      alert('❌ Debes seleccionar un tipo de plaga');
      return;
    }

    if (cultivosSeleccionados.length === 0) {
      alert('❌ Debes seleccionar al menos un cultivo afectado');
      return;
    }

    if (!severidad) {
      alert('❌ Debes seleccionar el nivel de severidad');
      return;
    }

    setGuardando(true);

    try {
      await onEditar(plaga.id, {
        tipoPlaga,
        cultivosAfectados: cultivosSeleccionados,
        severidad,
        notas: notas.trim()
      });
      onCerrar();
    } catch (error) {
      console.error('Error al editar plaga:', error);
      alert('❌ Error al editar la plaga');
    } finally {
      setGuardando(false);
    }
  };

  const toggleCultivo = (cultivoId) => {
    if (cultivosSeleccionados.includes(cultivoId)) {
      setCultivosSeleccionados(cultivosSeleccionados.filter(id => id !== cultivoId));
    } else {
      setCultivosSeleccionados([...cultivosSeleccionados, cultivoId]);
    }
  };

  return h('div', { className: 'modal-overlay', onClick: onCerrar },
    h('div', { 
      className: 'modal-content modal-editar-plaga',
      onClick: (e) => e.stopPropagation()
    },
      // Header
      h('div', { className: 'modal-header' },
        h('h2', null, '✏️ Editar Plaga'),
        h('button', {
          className: 'modal-close',
          onClick: onCerrar,
          'aria-label': 'Cerrar'
        }, '×')
      ),

      // Formulario
      h('form', { className: 'modal-body', onSubmit: handleSubmit },
        
        // Tipo de Plaga
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

        // Info box con tratamientos recomendados
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
              infoPlaga.tratamientos.map((tratamiento, idx) =>
                h('li', { key: idx }, `• ${tratamiento}`)
              )
            )
          )
        ),

        // Cultivos Afectados
        h('div', { className: 'form-group' },
          h('label', { className: 'form-label' },
            'Cultivo(s) afectado(s) ',
            h('span', { className: 'required' }, '*')
          ),
          h('div', { className: 'checkbox-grid' },
            cultivos.length === 0 ?
              h('p', { className: 'texto-ayuda' },
                'No hay cultivos en este huerto. Crea cultivos primero.'
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
          h('label', { className: 'form-label' }, 'Notas'),
          h('textarea', {
            className: 'form-textarea',
            value: notas,
            onChange: (e) => setNotas(e.target.value),
            placeholder: 'Observaciones adicionales sobre la plaga...',
            rows: 3
          })
        ),

        // Botones
        h('div', { className: 'modal-footer' },
          h('button', {
            type: 'button',
            className: 'btn-secondary',
            onClick: onCerrar,
            disabled: guardando
          }, 'Cancelar'),
          h('button', {
            type: 'submit',
            className: 'btn-primary',
            disabled: guardando
          }, guardando ? 'Guardando...' : 'Guardar Cambios')
        )
      )
    )
  );
}

// Exportar para usar en PlagasView
window.ModalEditarPlaga = ModalEditarPlaga;
console.log('✅ ModalEditarPlaga cargado');
