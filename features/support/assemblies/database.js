const DatabaseTodoList = require('../../../lib/server/DatabaseTodoList')

module.exports = class DatabaseAssembly {
  async start () {
    this._databaseTodoList = new DatabaseTodoList()
    await this._databaseTodoList.start({truncate:true})
  }

  async stop() {}

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
