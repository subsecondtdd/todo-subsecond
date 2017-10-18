const WebApp = require('./WebApp')
const TodoListCollection = require('./TodoListCollection')

const port = process.env.PORT || 8666

const todoListCollection = new TodoListCollection()

new WebApp({ todoListCollection, serveClient: true }).listen(port)
  .then(() => console.log(`http://localhost:${port}`))
