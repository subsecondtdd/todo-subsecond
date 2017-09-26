const mountWebApp = require('./mountWebApp')
const TodoList = require('./TodoList')

const port = process.env.PORT || 8666

mountWebApp({ todoList: new TodoList() })
  .then(app => {
    app.listen(port, err => {
      if (err) console.error(err)
      console.log(`http://localhost:${port}`)
    })
  })
