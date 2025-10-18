/**
 * Componente CalendarioView
 * Vista del calendario de siembra mensual para Málaga
 */

function CalendarioView() {
  const h = React.createElement;
  const { useState } = React;
  const [mes, setMes] = useState(new Date().getMonth());
  const info = window.CALENDARIO_MALAGA[mes];
  const nombre = window.MESES[mes];

  return h('div', null,
    h('div', { className: 'card mb-6' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-2 mb-6' }, 'Calendario - Málaga'),
        h('select', {
          value: mes,
          onChange: (e) => setMes(parseInt(e.target.value)),
          className: 'form-select form-select-lg'
        },
          ...window.MESES.map((m, i) => h('option', { key: i, value: i }, m))
        ),
        h('div', { className: 'info-box', style: { marginTop: 'var(--space-6)' } },
          h('p', { style: { fontWeight: 'bold' } }, `Clima de ${nombre}`),
          h('p', null, info.clima)
        )
      )
    ),
    h('div', { style: { display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' } },
      h('div', { style: { padding: 'var(--space-4)', background: '#D1FAE5', borderRadius: 'var(--radius-lg)' } },
        h('h3', { style: { fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '🌱 Siembra Directa'),
        ...info.siembraDirecta.map((c, i) => h('span', { 
          key: i, 
          style: { 
            display: 'inline-block', 
            background: '#A7F3D0', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            margin: '4px',
            fontSize: '14px'
          } 
        }, c))
      ),
      h('div', { style: { padding: 'var(--space-4)', background: '#FEF3C7', borderRadius: 'var(--radius-lg)' } },
        h('h3', { style: { fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '🌾 Semilleros'),
        ...info.semilleros.map((c, i) => h('span', { 
          key: i, 
          style: { 
            display: 'inline-block', 
            background: '#FDE68A', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            margin: '4px',
            fontSize: '14px'
          } 
        }, c))
      ),
      h('div', { style: { padding: 'var(--space-4)', background: '#DBEAFE', borderRadius: 'var(--radius-lg)' } },
        h('h3', { style: { fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '🌿 Trasplante'),
        ...info.trasplante.map((c, i) => h('span', { 
          key: i, 
          style: { 
            display: 'inline-block', 
            background: '#BFDBFE', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            margin: '4px',
            fontSize: '14px'
          } 
        }, c))
      ),
      h('div', { style: { padding: 'var(--space-4)', background: '#FED7AA', borderRadius: 'var(--radius-lg)' } },
        h('h3', { style: { fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '🍅 Cosecha'),
        ...info.cosecha.map((c, i) => h('span', { 
          key: i, 
          style: { 
            display: 'inline-block', 
            background: '#FDBA74', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            margin: '4px',
            fontSize: '14px'
          } 
        }, c))
      )
    )
  );
}

window.CalendarioView = CalendarioView;
