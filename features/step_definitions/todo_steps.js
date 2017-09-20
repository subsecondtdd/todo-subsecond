const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('the todo list has {int} todo(s)', function (count) {
  for (let i = 0; i < count; i++)
    this.contextTodoList.addTodo({ text: `Todo ${i}` })
})

When('I add a todo to the todo list', function () {
  this.actionTodoList.addTodo({ text: "New Todo" })
})

Then('there should be {int} todos in the todo list', function (count) {
  assert.equal(this.outcomeTodoList.getItems().length, count)
})
