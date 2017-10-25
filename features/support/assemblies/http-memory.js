const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')
const HttpTodoList = require('../../../lib/client/HttpTodoList')

module.exports = class HttpMemoryAssembly {
  constructor () {
    this.memoryTodoList = new MemoryTodoList()
    this.webApp = new WebApp({ todoList: this.memoryTodoList, serveClient: false })
  }

  async start () {
    const port = await this.webApp.listen(0)
    this.httpTodoList = new HttpTodoList(`http://localhost:${port}`)
  }

  async stop () {
    await this.webApp.stop()
  }

  async contextTodoList() {
    return this.memoryTodoList
  }

  async actionTodoList() {
    return this.httpTodoList
  }

  async outcomeTodoList() {
    return this.httpTodoList
  }
}
