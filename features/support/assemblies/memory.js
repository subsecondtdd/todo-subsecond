const MemoryTodoList = require('../../../test_support/MemoryTodoList')

module.exports = class MemoryAssembly {
  constructor () {
    this.memoryTodoList = new MemoryTodoList()
  }

  async contextTodoList() {
    return this.memoryTodoList
  }

  async actionTodoList() {
    return this.memoryTodoList
  }

  async outcomeTodoList() {
    return this.memoryTodoList
  }
}
