const express = require('express')
const bodyParser = require('body-parser')

module.exports = ({ todoList }) => {
  const app = express()

  app.use(bodyParser.json())

  app.post('/todos', (req, res, next) => {
    const { text } = req.body
    todoList.addTodo({ text })
    res.status(201).end()
  })

  return app
}
