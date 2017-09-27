const WebApp = require('./WebApp')
const TodoList = require('./TodoList')

const port = process.env.PORT || 8666

new WebApp().mount({ todoList: new TodoList() })
  .then(app => {
    app.listen(port, err => {
      if (err) console.error(err)
      console.log(`http://localhost:${port}`)
    })
  })
