/**
 * Componente ConsejosView
 * Vista con consejos y guías para el huerto en Málaga
 */

function ConsejosView() {
  const h = React.createElement;
  
  return h('div', null,
    h('div', { className: 'card mb-6' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-2 mb-6' }, '🌞 Clima de Málaga'),
        h('p', null, 'Málaga goza de un clima mediterráneo con más de 300 días de sol. Inviernos suaves (15-18°C) y veranos cálidos (+30°C).'),
        h('div', { className: 'info-box', style: { marginTop: 'var(--space-4)' } },
          h('h3', { style: { fontWeight: 'bold', marginBottom: 'var(--space-2)' } }, '💧 Riego en Verano'),
          h('p', null, '• Riego diario o cada 2 días'),
          h('p', null, '• 1 litro por planta al día'),
          h('p', null, '• Horario: mañana temprano o atardecer')
        )
      )
    ),
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-2 mb-6' }, '🍅 Tomates'),
        h('p', null, '• Semillero: Enero-Marzo'),
        h('p', null, '• Trasplante: Abril-Mayo'),
        h('p', null, '• Temperatura ideal: 20-35°C'),
        h('p', null, '• Riego verano: 1L diario')
      )
    )
  );
}

window.ConsejosView = ConsejosView;