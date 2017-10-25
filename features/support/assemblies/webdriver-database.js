const WebDriverTodoList = require('../../../test_support/WebDriverTodoList')
const DatabaseTodoList = require('../../../lib/server/DatabaseTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class WebDriverDatabaseAssembly {
  async start () {
    this.databaseTodoList = new DatabaseTodoList()
    await this.databaseTodoList.start(true)
    this.webApp = new WebApp({ todoList: this.databaseTodoList, serveClient: true })
    const port = await this.webApp.listen(0)
    this.webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
    await this.webDriverTodoList.start()
  }

  async stop () {
    await this.webDriverTodoList.stop()
    await this.webApp.stop()
  }

  async contextTodoList() {
    return this.databaseTodoList
  }

  async actionTodoList() {
    return this.webDriverTodoList
  }

  async outcomeTodoList() {
    return this.webDriverTodoList
  }
}
