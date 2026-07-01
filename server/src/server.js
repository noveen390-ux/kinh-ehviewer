const next = require('next')
const express = require('express')
const cookieParser = require('cookie-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = parseInt(process.env.PORT || '3000')
const apiPort = 8080

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(cookieParser())

  server.use('/api', createProxyMiddleware({
    target: `http://localhost:${apiPort}`,
    changeOrigin: true,
  }))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Kinh EhViewer ready on http://localhost:${port}`)
  })
}).catch(e => {
  console.error('Failed to start Next.js:', e)
  process.exit(1)
})
