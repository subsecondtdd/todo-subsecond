const { Given } = require('cucumber')

Given('the {todolist} has {int} todo(s)', function (todolist, count) {
  for (let i = 0; i < count; i++)
    todolist.createTodo({ text: `Todo ${i}` })
})
