import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5175, // Distinct from main client
        host: true, // Listen on all addresses
        allowedHosts: [
            'aifi.systems',
            'www.aifi.systems',
            'aifi.featherweight.world',
            'www.aifi.featherweight.world',
            'localhost'
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            }
        }
    }
})
