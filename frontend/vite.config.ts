import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration for the Clarity frontend application
 * Uses environment variables for configuration
 */
export default defineConfig(({ mode }) => {
  /**
   * Load environment variables from .env files
   * Third parameter set to empty string to load all env variables regardless of VITE_ prefix
   */
  const env = loadEnv(mode, process.cwd(), '')
  
  // Use VITE_API_URL from .env file as the target URL, or fall back to localhost:8000
  const apiTargetUrl = env.VITE_API_URL || 'http://localhost:8000'
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      // Only configure proxy if not using direct API URL in client code
      ...(env.USE_API_DIRECTLY ? {} : {
        proxy: {
          '/api': {
            target: apiTargetUrl,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      })
    }
  }
}) 