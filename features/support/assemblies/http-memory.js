const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const WebApp = require('../../../lib/server/WebApp')
const HttpTodoList = require('../../../lib/client/HttpTodoList')

module.exports = class HttpMemoryAssembly {
  constructor () {
    this._memoryTodoList = new MemoryTodoList()
    this._webApp = new WebApp({ todoList: this._memoryTodoList, serveClient: false })
  }

  async start () {
    const port = await this._webApp.listen(0)
    this._httpTodoList = new HttpTodoList(`http://localhost:${port}`)
  }

  async stop () {
    await this._webApp.stop()
  }

  async contextTodoList() {
    return this._memoryTodoList
  }

  async actionTodoList() {
    return this._httpTodoList
  }

  async outcomeTodoList() {
    return this._httpTodoList
  }
}
