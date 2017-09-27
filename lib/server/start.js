const WebApp = require('./WebApp')
const TodoList = require('../TodoList')

const port = process.env.PORT || 8666

new WebApp({ todoList: new TodoList(), port })
  .listen()
  .then(app => console.log(`http://localhost:${port}`))
