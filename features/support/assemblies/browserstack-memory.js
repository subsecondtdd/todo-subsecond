const BrowserStackTodoList = require('../../../test_support/BrowserStackTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class BrowserStackMemoryAssembly {
  async start () {
    this._memoryTodoList = new MemoryTodoList()
    this._webApp = new WebApp({ todoList: this._memoryTodoList, serveClient: true })
    const port = await this._webApp.listen(0)
    this._browserStackTodoList = new BrowserStackTodoList(`http://localhost:${port}`)
    await this._browserStackTodoList.start()
  }

  async stop () {
    await this._browserStackTodoList.stop()
    await this._webApp.stop()
  }

  async contextTodoList() {
    return this._memoryTodoList
  }

  async actionTodoList() {
    return this._browserStackTodoList
  }

  async outcomeTodoList() {
    return this._browserStackTodoList
  }
}
