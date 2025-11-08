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

# Argumento para la URL de la API (se pasa desde Railway)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Debug: Mostrar la URL del API durante el build
RUN echo "🔧 Building with VITE_API_URL: $VITE_API_URL"
RUN env | grep VITE || echo "No VITE_ variables found"

# Build de la aplicación
RUN npm run build

# Limpiar archivos innecesarios para reducir tamaño
RUN rm -rf node_modules src public

# Exponer puerto (Railway asigna PORT dinámicamente)
EXPOSE 3000

# Servir los archivos estáticos
# serve usa automáticamente la variable PORT si está disponible
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
