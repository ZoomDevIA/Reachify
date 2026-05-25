import net from 'node:net'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket()

    socket
      .once('connect', () => {
        socket.destroy()
        resolve(true)
      })
      .once('error', () => {
        resolve(false)
      })
      .connect(port, host)
  })
}

function phpBackendPlugin() {
  let backendProcess = null

  return {
    name: 'reachify-php-backend',
    apply: 'serve',
    async configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      const apiProxyTarget = env.VITE_API_PROXY_TARGET?.replace(/\/$/, '') || 'http://localhost:8000'

      if (apiProxyTarget !== 'http://localhost:8000') {
        return
      }

      const isBackendRunning = await isPortOpen(8000)
      if (isBackendRunning) {
        return
      }

      const backendDirectory = path.resolve(__dirname, '../Backend')
      backendProcess = spawn('php', ['-S', 'localhost:8000', 'router.php'], {
        cwd: backendDirectory,
        stdio: 'ignore',
        windowsHide: true,
      })

      const shutdownBackend = () => {
        if (backendProcess && !backendProcess.killed) {
          backendProcess.kill()
        }
      }

      process.once('exit', shutdownBackend)
      process.once('SIGINT', shutdownBackend)
      process.once('SIGTERM', shutdownBackend)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.replace(/\/$/, '') || 'http://localhost:8000'

  return {
    plugins: [react(), phpBackendPlugin()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
