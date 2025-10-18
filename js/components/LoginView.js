/**
 * Componente LoginView
 * Vista de inicio de sesión y registro
 */

function LoginView({ onLoginSuccess }) {
  const h = React.createElement;
  const { useState } = React;
  
  const [modo, setModo] = useState('login'); // 'login' o 'registro'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuario = await window.AuthService.login(email, password);
      onLoginSuccess(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuario = await window.AuthService.register({ nombre, email, password });
      onLoginSuccess(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return h('div', { 
    style: { 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--space-4)'
    } 
  },
    h('div', { 
      className: 'card',
      style: { 
        width: '100%', 
        maxWidth: '420px' 
      }
    },
      h('div', { className: 'card-body' },
        // Header
        h('div', { 
          style: { 
            textAlign: 'center', 
            marginBottom: 'var(--space-8)' 
          } 
        },
          h('div', { 
            style: { 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 'var(--space-4)' 
            } 
          },
            h(window.Icons.Sprout, { size: 64, style: { color: 'var(--color-primary-600)' } })
          ),
          h('h1', { className: 'heading-2', style: { marginBottom: 'var(--space-2)' } }, 
            'Mi Huerto de Ciudad'
          ),
          h('p', { className: 'text-small text-muted' }, 
            modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'
          )
        ),

        // Toggle modo
        h('div', { 
          style: { 
            display: 'flex', 
            gap: 'var(--space-2)', 
            marginBottom: 'var(--space-6)',
            padding: 'var(--space-1)',
            background: 'var(--color-neutral-100)',
            borderRadius: 'var(--radius-lg)'
          } 
        },
          h('button', {
            type: 'button',
            onClick: () => {
              setModo('login');
              setError('');
            },
            className: `btn ${modo === 'login' ? 'btn-primary' : 'btn-ghost'}`,
            style: { flex: 1 }
          }, 'Iniciar Sesión'),
          h('button', {
            type: 'button',
            onClick: () => {
              setModo('registro');
              setError('');
            },
            className: `btn ${modo === 'registro' ? 'btn-primary' : 'btn-ghost'}`,
            style: { flex: 1 }
          }, 'Registro')
        ),

        // Error
        error && h('div', { 
          className: 'info-box',
          style: { 
            marginBottom: 'var(--space-6)',
            borderLeftColor: 'var(--color-error)',
            background: 'var(--color-error-bg)'
          }
        },
          h('div', { 
            className: 'info-box-header',
            style: { color: 'var(--color-error)' }
          },
            h(window.Icons.AlertCircle, { size: 20 }),
            h('span', null, 'Error')
          ),
          h('p', { 
            className: 'info-box-content',
            style: { margin: 0, color: 'var(--color-error)' }
          }, error)
        ),

        // Formulario Login
        modo === 'login' && h('form', { onSubmit: handleLogin },
          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'login-email', className: 'form-label form-label-required' }, 
              'Email'
            ),
            h('input', {
              id: 'login-email',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: 'form-input',
              placeholder: 'tu@email.com',
              required: true,
              disabled: cargando
            })
          ),
          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'login-password', className: 'form-label form-label-required' }, 
              'Contraseña'
            ),
            h('input', {
              id: 'login-password',
              type: 'password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: 'form-input',
              placeholder: '••••••••',
              required: true,
              minLength: 6,
              disabled: cargando
            })
          ),
          h('button', { 
            type: 'submit', 
            className: 'btn btn-primary btn-lg',
            style: { width: '100%' },
            disabled: cargando
          },
            cargando && h('div', { className: 'spinner spinner-sm' }),
            cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'
          )
        ),

        // Formulario Registro
        modo === 'registro' && h('form', { onSubmit: handleRegistro },
          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'reg-nombre', className: 'form-label form-label-required' }, 
              'Nombre'
            ),
            h('input', {
              id: 'reg-nombre',
              type: 'text',
              value: nombre,
              onChange: (e) => setNombre(e.target.value),
              className: 'form-input',
              placeholder: 'Tu nombre',
              required: true,
              disabled: cargando
            })
          ),
          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'reg-email', className: 'form-label form-label-required' }, 
              'Email'
            ),
            h('input', {
              id: 'reg-email',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: 'form-input',
              placeholder: 'tu@email.com',
              required: true,
              disabled: cargando
            })
          ),
          h('div', { className: 'form-group' },
            h('label', { htmlFor: 'reg-password', className: 'form-label form-label-required' }, 
              'Contraseña'
            ),
            h('input', {
              id: 'reg-password',
              type: 'password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: 'form-input',
              placeholder: 'Mínimo 6 caracteres',
              required: true,
              minLength: 6,
              disabled: cargando
            }),
            h('p', { 
              className: 'text-small text-muted',
              style: { marginTop: 'var(--space-2)' }
            }, 'La contraseña debe tener al menos 6 caracteres')
          ),
          h('button', { 
            type: 'submit', 
            className: 'btn btn-primary btn-lg',
            style: { width: '100%' },
            disabled: cargando
          },
            cargando && h('div', { className: 'spinner spinner-sm' }),
            cargando ? 'Creando cuenta...' : 'Crear Cuenta'
          )
        )
      )
    )
  );
}

window.LoginView = LoginView;
