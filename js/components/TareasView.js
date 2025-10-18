/**
 * Componente TareasView
 * Vista de gestión de tareas del huerto
 */

function TareasView({ tareas, onAgregarTarea, onToggleTarea, onEliminarTarea, onCambiarPrioridad }) {
  const h = React.createElement;
  const { useState } = React;
  const [nuevaDesc, setNuevaDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevaDesc.trim()) {
      onAgregarTarea({ descripcion: nuevaDesc.trim() });
      setNuevaDesc('');
    }
  };

  const ordenadas = window.helpers.sortTareas(tareas);
  const pendientes = tareas.filter(t => !t.completada).length;
  const completadas = tareas.length - pendientes;

  return h('div', null,
    h('div', { className: 'card mb-6' },
      h('div', { className: 'card-body' },
        h('h2', { className: 'heading-3 mb-6' }, 'Nueva Tarea'),
        h('form', { onSubmit: handleSubmit },
          h('div', { className: 'form-group', style: { marginBottom: 0 } },
            h('label', { htmlFor: 'tarea-desc', className: 'form-label form-label-required' }, 
              '¿Qué necesitas hacer?'
            ),
            h('div', { style: { display: 'flex', gap: 'var(--space-4)' } },
              h('input', {
                id: 'tarea-desc',
                type: 'text',
                placeholder: 'ej: Regar tomates...',
                value: nuevaDesc,
                onChange: (e) => setNuevaDesc(e.target.value),
                className: 'form-input',
                required: true,
                maxLength: 200
              }),
              h('button', { type: 'submit', className: 'btn btn-primary' },
                h(Icons.Plus, { size: 20 }),
                'Agregar'
              )
            )
          )
        )
      )
    ),
    tareas.length === 0 ?
      h('div', { className: 'empty-state' },
        h(Icons.Calendar, { size: 64, className: 'empty-state-icon' }),
        h('h3', { className: 'empty-state-title' }, 'No hay tareas'),
        h('p', { className: 'empty-state-description' }, 'Agrega tareas para tu huerto')
      ) :
      h('div', { className: 'task-list' },
        ...ordenadas.map(tarea => h(TareaItem, {
          key: tarea.id,
          tarea,
          onToggle: onToggleTarea,
          onEliminar: onEliminarTarea,
          onCambiarPrioridad
        }))
      )
  );
}

function TareaItem({ tarea, onToggle, onEliminar, onCambiarPrioridad }) {
  const h = React.createElement;
  const { getPrioridadColor, getPrioridadEmoji } = window.helpers;
  
  return h('div', { 
    className: `task-item ${getPrioridadColor(tarea.prioridad)} ${tarea.completada ? 'completed' : ''}` 
  },
    h('input', {
      type: 'checkbox',
      checked: tarea.completada,
      onChange: () => onToggle(tarea.id),
      className: 'task-checkbox form-check-input'
    }),
    h('span', { className: 'task-text' }, tarea.descripcion),
    h('select', {
      value: tarea.prioridad,
      onChange: (e) => onCambiarPrioridad(tarea.id, e.target.value),
      className: 'form-select',
      style: { width: 'auto', minWidth: '120px' }
    },
      h('option', { value: 'alta' }, `${getPrioridadEmoji('alta')} Alta`),
      h('option', { value: 'media' }, `${getPrioridadEmoji('media')} Media`),
      h('option', { value: 'baja' }, `${getPrioridadEmoji('baja')} Baja`)
    ),
    h('button', {
      onClick: () => onEliminar(tarea.id),
      className: 'btn btn-ghost btn-sm'
    }, h(Icons.Trash2, { size: 18 }))
  );
}

window.TareasView = TareasView;