const WebDriverTodoList = require('../../../test_support/WebDriverTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class WebDriverMemoryAssembly {
  async start () {
    this._memoryTodoList = new MemoryTodoList()
    this._webApp = new WebApp({ todoList: this._memoryTodoList, serveClient: true })
    const port = await this._webApp.listen(0)
    this._webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
    await this._webDriverTodoList.start()
  }

  async stop () {
    await this._webDriverTodoList.stop()
    await this._webApp.stop()
  }

  async contextTodoList() {
    return this._memoryTodoList
  }

  async actionTodoList() {
    return this._webDriverTodoList
  }

  async outcomeTodoList() {
    return this._webDriverTodoList
  }
}
