# 🐳 Docker Deployment - Carwash Cloud Frontend

## Opción 1: Docker Compose (Recomendado para desarrollo local)

### Construir y ejecutar:

```bash
docker-compose up --build
```

La aplicación estará disponible en: `http://localhost:8080`

### Detener:

```bash
docker-compose down
```

---

## Opción 2: Docker directo

### Construir la imagen:

```bash
docker build -t carwash-cloud-frontend .
```

### Ejecutar el contenedor:

```bash
docker run -d -p 8080:3000 --name carwash-frontend carwash-cloud-frontend
```

### Con variable de entorno para la API:

```bash
docker run -d -p 8080:3000 \
  -e PORT=3000 \
  --name carwash-frontend \
  carwash-cloud-frontend
```

### Detener y eliminar:

```bash
docker stop carwash-frontend
docker rm carwash-frontend
```

---

## Opción 3: Deploy en Railway con Docker

Railway detectará automáticamente el `Dockerfile` y lo usará para el deploy.

### Pasos:

1. **Asegúrate de tener el Dockerfile en el repositorio**
2. **Configura la variable de entorno en Railway:**
   - `VITE_API_URL=https://tu-backend.railway.app`

3. **Railway ejecutará automáticamente:**
   ```bash
   docker build --build-arg VITE_API_URL=$VITE_API_URL -t app .
   docker run -p $PORT:3000 app
   ```

4. **Railway automáticamente expone el puerto que definas en la variable PORT**

---

## Variables de Entorno

Para configurar la URL de la API en producción:

### En Railway:

1. Ve a tu proyecto en Railway
2. Settings → Variables
3. Agrega: `VITE_API_URL=https://tu-backend-url.com`

### En Docker local:

Modifica `docker-compose.yml`:

```yaml
build:
  args:
    - VITE_API_URL=http://localhost:8000
environment:
  - PORT=3000
```

O usa un archivo `.env.production`:

```bash
VITE_API_URL=https://tu-backend-url.com
```

---

## Verificar que funciona

### Verificar el servicio:

```bash
curl http://localhost:8080
```

Debería devolver el HTML de la aplicación.

### Ver logs:

```bash
docker logs carwash-frontend

# O con docker-compose
docker-compose logs -f
```

---

## Optimizaciones incluidas

✅ **Single-stage build** - Imagen con Node.js Alpine (~200MB)  
✅ **Serve** - Servidor estático simple y eficiente  
✅ **SPA routing** - Todas las rutas van a index.html  
✅ **Puerto dinámico** - Compatible con Railway y otras plataformas  
✅ **Build-time args** - VITE_API_URL se inyecta en el build  

---

## Troubleshooting

### Error 502 en Railway

Si ves error 502, asegúrate de que:

1. El `Dockerfile` está en el root del proyecto
2. Railway detectó el Dockerfile (verás "Using Dockerfile" en los logs)
3. La variable `VITE_API_URL` está configurada

### Ver errores del build en Railway

En Railway:
1. Ve a Deployments
2. Click en el deployment fallido
3. Revisa los logs de build

### El frontend no se conecta al backend

Verifica que `VITE_API_URL` apunte a la URL correcta del backend en Railway.

---

## Comandos útiles

```bash
# Rebuild sin cache
docker-compose build --no-cache

# Ver tamaño de la imagen
docker images carwash-cloud-frontend

# Ejecutar comandos dentro del contenedor
docker exec -it carwash-frontend sh

# Ver procesos en el contenedor
docker exec carwash-frontend ps aux
```

---

## Estructura de la imagen

```
Node 18 Alpine
  ├── Instala dependencias (npm ci)
  ├── Instala 'serve' globalmente
  ├── Copia código fuente
  ├── Ejecuta build (npm run build)
  ├── Limpia archivos innecesarios
  └── Sirve dist/ con 'serve' en puerto 3000
```

**Tamaño final:** ~200MB (optimizado para simplicidad)

---

## Deploy en otras plataformas

### Heroku (con heroku.yml):

```yaml
build:
  docker:
    web: Dockerfile
```

### Google Cloud Run:

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/carwash-frontend
gcloud run deploy --image gcr.io/PROJECT-ID/carwash-frontend --platform managed
```

### AWS ECS/Fargate:

```bash
docker build -t carwash-frontend .
docker tag carwash-frontend:latest YOUR-ECR-REPO/carwash-frontend:latest
docker push YOUR-ECR-REPO/carwash-frontend:latest
```
