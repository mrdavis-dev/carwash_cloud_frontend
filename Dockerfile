# Usar Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Instalar 'serve' para servir archivos estáticos
RUN npm install -g serve

# Copiar el resto de los archivos
COPY . .

# Argumento para la URL de la API
# Por defecto usa la URL de producción de Railway
ARG VITE_API_URL=https://carwashcloudapi-production.up.railway.app
ENV VITE_API_URL=$VITE_API_URL

# Verificar la URL de la API antes del build
RUN echo "🔧 Building with VITE_API_URL: $VITE_API_URL"

# Build de la aplicación
RUN npm run build

# Verificar que la URL se embedió correctamente
RUN grep -o "https://carwashcloudapi" dist/assets/*.js | head -1 || echo "⚠️ WARNING: Backend URL not found in build!"

# Limpiar archivos innecesarios para reducir tamaño
RUN rm -rf node_modules src public

# Exponer puerto (Railway asigna PORT dinámicamente)
EXPOSE 3000

# Servir los archivos estáticos
# serve usa automáticamente la variable PORT si está disponible
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
