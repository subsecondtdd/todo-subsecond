const WebDriverTodoList = require('../../../test_support/WebDriverTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class WebDriverMemoryAssembly {
  async start () {
    this.memoryTodoList = new MemoryTodoList()
    this.webApp = new WebApp({ todoList: this.memoryTodoList, serveClient: true })
    const port = await this.webApp.listen(0)
    this.webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
    await this.webDriverTodoList.start()
  }

  async stop () {
    await this.webDriverTodoList.stop()
    await this.webApp.stop()
  }

  async contextTodoList() {
    return this.memoryTodoList
  }

  async actionTodoList() {
    return this.webDriverTodoList
  }

  async outcomeTodoList() {
    return this.webDriverTodoList
  }
}
