const WebApp = require('./WebApp')
const DatabaseTodoList = require('./DatabaseTodoList')

const port = process.env.PORT || 8666

const todoList = new DatabaseTodoList()

todoList.start({truncate:true})
  .then(() => new WebApp({ todoList, serveClient: true }).listen(port))
  .then(() => console.log(`http://localhost:${port}`))
