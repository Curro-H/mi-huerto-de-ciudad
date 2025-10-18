# Guía Completa de Configuración de Back4app

Esta guía te llevará paso a paso para configurar tu backend en Back4app para la aplicación Mi Huerto de Ciudad.

## 📋 Requisitos Previos

- Una cuenta de email válida
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🚀 Paso 1: Crear Cuenta en Back4app

1. Ve a https://www.back4app.com/
2. Click en "Sign Up" (Registrarse)
3. Puedes registrarte con:
   - Email y contraseña
   - Cuenta de GitHub
   - Cuenta de Google
4. Confirma tu email si es necesario

## 🎯 Paso 2: Crear Nueva Aplicación

1. Una vez dentro del Dashboard, click en **"Build a new app"**
2. Selecciona **"Backend as a Service"**
3. Nombre de la app: `mi-huerto-ciudad` (o el que prefieras)
4. Click en **"Create"**
5. Espera unos segundos mientras se crea

## 🔑 Paso 3: Obtener Credenciales

1. En el Dashboard de tu app, ve a **App Settings** (engranaje en la esquina superior derecha)
2. Click en **"Security & Keys"** en el menú lateral
3. Encontrarás:
   - **Application ID**
   - **JavaScript Key**
   - **Client Key**
   - **REST API Key** (no necesario)
   - **Master Key** (¡NUNCA lo uses en el frontend!)

4. Copia estas credenciales

5. En tu proyecto, edita `js/config/back4app.config.js`:

```javascript
const BACK4APP_CONFIG = {
  appId: "PEGA_AQUI_APPLICATION_ID",
  jsKey: "PEGA_AQUI_JAVASCRIPT_KEY",
  clientKey: "PEGA_AQUI_CLIENT_KEY",
  serverURL: "https://parseapi.back4app.com"
};
```

## 🗄️ Paso 4: Configurar la Base de Datos

### Opción A: Dejar que la App cree las clases automáticamente (Recomendado)

1. Las clases `Huerto`, `Cultivo` y `Tarea` se crearán automáticamente cuando hagas el primer registro
2. No necesitas hacer nada más
3. Pasa al **Paso 5: Configurar Permisos**

### Opción B: Crear las clases manualmente

Si prefieres crear las clases antes de usar la app:

#### Crear Clase: Huerto

1. Ve a **Core** → **Browser** en el menú lateral
2. Click en **"+ Create a class"**
3. Class name: `Huerto`
4. Click en **"Create class"**
5. Agrega las siguientes columnas (Click en **"+ Col"**):

   | Nombre | Tipo | Descripción |
   |--------|------|-------------|
   | nombre | String | Nombre del huerto |
   | ciudad | String | Ciudad donde está ubicado |
   | dueno | Pointer | → _User (Usuario propietario) |
   | colaboradores | Array | Array de usuarios colaboradores |

#### Crear Clase: Cultivo

1. Click en **"+ Create a class"**
2. Class name: `Cultivo`
3. Agrega columnas:

   | Nombre | Tipo | Descripción |
   |--------|------|-------------|
   | huerto | Pointer | → Huerto |
   | nombre | String | Nombre del cultivo |
   | parcela | String | Identificador de parcela |
   | fechaSiembra | String | Fecha en formato ISO |
   | estado | String | creciendo/floreciendo/cosecha/problema |
   | riego | String | diario/moderado/bajo |
   | notas | String | Notas adicionales |

#### Crear Clase: Tarea

1. Click en **"+ Create a class"**
2. Class name: `Tarea`
3. Agrega columnas:

   | Nombre | Tipo | Descripción |
   |--------|------|-------------|
   | huerto | Pointer | → Huerto |
   | descripcion | String | Descripción de la tarea |
   | prioridad | String | alta/media/baja |
   | completada | Boolean | Estado de completado |
   | fechaLimite | String | Fecha límite (opcional) |

## 🔐 Paso 5: Configurar Permisos de Seguridad

Es **MUY IMPORTANTE** configurar los permisos correctamente para proteger los datos.

### Para cada clase (Huerto, Cultivo, Tarea):

1. Ve a **Core** → **Browser**
2. Click en la clase (ej: `Huerto`)
3. Click en **"More"** → **"Security"**
4. En **"Class Level Permissions"**, configura:

   ```
   Get           ✅ Requires authentication
   Find          ✅ Requires authentication
   Count         ✅ Requires authentication
   Create        ✅ Requires authentication
   Update        ✅ Requires authentication
   Delete        ✅ Requires authentication
   Add fields    ❌ (solo Master Key)
   ```

5. Click en **"Save"**

### ¿Por qué esta configuración?

- **Requires authentication**: Solo usuarios registrados pueden acceder
- Los **ACL** (Access Control Lists) por objeto controlan quién puede ver/editar cada registro específico
- **Add fields solo Master Key**: Previene que usuarios creen campos nuevos

## 🧪 Paso 6: Probar la Configuración

1. Abre tu aplicación en el navegador
2. Deberías ver la pantalla de Login/Registro
3. Crea una cuenta de prueba:
   - Nombre: Tu nombre
   - Email: tu-email@ejemplo.com
   - Contraseña: mínimo 6 caracteres

4. Si todo está bien:
   - ✅ Se creará tu usuario
   - ✅ Verás el dashboard principal
   - ✅ Podrás crear tu primer huerto

5. Verifica en Back4app:
   - Ve a **Core** → **Browser** → **User**
   - Deberías ver tu usuario recién creado

## 🔍 Verificar en Back4app Dashboard

Después de usar la app, verifica que los datos se están guardando:

1. **Ver Usuarios**:
   - Core → Browser → User
   - Deberías ver los usuarios registrados

2. **Ver Huertos**:
   - Core → Browser → Huerto
   - Verás los huertos creados con su dueño y colaboradores

3. **Ver Cultivos**:
   - Core → Browser → Cultivo
   - Cada cultivo está vinculado a un huerto

4. **Ver Tareas**:
   - Core → Browser → Tarea
   - Cada tarea está vinculada a un huerto

## ⚠️ Problemas Comunes

### "Invalid session token"
**Solución**: Cierra sesión y vuelve a entrar. El token puede haber expirado.

### "Permission denied"
**Solución**: 
1. Verifica que los Class Level Permissions estén configurados
2. Asegúrate de estar autenticado
3. Revisa que el ACL del objeto permita al usuario actual

### No puedo crear objetos
**Solución**:
1. Ve a Security → Class Level Permissions
2. Marca "Create" → "Requires authentication"
3. NO marques "Public"

### Los colaboradores no pueden editar
**Solución**:
1. Verifica que el ACL del huerto incluya al colaborador
2. El código de la app maneja esto automáticamente
3. Revisa la consola del navegador para errores

### "Application not found"
**Solución**:
1. Verifica que el Application ID sea correcto
2. Asegúrate de usar comillas correctas en el archivo config
3. No debe haber espacios extra

## 📊 Monitorear el Uso

Back4app tiene un plan gratuito generoso:
- 25,000 requests/mes
- 250 MB de base de datos
- 1 GB de transferencia

Para ver tu uso:
1. Dashboard → Analytics
2. Verás requests, almacenamiento y transferencia

## 🔄 Backup de Datos

Es buena práctica hacer backups:

1. Ve a **Core** → **Browser**
2. Selecciona una clase
3. Click en **"Export data"**
4. Descarga el JSON
5. Guárdalo en un lugar seguro

## 🚀 Próximos Pasos

Ahora que tienes Back4app configurado:

1. ✅ Registra tu cuenta en la app
2. ✅ Crea tu primer huerto
3. ✅ Agrega algunos cultivos
4. ✅ Invita a colaboradores (opcional)
5. ✅ Explora el calendario y consejos

## 💡 Consejos Pro

1. **Variables de entorno**: En producción, usa variables de entorno para las credenciales
2. **Dominios permitidos**: En Settings → Security, agrega tus dominios permitidos
3. **Email verification**: Activa verificación de email en Settings → Authentication
4. **Cloud Code**: Para lógica compleja del servidor, usa Cloud Code de Back4app

## 📞 Soporte Adicional

- **Documentación oficial de Back4app**: https://www.back4app.com/docs
- **Parse SDK Docs**: https://docs.parseplatform.org/js/guide/
- **Foro de Back4app**: https://community.back4app.com/

---

¡Felicidades! 🎉 Tu backend está listo para usar.
