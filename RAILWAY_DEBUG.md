# 🐛 Instrucciones de Debugging para Railway

## Problema Actual
El login devuelve status 200 pero no redirige a `/cars` en producción de Railway, mientras que funciona correctamente en local.

## Causa Probable
La variable de entorno `VITE_API_URL` no está siendo inyectada correctamente durante el build en Railway, causando que la aplicación use `http://localhost:8000` en producción.

## ⚙️ Configuración Requerida en Railway

### 1. Variables de Entorno en Railway

En tu proyecto de Railway, necesitas configurar la variable como **Build Argument** (no solo como variable de entorno):

```bash
VITE_API_URL=https://carwashcloudapi-production.up.railway.app
```

### 2. Pasos para Configurar en Railway

1. Ve a tu proyecto en Railway
2. Haz clic en el servicio de frontend
3. Ve a **Settings** → **Variables**
4. Agrega la variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://carwashcloudapi-production.up.railway.app`
5. Asegúrate de que esté marcada como **Build Time** variable

### 3. Railway.toml (Alternativa)

Si Railway no detecta automáticamente el build arg, crea un archivo `railway.toml` en la raíz:

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[build.buildArgs]
VITE_API_URL = "https://carwashcloudapi-production.up.railway.app"
```

## 🔍 Verificación del Build

Después de hacer commit y push, revisa los logs de build en Railway. Deberías ver:

```
🔧 Building with VITE_API_URL: https://carwashcloudapi-production.up.railway.app
VITE_API_URL=https://carwashcloudapi-production.up.railway.app
```

Si ves esto en los logs:
```
🔧 Building with VITE_API_URL: 
No VITE_ variables found
```

Significa que la variable no está siendo pasada al Dockerfile.

## 🌐 Verificación en el Navegador

Una vez desplegado, abre la consola del navegador en:
https://carwashcloud.up.railway.app

Deberías ver estos logs al cargar la página:

```
🔧 Configuración de API: {
  VITE_API_URL: "https://carwashcloudapi-production.up.railway.app",
  API_URL: "https://carwashcloudapi-production.up.railway.app",
  MODE: "production",
  DEV: false,
  PROD: true
}
```

Si ves `http://localhost:8000` aquí, confirma que el problema es la variable de entorno.

## 📝 Logs Durante el Login

Al intentar hacer login, verás estos logs en la consola:

```
📝 Form submit initiated
🚀 Calling authStore.login...
🔐 Attempting login...
🌐 Request: {
  method: "POST",
  url: "/auth/login",
  fullURL: "https://carwashcloudapi-production.up.railway.app/auth/login",
  hasToken: false
}
✅ Response: {
  status: 200,
  url: "/auth/login",
  data: { access_token: "..." }
}
✅ Login response received: { hasAccessToken: true, tokenLength: 200+ }
💾 Token saved to localStorage
👤 User loaded: { hasUser: true, username: "...", businessId: "..." }
📊 Login result: { success: true }
✅ Login successful, redirecting to /cars
✅ Router.push completed
```

Si la `fullURL` muestra `localhost:8000`, ahí está el problema.

## 🔄 Proceso de Re-deployment

1. Configurar `VITE_API_URL` en Railway (Settings → Variables)
2. Hacer commit de los cambios de logging:
   ```bash
   git add .
   git commit -m "Add debug logging for Railway deployment"
   git push
   ```
3. Railway detectará el push y reconstruirá automáticamente
4. Revisar los logs de build para confirmar la variable
5. Probar el login en producción y revisar la consola del navegador

## ✅ Señales de Éxito

- Los logs de build muestran la URL correcta del API
- La consola del navegador muestra la URL correcta del API
- El login redirige exitosamente a `/cars`
- Las peticiones van a `carwashcloudapi-production.up.railway.app` no a `localhost`

## 🆘 Si Aún No Funciona

Si después de configurar la variable correctamente aún no funciona:

1. Verifica que el backend esté corriendo: https://carwashcloudapi-production.up.railway.app/docs
2. Verifica CORS en el backend (debe permitir https://carwashcloud.up.railway.app)
3. Revisa los logs del backend en Railway para ver si las peticiones llegan
4. Verifica que el token JWT esté siendo guardado correctamente (Application → Local Storage en DevTools)

## 📞 Nota Final

Todos los `console.log` agregados son para debugging. Una vez que todo funcione correctamente, puedes:
- Dejarlos (útiles para monitoreo)
- O eliminarlos para producción
