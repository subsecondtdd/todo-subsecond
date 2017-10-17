const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const { AutomergeMiddleware } = require('automerge-ext')

module.exports = class WebApp {
  constructor({ todoListCollection, serveClient }) {
    this._todoListCollection = todoListCollection
    this._serveClient = serveClient
    this._sockets = new Map()
  }

  async buildApp() {
    const app = express()
    app.use(bodyParser.json())

    app.use(express.static('./public'))

    if (this._serveClient) {
      const browserify = require('browserify-middleware')
      app.get('/client.js', browserify(__dirname + '/../client/client.js'))
    }

    app.use(AutomergeMiddleware.make('/automerge', this._todoListCollection._docSet))

    return app
  }

  async listen(port) {
    const app = await this.buildApp()
    this._server = http.createServer(app)

    this._server.on('connection', socket => {
      const key = socket.remoteAddress + ':' + socket.remotePort
      this._sockets.set(key, socket)
      socket.on('close', () => {
        this._sockets.delete(key)
      })
    })

    return new Promise((resolve, reject) => {
      this._server.listen(port, err => {
        if (err) return reject(err)
        resolve(this._server.address().port)
      })
    })
  }

  async stop() {
    await new Promise((resolve, reject) => {
      for (const [_, socket] of this._sockets) {
        socket.destroy()
      }

      this._server.close(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
