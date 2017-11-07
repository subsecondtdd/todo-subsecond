const DatabaseTodoList = require('../../../lib/server/DatabaseTodoList')

module.exports = class DatabaseAssembly {
  constructor () {
    this._databaseTodoList = new DatabaseTodoList()
  }

  async start () {
    await this._databaseTodoList.start(true)
  }

  async contextTodoList() {
    return this._databaseTodoList
  }

  async actionTodoList() {
    return this._databaseTodoList
  }

  async outcomeTodoList() {
    return this._databaseTodoList
  }
}
