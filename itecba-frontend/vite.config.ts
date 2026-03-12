// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// 1. Importa el plugin de Tailwind
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Añade el plugin aquí
    tailwindcss(),
  ],
})