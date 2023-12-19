import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, 
    rollupOptions: {
      input: './src/main.jsx',
      output: {
        manualChunks: undefined 
      }
    }
  },
});
