import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notfound: path.resolve(__dirname, '404.html'),
        about: path.resolve(__dirname, 'about.html'),
        webdev: path.resolve(__dirname, 'webdev.html'),
        collaborations: path.resolve(__dirname, 'collaborations.html'),
        concerts: path.resolve(__dirname, 'concerts.html'),
        gallery: path.resolve(__dirname, 'gallery.html'),
        landscapes: path.resolve(__dirname, 'landscapes.html'),
        portraits: path.resolve(__dirname, 'portraits.html'),
        videos: path.resolve(__dirname, 'videos.html'),
      }
    }
  }
})