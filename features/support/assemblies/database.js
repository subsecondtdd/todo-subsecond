const DatabaseTodoList = require('../../../lib/server/DatabaseTodoList')

module.exports = class DatabaseAssembly {
  constructor () {
    this.databaseTodoList = new DatabaseTodoList()
  }

  async start () {
    await this.databaseTodoList.start(true)
  }

  async contextTodoList() {
    return this.databaseTodoList
  }

  async actionTodoList() {
    return this.databaseTodoList
  }

  async outcomeTodoList() {
    return this.databaseTodoList
  }
}
