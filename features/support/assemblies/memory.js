const MemoryTodoList = require('../../../test_support/MemoryTodoList')

module.exports = class MemoryAssembly {
  async start () {
    this._memoryTodoList = new MemoryTodoList()
  }

  async stop() {}

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
