const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('the todo list has {int} todo(s)', async function (count) {
  const todoList = await this.contextTodoList()
  for (let i = 0; i < count; i++)
    await todoList.addTodo({ text: `Todo ${i}` })
  const items = await todoList.getItems()
  assert.equal(items.length, count)
})

When('I add a todo to the todo list', async function () {
  const todoList = await this.actionTodoList()
  await todoList.addTodo({ text: "New Todo" })
})

Then('there should be {int} todos in the todo list', async function (count) {
  const todoList = await this.outcomeTodoList()
  const items = await todoList.getItems()
  assert.equal(items.length, count)
})
