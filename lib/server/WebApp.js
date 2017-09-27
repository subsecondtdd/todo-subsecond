const express = require('express')
const bodyParser = require('body-parser')
const asyncExpress = require('./asyncExpress')
const browserify = require('browserify-middleware')

module.exports = class WebApp {
  constructor({ todoList }) {
    this._todoList = todoList
  }

  async buildApp() {
    const app = express()
    app.use(bodyParser.json())

    app.use(express.static('./public'))

    app.get('/client.js', browserify('./lib/client/client.js'))

    const asyncApp = asyncExpress(app)

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

  async listen(port) {
    const app = await this.buildApp()
    await new Promise((resolve, reject) => {
      app.listen(port, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
