const WebApp = require('./WebApp')
const DatabaseTodoList = require('./DatabaseTodoList')

const port = process.env.PORT || 8666

const todoList = new DatabaseTodoList()

todoList.start()
  .then(() => new WebApp({ todoList }).listen(port))
  .then(() => console.log(`http://localhost:${port}`))
