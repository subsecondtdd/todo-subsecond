const BrowserStackTodoList = require('../../../test_support/BrowserStackTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class BrowserStackMemoryAssembly {
  async start () {
    this.memoryTodoList = new MemoryTodoList()
    this.webApp = new WebApp({ todoList: this.memoryTodoList, serveClient: true })
    const port = await this.webApp.listen(0)
    this.browserStackTodoList = new BrowserStackTodoList(`http://localhost:${port}`)
    await this.browserStackTodoList.start()
  }

  async stop () {
    await this.browserStackTodoList.stop()
    await this.webApp.stop()
  }

  async contextTodoList() {
    return this.memoryTodoList
  }

  async actionTodoList() {
    return this.browserStackTodoList
  }

  async outcomeTodoList() {
    return this.browserStackTodoList
  }
}
