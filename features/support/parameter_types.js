const { defineParameterType } = require('cucumber')
const DomTodoList = require('../../test_support/DomTodoList')

defineParameterType({
  name: 'todolist',
  regexp: /todo list/,
  transformer: () => new DomTodoList()
})
