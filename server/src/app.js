const express = require('express')
const bodyParser = require('body-parser')
require('express-async-errors')
const cookieParser = require('cookie-parser')
const app = express()
const listEndpoints = require('express-list-endpoints')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) console.log('%s -> %s', req.method, req.url)
  next()
})

app.get('/api', async (req, res) => {
  res.send(`<pre>${JSON.stringify(listEndpoints(app), null, 2)}</pre>`)
})

app.use('/api/gallery', require('./gallery/galleryRouter'))
app.use('/api/popular', require('./popular/popularRouter'))
app.use('/api/watched', require('./watched/watchedRouter'))
app.use('/api/favorites', require('./favorites/favoritesRouter'))
app.use('/api/user', require('./user/userRouter'))

app.use((err, req, res, next) => {
  console.error(err)
  if (err.message === 'Request failed with status code 302') {
    err.message = 'no login'
  }
  res.status(200).send({ error: true, message: err.message })
})

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})

// Keep alive
process.on('SIGTERM', () => server.close())
process.on('SIGINT', () => server.close())

module.exports = app
