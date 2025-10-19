// PASO 1: REEMPLAZA la función CultivosView en js/components/CultivosView.js
// Debe recibir las props 'plagas' y 'onReportarPlaga'

function CultivosView({ 
  cultivos, 
  plagas,
  onAgregarCultivo, 
  onEliminarCultivo, 
  onCambiarEstado, 
  onCambiarRiego,
  onReportarPlaga 
}) {
  const h = React.createElement;
  const { useState } = React;
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaParcela, setNuevaParcela] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoNombre && nuevaParcela && nuevaFecha) {
      onAgregarCultivo({ nombre: nuevoNombre, parcela: nuevaParcela, fechaSiembra: nuevaFecha });
      setNuevoNombre('');
      setNuevaParcela('');
      setNuevaFecha('');
    }
  };

  return h('div', null,
    h('div', { className: 'card mb-6' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-3 mb-6' }, 'Agregar Nuevo Cultivo'),
        h('form', { onSubmit: handleSubmit },
          h('div', { className: 'form-row' },
            h('div', { className: 'form-group' },
              h('label', { htmlFor: 'cultivo-nombre', className: 'form-label form-label-required' }, 'Cultivo'),
              h('select', {
                id: 'cultivo-nombre',
                value: nuevoNombre,
                onChange: (e) => setNuevoNombre(e.target.value),
                className: 'form-select',
                required: true
              },
                h('option', { value: '' }, 'Seleccionar cultivo...'),
                ...window.CULTIVOS_MALAGA.map(c => h('option', { key: c, value: c }, c))
              )
            ),
            h('div', { className: 'form-group' },
              h('label', { htmlFor: 'cultivo-parcela', className: 'form-label form-label-required' }, 'Parcela'),
              h('input', {
                id: 'cultivo-parcela',
                type: 'text',
                placeholder: 'ej: A1',
                value: nuevaParcela,
                onChange: (e) => setNuevaParcela(e.target.value),
                className: 'form-input',
                required: true
              })
            ),
            h('div', { className: 'form-group' },
              h('label', { htmlFor: 'cultivo-fecha', className: 'form-label form-label-required' }, 'Fecha de Siembra'),
              h('input', {
                id: 'cultivo-fecha',
                type: 'date',
                value: nuevaFecha,
                onChange: (e) => setNuevaFecha(e.target.value),
                className: 'form-input',
                required: true
              })
            ),
            h('div', { className: 'form-group', style: { alignSelf: 'flex-end' } },
              h('button', { type: 'submit', className: 'btn btn-primary', style: { width: '100%' } },
                h(window.Icons.Plus, { size: 20 }),
                'Agregar'
              )
            )
          )
        )
      )
    ),
    cultivos.length === 0 ?
      h('div', { className: 'empty-state' },
        h(window.Icons.Sprout, { size: 64, className: 'empty-state-icon' }),
        h('h3', { className: 'empty-state-title' }, 'No hay cultivos registrados'),
        h('p', { className: 'empty-state-description' }, 'Agrega tu primer cultivo')
      ) :
      h('div', { className: 'card-grid' },
        ...cultivos.map(cultivo => h(CultivoCard, {
          key: cultivo.id,
          cultivo,
          plagas,
          onEliminar: onEliminarCultivo,
          onCambiarEstado,
          onCambiarRiego,
          onReportarPlaga
        }))
      )
  );
}

// PASO 2: REEMPLAZA la función CultivoCard completa

function CultivoCard({ cultivo, plagas, onEliminar, onCambiarEstado, onCambiarRiego, onReportarPlaga }) {
  const h = React.createElement;
  const { formatDate, getDaysSincePlanting, getEstadoEmoji, getRiegoEmoji } = window.helpers;
  const dias = getDaysSincePlanting(cultivo.fechaSiembra);

  // Calcular plagas activas (no resueltas) que afectan este cultivo
  const plagasActivasCultivo = plagas ? plagas.filter(plaga => {
    const esActivaOTratamiento = ['activa', 'en_tratamiento'].includes(plaga.estadoControl);
    const afectaEsteCultivo = plaga.cultivosAfectados && 
      plaga.cultivosAfectados.some(c => {
        if (typeof c === 'string') return c === cultivo.id;
        if (c && c.id) return c.id === cultivo.id;
        if (c && c.objectId) return c.objectId === cultivo.id;
        return false;
      });
    return esActivaOTratamiento && afectaEsteCultivo;
  }).length : 0;

  return h('article', { className: 'card card-primary' },
    h('div', { className: 'card-body' },
      h('div', { className: 'cultivo-header' },
        h('div', null,
          h('h3', { className: 'cultivo-title' }, cultivo.nombre),
          h('p', { className: 'cultivo-meta' }, `Parcela: ${cultivo.parcela}`)
        ),
        h('button', {
          onClick: () => onEliminar(cultivo.id),
          className: 'btn btn-ghost btn-sm'
        }, h(window.Icons.Trash2, { size: 18 }))
      ),

      h('div', { className: 'cultivo-body' },
        h('div', { className: 'cultivo-info' },
          h(window.Icons.Calendar, { size: 16 }),
          h('span', null, `Sembrado: ${formatDate(cultivo.fechaSiembra)} (${dias} días)`)
        ),

        // Badge de plagas mejorado - icono y número en línea
        plagasActivasCultivo > 0 && h('div', {
          className: 'cultivo-plagas-badge',
          onClick: (e) => {
            e.stopPropagation();
            if (onReportarPlaga) onReportarPlaga(cultivo.id);
          },
          title: `${plagasActivasCultivo} plaga${plagasActivasCultivo !== 1 ? 's' : ''} activa${plagasActivasCultivo !== 1 ? 's' : ''} - Click para reportar`
        },
          h(window.Icons.AlertTriangle, { 
            size: 20,
            style: { color: 'white', flexShrink: 0 }
          }),
          h('span', { 
            className: 'count',
            style: { color: 'white' }
          }, plagasActivasCultivo)
        ),

        h('div', { className: 'form-group' },
          h('label', { className: 'form-label' }, 'Estado actual'),
          h('select', {
            value: cultivo.estado,
            onChange: (e) => onCambiarEstado(cultivo.id, e.target.value),
            className: 'form-select'
          },
            h('option', { value: 'creciendo' }, `${getEstadoEmoji('creciendo')} Creciendo`),
            h('option', { value: 'floreciendo' }, `${getEstadoEmoji('floreciendo')} Floreciendo`),
            h('option', { value: 'cosecha' }, `${getEstadoEmoji('cosecha')} Listo`),
            h('option', { value: 'problema' }, `${getEstadoEmoji('problema')} Problemas`)
          )
        ),

        h('div', { className: 'form-group' },
          h('label', { className: 'form-label' }, h(window.Icons.Droplet, { size: 16 }), ' Riego'),
          h('select', {
            value: cultivo.riego,
            onChange: (e) => onCambiarRiego(cultivo.id, e.target.value),
            className: 'form-select'
          },
            h('option', { value: 'diario' }, `${getRiegoEmoji('diario')} Diario`),
            h('option', { value: 'moderado' }, `${getRiegoEmoji('moderado')} Moderado`),
            h('option', { value: 'bajo' }, `${getRiegoEmoji('bajo')} Bajo`)
          )
        ),

        // Botón reportar plaga
        onReportarPlaga && h('button', {
          className: 'btn btn-secondary btn-sm',
          onClick: () => onReportarPlaga(cultivo.id),
          style: { width: '100%', marginTop: '0.5rem' }
        },
          h(window.Icons.AlertTriangle, { size: 16 }),
          ' Reportar Plaga'
        )
      )
    )
  );
}

window.CultivosView = CultivosView;