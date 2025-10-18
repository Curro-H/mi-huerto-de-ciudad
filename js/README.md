# Mi Huerto de Ciudad - Málaga

Aplicación web multiusuario para gestionar huertos urbanos en Málaga con información específica del clima mediterráneo.

## 🌱 Características

### Sistema de Usuarios
- **Registro y login** con email y contraseña
- **Gestión de perfil** de usuario
- **Autenticación persistente** con Parse User

### Sistema de Huertos
- **Múltiples huertos** por usuario
- **Roles diferenciados**: Dueño y Colaboradores
- **Colaboración**: Invitar usuarios por email
- **Permisos**:
  - Dueño: Control total (CRUD huerto, gestionar colaboradores)
  - Colaborador: Gestionar cultivos y tareas (sin gestión de usuarios)

### Gestión de Cultivos
- Lista de cultivos filtrados por huerto
- Estados: Creciendo, Floreciendo, Cosecha, Problemas
- Niveles de riego: Diario, Moderado, Bajo
- Información de parcela y fecha de siembra

### Gestión de Tareas
- Crear y gestionar tareas del huerto
- Prioridades: Alta, Media, Baja
- Marcar como completadas
- Filtradas por huerto activo

### Calendario y Consejos
- Calendario mensual de siembra para Málaga
- Información sobre qué plantar cada mes
- Consejos de riego adaptados al clima mediterráneo
- Guías de rotación de cultivos

## 🚀 Configuración de Back4app

### 1. Crear Cuenta en Back4app

1. Ve a [back4app.com](https://www.back4app.com/)
2. Crea una cuenta gratuita
3. Crea una nueva aplicación

### 2. Configurar Clases en Back4app

Debes crear las siguientes clases en el Dashboard:

#### Clase: Huerto
- **nombre** (String) - Nombre del huerto
- **ciudad** (String) - Ciudad donde está ubicado
- **dueno** (Pointer to _User) - Usuario propietario
- **colaboradores** (Array) - Array de Pointers to _User

#### Clase: Cultivo
- **huerto** (Pointer to Huerto) - Relación con huerto
- **nombre** (String) - Nombre del cultivo
- **parcela** (String) - Identificador de la parcela
- **fechaSiembra** (String) - Fecha de siembra (ISO 8601)
- **estado** (String) - Estado actual (creciendo/floreciendo/cosecha/problema)
- **riego** (String) - Nivel de riego (diario/moderado/bajo)
- **notas** (String) - Notas adicionales

#### Clase: Tarea
- **huerto** (Pointer to Huerto) - Relación con huerto
- **descripcion** (String) - Descripción de la tarea
- **prioridad** (String) - Prioridad (alta/media/baja)
- **completada** (Boolean) - Si está completada o no
- **fechaLimite** (String, opcional) - Fecha límite

### 3. Configurar Credenciales

Edita el archivo `js/config/back4app.config.js`:

```javascript
const BACK4APP_CONFIG = {
  appId: "TU_APP_ID_AQUI",
  jsKey: "TU_JAVASCRIPT_KEY_AQUI",
  clientKey: "TU_CLIENT_KEY_AQUI",
  serverURL: "https://parseapi.back4app.com"
};
```

Encuentra tus credenciales en:
- Back4app Dashboard → Tu App → App Settings → Security & Keys

### 4. Configurar Permisos de Seguridad

#### Class Level Permissions (Recomendado)

Para cada clase (Huerto, Cultivo, Tarea):
1. Ve a: Dashboard → Core → Browser → [Nombre de Clase] → More → Security
2. Configura:
   - **Get**: Authenticated users
   - **Find**: Authenticated users  
   - **Create**: Authenticated users
   - **Update**: Authenticated users
   - **Delete**: Authenticated users
   - **Add Field**: Only Master Key

Esto asegura que solo usuarios autenticados puedan acceder a los datos, y los ACL por objeto controlan el acceso específico.

## 📦 Estructura del Proyecto

```
mi-huerto-de-ciudad/
├── index.html
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── typography.css
│   └── components/
│       ├── buttons.css
│       ├── cards.css
│       ├── forms.css
│       ├── navigation.css
│       └── modals.css
│   └── styles.css
├── js/
│   ├── config/
│   │   └── back4app.config.js      # Configuración de credenciales
│   ├── data/
│   │   └── calendario-malaga.data.js
│   ├── utils/
│   │   ├── icons.js
│   │   └── helpers.js
│   ├── services/
│   │   ├── auth.service.js         # Autenticación y usuarios
│   │   ├── huerto.service.js       # Gestión de huertos
│   │   ├── cultivo.service.js      # CRUD de cultivos
│   │   └── tarea.service.js        # CRUD de tareas
│   ├── components/
│   │   ├── LoginView.js            # Login y registro
│   │   ├── Header.js               # Cabecera con menú usuario
│   │   ├── HuertosSelector.js      # Selector y gestión de huertos
│   │   ├── Navigation.js
│   │   ├── CultivosView.js
│   │   ├── TareasView.js
│   │   ├── CalendarioView.js
│   │   └── ConsejosView.js
│   └── app.js                      # Aplicación principal
└── README.md
```

## 🔐 Flujo de Uso

### 1. Registro/Login
1. El usuario accede a la aplicación
2. Se muestra la vista de login/registro
3. Puede crear una cuenta nueva o iniciar sesión
4. La sesión se mantiene automáticamente

### 2. Crear Primer Huerto
1. Después del login, si no tiene huertos, se muestra un mensaje
2. Click en "Crear Huerto"
3. Ingresar nombre y ciudad
4. El huerto se crea y el usuario es el dueño

### 3. Trabajar con Huertos
1. Seleccionar huerto activo desde el selector
2. Los cultivos y tareas se filtran por el huerto seleccionado
3. Todos los cambios se guardan automáticamente en la nube

### 4. Invitar Colaboradores (Solo Dueño)
1. Click en "Gestionar" en el selector de huertos
2. Ir a la pestaña "Colaboradores"
3. Ingresar el email del usuario a invitar
4. El colaborador debe tener una cuenta registrada
5. Una vez agregado, puede ver y editar el huerto

### 5. Roles y Permisos

#### Dueño del Huerto
- ✅ Ver, crear, editar y eliminar cultivos
- ✅ Ver, crear, editar y eliminar tareas
- ✅ Editar información del huerto
- ✅ Invitar colaboradores
- ✅ Quitar colaboradores
- ✅ Eliminar el huerto

#### Colaborador
- ✅ Ver, crear, editar y eliminar cultivos
- ✅ Ver, crear, editar y eliminar tareas
- ❌ NO puede editar información del huerto
- ❌ NO puede invitar o quitar colaboradores
- ❌ NO puede eliminar el huerto

## 🌐 Despliegue en GitHub Pages

1. Sube todos los archivos a tu repositorio de GitHub
2. Ve a Settings → Pages
3. Source: Deploy from branch → main
4. Espera unos minutos
5. Tu app estará en: `https://tu-usuario.github.io/mi-huerto-de-ciudad/`

## 🔧 Desarrollo Local

1. Clona el repositorio
2. Configura tus credenciales de Back4app en `js/config/back4app.config.js`
3. Abre `index.html` directamente en tu navegador
   - O usa un servidor local: `python -m http.server 8000`
4. Los datos se sincronizan automáticamente con Back4app

## 📱 Características Técnicas

- **Sin instalación**: Funciona directamente en el navegador
- **Responsive**: Optimizado para móvil, tablet y escritorio
- **PWA-ready**: Puede instalarse como aplicación
- **Offline-first**: Datos sincronizados en la nube
- **Seguridad**: ACL (Access Control Lists) por objeto
- **React sin JSX**: Usando `React.createElement` para compatibilidad directa
- **Parse SDK**: Backend completo como servicio

## 🎨 Sistema de Diseño

- **Variables CSS**: Sistema de colores y espaciado consistente
- **Accesibilidad**: Cumple WCAG 2.1 AA
- **Animaciones**: Suaves y configurables
- **Dark mode**: Preparado para modo oscuro (futuro)

## 🐛 Solución de Problemas

### Error: "Usuario no autenticado"
- Verifica que las credenciales de Back4app sean correctas
- Asegúrate de haber iniciado sesión
- Revisa la consola del navegador para más detalles

### Los datos no se guardan
- Verifica la conexión a internet
- Revisa los Class Level Permissions en Back4app
- Comprueba que los ACL estén configurados correctamente

### No puedo invitar colaboradores
- Asegúrate de ser el dueño del huerto
- Verifica que el email del colaborador esté registrado
- El email debe coincidir exactamente con el registrado

### Error al crear clases en Back4app
- Las clases se crean automáticamente al hacer el primer insert
- Si prefieres crearlas manualmente, sigue la estructura descrita arriba
- Verifica los nombres de campos (case-sensitive)

## 📧 Soporte

Para reportar problemas o sugerencias:
- Abre un issue en GitHub
- Incluye capturas de pantalla si es posible
- Describe los pasos para reproducir el problema

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- **Back4app** por el backend como servicio
- **React** por la librería de UI
- **Parse SDK** por la gestión de datos
- Comunidad de huertos urbanos de Málaga

---

**Desarrollado con ❤️ para los hortelanos urbanos de Málaga** 🌱🍅🌿