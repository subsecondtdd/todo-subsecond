const fs = require('fs')
const path = require('path')
const DomTodoList = require('../../../test_support/DomTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const HttpTodoList = require('../../../lib/client/HttpTodoList')
const BrowserApp = require('../../../lib/client/BrowserApp')
const WebApp = require('../../../lib/server/WebApp')

module.exports = class DomHttpMemoryAssembly {
  constructor () {
    this.memoryTodoList = new MemoryTodoList()
    this.webApp = new WebApp({ todoList: this.memoryTodoList, serveClient: false })
  }

  async contextTodoList() {
    return this.memoryTodoList
  }

  async actionTodoList() {
    return await this.makeDomTodoList()
  }

  async outcomeTodoList() {
    return await this.makeDomTodoList()
  }

  async makeDomTodoList() {
    const publicIndexHtmlPath = path.join(__dirname, '..', '..', '..', 'public', 'index.html')
    const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
    const domNode = document.createElement('div')
    domNode.innerHTML = html
    document.body.appendChild(domNode)
    await new BrowserApp({ domNode, todoList: await this.makeHttpTodoList() }).mount()
    return new DomTodoList(domNode)
  }

  async makeHttpTodoList() {
    const port = await this.webApp.listen(0)
    return new HttpTodoList(`http://localhost:${port}`)
  }
}
