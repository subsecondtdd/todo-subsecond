const WebApp = require('./WebApp')
const DatabaseTodoList = require('./DatabaseTodoList')

const port = process.env.PORT || 8666

new WebApp({ todoList: new DatabaseTodoList() })
  .listen(port)
  .then(() => console.log(`http://localhost:${port}`))
