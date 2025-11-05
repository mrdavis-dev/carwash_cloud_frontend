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
docker run -d -p 8080:80 --name carwash-frontend carwash-cloud-frontend
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
   docker build -t app .
   docker run -p $PORT:80 app
   ```

4. **Railway automáticamente expone el puerto 80 internamente**

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
environment:
  - VITE_API_URL=http://localhost:8000
```

O usa un archivo `.env.production`:

```bash
VITE_API_URL=https://tu-backend-url.com
```

---

## Verificar que funciona

### Check de salud:

```bash
curl http://localhost:8080/health
```

Debería responder: `healthy`

### Ver logs:

```bash
docker logs carwash-frontend

# O con docker-compose
docker-compose logs -f
```

---

## Optimizaciones incluidas

✅ **Multi-stage build** - Imagen final pequeña (~50MB)  
✅ **Nginx Alpine** - Servidor web eficiente  
✅ **Gzip compression** - Archivos comprimidos  
✅ **Cache headers** - Cacheo de assets estáticos  
✅ **SPA routing** - Todas las rutas van a index.html  
✅ **Health check** - Endpoint /health para monitoreo  

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
Etapa 1 (builder): Node 18 Alpine
  ├── Instala dependencias
  ├── Copia código fuente
  └── Ejecuta build (npm run build)

Etapa 2 (producción): Nginx Alpine
  ├── Copia dist/ desde builder
  ├── Copia nginx.conf
  └── Expone puerto 80
```

**Tamaño final:** ~50MB (vs ~1GB con Node completo)

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
