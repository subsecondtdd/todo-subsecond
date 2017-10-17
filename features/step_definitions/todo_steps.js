const assert = require('assert')
const { Given, When, Then, setDefaultTimeout } = require('cucumber')

setDefaultTimeout(60000)

Given('{contextTodoList} has added {int} todo(s)', async function(todoList, count) {
  for (let i = 0; i < count; i++)
    await todoList.addTodo({ text: `Todo ${i}` })
})

When('{actionTodoList} adds {string}', async function(todoList, text) {
  await todoList.addTodo({ text })
})

Then("the text of {outcomeTodoList}'s {ordinal} todo should be {string}", async function(todoList, index, text) {
  const todos = await todoList.getTodos()
  if (todos[index]) {
    // Synchronous mode
    assert.equal(todos[index].text, text)
  } else {
    // Asynchronous mode
    return new Promise(resolve => {
      todoList.docUpdated(async () => {
        const todos = await todoList.getTodos()
        assert.equal(todos[index].text, text)
        resolve()
      })
    })
  }
})
