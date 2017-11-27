const assert = require('assert')
const MemoryTodoList = require('../test_support/MemoryTodoList')

describe('MemoryTodoList', () => {
  it('stores and retrieves TODOs', async () => {
    const todoList = new MemoryTodoList()
    await todoList.addTodo({ text: 'Get milk' })
    const todos = await todoList.getTodos()
    assert.deepEqual(todos, [{text: 'Get milk'}])
  })
})