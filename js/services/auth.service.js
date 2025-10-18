/**
 * Servicio de Autenticación
 * Gestión de usuarios con Parse User
 */

const AuthService = {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const { nombre, email, password } = userData;
      
      // Validar datos
      if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre es requerido');
      }
      if (!email || !email.includes('@')) {
        throw new Error('El email no es válido');
      }
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear usuario
      const user = new Parse.User();
      user.set('username', email);
      user.set('email', email);
      user.set('password', password);
      user.set('nombre', nombre);
      
      await user.signUp();
      
      return {
        id: user.id,
        nombre: user.get('nombre'),
        email: user.get('email')
      };
    } catch (error) {
      console.error('Error al registrar:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    }
  },

  // Login
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      const user = await Parse.User.logIn(email, password);
      
      return {
        id: user.id,
        nombre: user.get('nombre'),
        email: user.get('email')
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Email o contraseña incorrectos');
    }
  },

  // Logout
  async logout() {
    try {
      await Parse.User.logOut();
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = Parse.User.current();
    if (!user) return null;
    
    return {
      id: user.id,
      nombre: user.get('nombre'),
      email: user.get('email')
    };
  },

  // Verificar si hay sesión activa
  isAuthenticated() {
    return Parse.User.current() !== null;
  },

  // Actualizar perfil
  async updateProfile(updates) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('No hay usuario autenticado');

      if (updates.nombre) {
        user.set('nombre', updates.nombre);
      }

      await user.save();
      
      return {
        id: user.id,
        nombre: user.get('nombre'),
        email: user.get('email')
      };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('No hay usuario autenticado');

      // Verificar contraseña actual
      await Parse.User.logIn(user.get('email'), currentPassword);

      // Cambiar contraseña
      user.set('password', newPassword);
      await user.save();

      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw new Error('Contraseña actual incorrecta');
    }
  },

  // Recuperar contraseña
  async resetPassword(email) {
    try {
      await Parse.User.requestPasswordReset(email);
      return true;
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      throw new Error('Error al enviar email de recuperación');
    }
  }
};

// Exportar
window.AuthService = AuthService;
