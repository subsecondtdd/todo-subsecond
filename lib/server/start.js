const WebApp = require('./WebApp')
const TodoList = require('./TodoList')

const port = process.env.PORT || 8666

new WebApp({ todoList: new TodoList() })
  .listen(port)
  .then(() => console.log(`http://localhost:${port}`))
