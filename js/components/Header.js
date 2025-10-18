/**
 * Componente Header
 * Cabecera de la aplicación con título, ubicación y estado
 */

function Header({ conectado, sincronizando, mensajeEstado }) {
  const h = React.createElement;
  
  return h('header', { className: 'app-header' },
    h('div', { className: 'header-content' },
      h('div', { className: 'header-title-group' },
        h(Icons.Sprout, { size: 40, className: 'header-icon' }),
        h('div', null,
          h('h1', { className: 'header-title' }, 'Mi Huerto de Ciudad'),
          h('p', { className: 'header-subtitle' }, 
            'Gestiona tus cultivos según el clima mediterráneo malagueño'
          )
        )
      ),
      h('div', { className: 'header-meta' },
        h('div', { className: 'header-location' },
          h(Icons.MapPin, { size: 18 }),
          h('span', null, 'Málaga, España')
        ),
        h('div', { className: 'header-status' },
          h('div', { className: `status-indicator ${conectado ? '' : 'offline'}` }),
          h('span', { className: 'text-small' }, conectado ? 'Conectado' : 'Desconectado'),
          sincronizando && h('div', { className: 'spinner spinner-sm' })
        )
      )
    ),
    mensajeEstado && h('div', { className: 'toast success' }, mensajeEstado)
  );
}

window.Header = Header;