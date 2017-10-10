const assert = require('assert')
const { Given, When, Then, setDefaultTimeout } = require('cucumber')

setDefaultTimeout(30000)

Given('there is/are already {int} todo(s)', async function(count) {
  const todoList = await this.contextTodoList()
  for (let i = 0; i < count; i++)
    await todoList.addTodo({ text: `Todo ${i}` })
})

When('I add {string}', async function(text) {
  const todoList = await this.actionTodoList()
  await todoList.addTodo({ text })
})

Then('the text of the {ordinal} todo should be {string}', async function(index, text) {
  const todoList = await this.outcomeTodoList()
  const todos = await todoList.getTodos()
  assert.equal(todos[index].text, text)
})
