/**
 * Componente Navigation
 * Navegación principal entre vistas - CON SISTEMA DE PLAGAS
 */

function Navigation({ vistaActual, setVistaActual, plagas }) {
  const h = React.createElement;
  const { Sprout, Calendar, Info, Sun, AlertTriangle } = window.Icons;
  
  // Calcular plagas activas para badge
  const plagasActivas = plagas ? plagas.filter(p => 
    p.estadoControl === 'activa' || p.estadoControl === 'en_tratamiento'
  ).length : 0;
  
  const navItems = [
    { id: 'cultivos', label: 'Cultivos', icon: Sprout },
    { id: 'tareas', label: 'Tareas', icon: Calendar },
    { id: 'plagas', label: 'Plagas', icon: AlertTriangle }, // ← NUEVO
    { id: 'calendario', label: 'Calendario', icon: Info },
    { id: 'consejos', label: 'Consejos', icon: Sun }
  ];

  return h('nav', { className: 'app-navigation', role: 'navigation' },
    ...navItems.map(item => {
      const isActive = vistaActual === item.id;
      const Icon = item.icon;
      
      return h('button', {
        key: item.id,
        onClick: () => setVistaActual(item.id),
        className: `btn ${isActive ? 'btn-primary' : 'btn-light'}`,
        style: { position: 'relative' },
        'aria-current': isActive ? 'page' : undefined
      },
        h(Icon, { size: 20 }),
        h('span', null, item.label),
        // Badge para plagas activas
        item.id === 'plagas' && plagasActivas > 0 && h('span', {
          className: 'nav-badge',
          style: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#dc2626',
            color: 'white',
            fontSize: '0.688rem',
            fontWeight: '700',
            padding: '0.125rem 0.375rem',
            borderRadius: '10px',
            minWidth: '18px',
            textAlign: 'center'
          }
        }, plagasActivas)
      );
    })
  );
}

window.Navigation = Navigation;