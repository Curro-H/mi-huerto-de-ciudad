/**
 * Componente Navigation
 * Navegación principal entre vistas
 */

function Navigation({ vistaActual, setVistaActual }) {
  const h = React.createElement;
  
  const navItems = [
    { id: 'cultivos', label: 'Cultivos', icon: Icons.Sprout },
    { id: 'tareas', label: 'Tareas', icon: Icons.Calendar },
    { id: 'calendario', label: 'Calendario', icon: Icons.Info },
    { id: 'consejos', label: 'Consejos', icon: Icons.Sun }
  ];

  return h('nav', { className: 'app-navigation', role: 'navigation' },
    ...navItems.map(item => {
      const isActive = vistaActual === item.id;
      return h('button', {
        key: item.id,
        onClick: () => setVistaActual(item.id),
        className: `btn ${isActive ? 'btn-primary' : 'btn-light'}`,
        'aria-current': isActive ? 'page' : undefined
      },
        h(item.icon, { size: 20 }),
        h('span', null, item.label)
      );
    })
  );
}

window.Navigation = Navigation;