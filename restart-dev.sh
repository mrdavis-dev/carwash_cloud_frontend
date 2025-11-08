#!/bin/bash

echo "🔍 Verificando configuración..."
echo ""

echo "📄 Contenido del archivo .env:"
cat .env
echo ""

echo "🌐 Variable de entorno VITE_API_URL:"
echo "$VITE_API_URL"
echo ""

echo "🛑 Matando cualquier proceso de Vite o Node en el proyecto..."
pkill -f "vite" || echo "No hay procesos de Vite corriendo"
echo ""

echo "🧹 Limpiando caché de Vite..."
rm -rf node_modules/.vite
echo ""

echo "✅ Listo! Ahora ejecuta: npm run dev"
echo ""
echo "⚠️  IMPORTANTE: Después de que el servidor inicie, recarga la página con Ctrl+Shift+R (o Cmd+Shift+R en Mac) para limpiar el caché del navegador."
