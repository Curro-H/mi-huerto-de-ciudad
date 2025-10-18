/**
 * Componente CultivosView
 * Vista de gestión de cultivos
 */

function CultivosView({ cultivos, onAgregarCultivo, onEliminarCultivo, onCambiarEstado, onCambiarRiego }) {
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
                h(Icons.Plus, { size: 20 }),
                'Agregar'
              )
            )
          )
        )
      )
    ),
    cultivos.length === 0 ? 
      h('div', { className: 'empty-state' },
        h(Icons.Sprout, { size: 64, className: 'empty-state-icon' }),
        h('h3', { className: 'empty-state-title' }, 'No hay cultivos registrados'),
        h('p', { className: 'empty-state-description' }, 'Agrega tu primer cultivo')
      ) :
      h('div', { className: 'card-grid' },
        ...cultivos.map(cultivo => h(CultivoCard, {
          key: cultivo.id,
          cultivo,
          onEliminar: onEliminarCultivo,
          onCambiarEstado,
          onCambiarRiego
        }))
      )
  );
}

function CultivoCard({ cultivo, onEliminar, onCambiarEstado, onCambiarRiego }) {
  const h = React.createElement;
  const { formatDate, getDaysSincePlanting, getEstadoEmoji, getRiegoEmoji } = window.helpers;
  const dias = getDaysSincePlanting(cultivo.fechaSiembra);

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
        }, h(Icons.Trash2, { size: 18 }))
      ),
      h('div', { className: 'cultivo-body' },
        h('div', { className: 'cultivo-info' },
          h(Icons.Calendar, { size: 16 }),
          h('span', null, `Sembrado: ${formatDate(cultivo.fechaSiembra)} (${dias} días)`)
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
          h('label', { className: 'form-label' }, h(Icons.Droplet, { size: 16 }), ' Riego'),
          h('select', {
            value: cultivo.riego,
            onChange: (e) => onCambiarRiego(cultivo.id, e.target.value),
            className: 'form-select'
          },
            h('option', { value: 'diario' }, `${getRiegoEmoji('diario')} Diario`),
            h('option', { value: 'moderado' }, `${getRiegoEmoji('moderado')} Moderado`),
            h('option', { value: 'bajo' }, `${getRiegoEmoji('bajo')} Bajo`)
          )
        )
      )
    )
  );
}

window.CultivosView = CultivosView;