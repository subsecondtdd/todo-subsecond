const MemoryTodoList = require('../../../test_support/MemoryTodoList')

module.exports = class MemoryAssembly {
  constructor () {
    this._memoryTodoList = new MemoryTodoList()
  }

  async contextTodoList() {
    return this._memoryTodoList
  }

  async actionTodoList() {
    return this._memoryTodoList
  }

  async outcomeTodoList() {
    return this._memoryTodoList
  }
}
