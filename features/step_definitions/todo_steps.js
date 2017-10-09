const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('the todo list has {int} todo(s)', async function (count) {
  const todoList = await this.contextTodoList()
  for (let i = 0; i < count; i++)
    await todoList.addTodo({ text: `Todo ${i}` })
})

When('I add a todo to the todo list', async function () {
  const todoList = await this.actionTodoList()
  await todoList.addTodo({ text: "New Todo" })
})

Then('there should be {int} todos in the todo list', async function (count) {
  const todoList = await this.outcomeTodoList()
  const todos = await todoList.getTodos()
  assert.equal(todos.length, count)
})
