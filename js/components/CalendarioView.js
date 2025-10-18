/**
 * Componente CalendarioView
 * Vista completa del calendario de siembra mensual para Málaga
 */

function CalendarioView() {
  const h = React.createElement;
  const { useState } = React;
  const mesActual = new Date().getMonth();
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
  
  const infoMes = window.CALENDARIO_MALAGA[mesSeleccionado];
  const nombreMes = window.MESES[mesSeleccionado];

  return h('div', null,
    // Header con selector de mes
    h('div', { className: 'card mb-6' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-2 mb-6' }, 'Calendario de Siembra - Málaga'),
        
        h('div', { className: 'form-group' },
          h('label', { htmlFor: 'mes-selector', className: 'form-label' }, 'Seleccionar mes'),
          h('select', {
            id: 'mes-selector',
            value: mesSeleccionado,
            onChange: (e) => setMesSeleccionado(parseInt(e.target.value)),
            className: 'form-select form-select-lg'
          },
            ...window.MESES.map((mes, idx) => 
              h('option', { key: idx, value: idx }, 
                mes + (idx === mesActual ? ' (Mes actual)' : '')
              )
            )
          )
        ),

        // Info del clima
        h('div', { 
          className: 'info-box', 
          style: { marginTop: 'var(--space-6)', marginBottom: 0 } 
        },
          h('div', { className: 'info-box-header' },
            h(window.Icons.Thermometer, { size: 20 }),
            h('span', null, 'Clima de ' + nombreMes)
          ),
          h('p', { className: 'info-box-content' }, infoMes.clima)
        )
      )
    ),

    // Grid de información
    h('div', { className: 'calendar-grid' },
      // Siembra Directa
      h('div', { 
        className: 'calendar-section', 
        style: { background: '#D1FAE5' } 
      },
        h('h3', { 
          className: 'calendar-section-title', 
          style: { color: '#065F46' } 
        },
          h(window.Icons.Sprout, { size: 24 }),
          'Siembra Directa'
        ),
        infoMes.siembraDirecta.length > 0 ?
          h('div', { className: 'tag-list' },
            ...infoMes.siembraDirecta.map((cultivo, idx) =>
              h('span', { key: idx, className: 'tag tag-siembra' }, cultivo)
            )
          ) :
          h('p', { className: 'text-small text-muted' }, 'No hay siembras directas este mes')
      ),

      // Semilleros
      h('div', { 
        className: 'calendar-section', 
        style: { background: '#FEF3C7' } 
      },
        h('h3', { 
          className: 'calendar-section-title', 
          style: { color: '#92400E' } 
        }, '🌱 Semilleros'),
        infoMes.semilleros.length > 0 ?
          h('div', { className: 'tag-list' },
            ...infoMes.semilleros.map((cultivo, idx) =>
              h('span', { key: idx, className: 'tag tag-semillero' }, cultivo)
            )
          ) :
          h('p', { className: 'text-small text-muted' }, 'No hay semilleros este mes')
      ),

      // Trasplante
      h('div', { 
        className: 'calendar-section', 
        style: { background: '#DBEAFE' } 
      },
        h('h3', { 
          className: 'calendar-section-title', 
          style: { color: '#1E40AF' } 
        }, '🌿 Trasplante'),
        infoMes.trasplante.length > 0 ?
          h('div', { className: 'tag-list' },
            ...infoMes.trasplante.map((cultivo, idx) =>
              h('span', { key: idx, className: 'tag tag-trasplante' }, cultivo)
            )
          ) :
          h('p', { className: 'text-small text-muted' }, 'No hay trasplantes este mes')
      ),

      // Cosecha
      h('div', { 
        className: 'calendar-section', 
        style: { background: '#FED7AA' } 
      },
        h('h3', { 
          className: 'calendar-section-title', 
          style: { color: '#9A3412' } 
        }, '🍅 Cosecha'),
        infoMes.cosecha.length > 0 ?
          h('div', { className: 'tag-list' },
            ...infoMes.cosecha.map((cultivo, idx) =>
              h('span', { key: idx, className: 'tag tag-cosecha' }, cultivo)
            )
          ) :
          h('p', { className: 'text-small text-muted' }, 'No hay cosechas este mes')
      )
    ),

    // Tareas del mes
    h('div', { className: 'card', style: { marginTop: 'var(--space-6)' } },
      h('div', { 
        className: 'card-body', 
        style: { background: '#F3E8FF' } 
      },
        h('h3', { 
          className: 'heading-3 mb-6', 
          style: { color: '#6B21A8' } 
        }, '✅ Tareas del Mes'),
        h('ul', { 
          style: { 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          } 
        },
          ...infoMes.tareas.map((tarea, idx) =>
            h('li', { 
              key: idx,
              style: { 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--space-3)', 
                marginBottom: 'var(--space-3)',
                padding: 'var(--space-3)',
                background: 'white',
                borderRadius: 'var(--radius-lg)'
              } 
            },
              h('span', { 
                style: { 
                  color: '#6B21A8', 
                  fontWeight: 'bold', 
                  fontSize: '1.2em' 
                } 
              }, '•'),
              h('span', { 
                style: { 
                  flex: 1, 
                  color: 'var(--color-neutral-700)' 
                } 
              }, tarea)
            )
          )
        )
      )
    )
  );
}

// IMPORTANTE: Este es CalendarioView
window.CalendarioView = CalendarioView;