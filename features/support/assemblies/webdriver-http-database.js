const WebDriverTodoList = require('../../../test_support/WebDriverTodoList')
const DatabaseTodoList = require('../../../lib/server/DatabaseTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class WebDriverDatabaseAssembly {
  async start () {
    this._databaseTodoList = new DatabaseTodoList()
    await this._databaseTodoList.start({truncate:true})
    this._webApp = new WebApp({ todoList: this._databaseTodoList, serveClient: true })
    const port = await this._webApp.listen(0)
    this._webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
  }

  async stop () {
    await this._webDriverTodoList.stop()
    await this._webApp.stop()
  }

  async contextTodoList() {
    return this._databaseTodoList
  }

  async actionTodoList() {
    await this._webDriverTodoList.start()
    return this._webDriverTodoList
  }

  async outcomeTodoList() {
    return this._webDriverTodoList
  }
}
