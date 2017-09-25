const express = require('express')
const bodyParser = require('body-parser')
const expressPromise = require('./express-promise')

module.exports = async ({ todoList }) => {
  const app = express()
  app.use(bodyParser.json())

  const asyncApp = expressPromise(app)

  asyncApp.post('/todos', async (req, res) => {
    const { text } = req.body
    await todoList.addTodo({ text })
    res.status(201).end()
  })

  asyncApp.get('/todos', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const todos = await todoList.getItems()
    res.status(200).end(JSON.stringify(todos))
  })

  return app
}
