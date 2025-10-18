/**
 * Componente Header
 * Cabecera con título, ubicación, estado y menú de usuario
 */

function Header({ usuario, conectado, sincronizando, mensajeEstado, onLogout }) {
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    };

    if (mostrarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenu]);
  
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
        ),
        usuario && h('div', { 
          style: { 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          } 
        },
          h('div', { 
            className: 'mobile-hidden',
            style: { textAlign: 'right' }
          },
            h('p', { 
              className: 'text-small',
              style: { fontWeight: 'var(--font-weight-semibold)' }
            }, usuario.nombre),
            h('p', { 
              className: 'text-small text-muted',
              style: { fontSize: 'var(--font-size-xs)' }
            }, usuario.email)
          ),
          h('button', {
            onClick: () => setMostrarMenu(!mostrarMenu),
            className: 'btn btn-ghost btn-sm',
            style: { 
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-700)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)'
            }
          }, usuario.nombre.charAt(0).toUpperCase()),
          
          mostrarMenu && h('div', {
            style: {
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 'var(--space-2)',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              minWidth: '200px',
              zIndex: 100,
              border: '1px solid var(--color-neutral-200)'
            }
          },
            h('div', { 
              style: { 
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--color-neutral-200)'
              } 
            },
              h('p', { 
                style: { 
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-1)'
                }
              }, usuario.nombre),
              h('p', { 
                className: 'text-small text-muted'
              }, usuario.email)
            ),
            h('div', { style: { padding: 'var(--space-2)' } },
              h('button', {
                onClick: () => {
                  setMostrarMenu(false);
                  onLogout();
                },
                className: 'btn btn-ghost',
                style: { 
                  width: '100%', 
                  justifyContent: 'flex-start',
                  color: 'var(--color-error)'
                }
              },
                h(Icons.X, { size: 18 }),
                'Cerrar Sesión'
              )
            )
          )
        )
      )
    ),
    mensajeEstado && h('div', { className: 'toast success' }, mensajeEstado)
  );
}

window.Header = Header;