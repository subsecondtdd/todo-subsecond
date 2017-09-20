const { setWorldConstructor } = require('cucumber')
const TodoList = require('../../lib/TodoList')
const DomTodoList = require('../../test_support/DomTodoList')

class TodoWorld {
  constructor() {
    this.contextTodoList = new TodoList()
    this.actionTodoList = new DomTodoList()
  }
}

setWorldConstructor(TodoWorld)
