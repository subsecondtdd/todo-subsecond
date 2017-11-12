const fs = require('fs')
const path = require('path')
const DomTodoList = require('../../../test_support/DomTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const HttpTodoList = require('../../../lib/client/HttpTodoList')
const BrowserApp = require('../../../lib/client/BrowserApp')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class DomHttpMemoryAssembly {
  async start () {
    this._memoryTodoList = new MemoryTodoList()
    this.webApp = new WebApp({ todoList: this._memoryTodoList, serveClient: false })
  }

  async contextTodoList() {
    return this._memoryTodoList
  }

  async actionTodoList() {
    return await this._makeDomTodoList()
  }

  async outcomeTodoList() {
    return await this._makeDomTodoList()
  }

  async _makeDomTodoList() {
    const publicIndexHtmlPath = path.join(__dirname, '..', '..', '..', 'public', 'index.html')
    const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
    const domNode = document.createElement('div')
    domNode.innerHTML = html
    document.body.appendChild(domNode)
    await new BrowserApp({ domNode, todoList: await this._makeHttpTodoList() }).mount()
    return new DomTodoList(domNode)
  }

  async _makeHttpTodoList() {
    const port = await this.webApp.listen(0)
    return new HttpTodoList(`http://localhost:${port}`)
  }
}
