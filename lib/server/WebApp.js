const express = require('express')
const bodyParser = require('body-parser')
const expressPromise = require('./express-promise')
const browserify = require('browserify-middleware')

module.exports = class WebApp {
  constructor({ todoList, port }) {
    this._todoList = todoList
    this._port = port
  }

  async buildApp() {
    const app = express()
    app.use(bodyParser.json())

    app.use(express.static('./public'))

    app.get('/client.js', browserify('./lib/client/client.js'))

    const asyncApp = expressPromise(app)

    asyncApp.post('/todos', async (req, res) => {
      const { text } = req.body
      await this._todoList.addTodo({ text })
      res.status(201).end()
    })

    asyncApp.get('/todos', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const todos = await this._todoList.getItems()
      res.status(200).end(JSON.stringify(todos))
    })

    return app
  }

  async listen() {
    const app = await this.buildApp()
    await new Promise((resolve, reject) => {
      app.listen(this._port, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
