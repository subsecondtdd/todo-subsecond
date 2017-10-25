const fs = require('fs')
const path = require('path')
const DomTodoList = require('../../../test_support/DomTodoList')
const MemoryTodoList = require('../../../test_support/MemoryTodoList')
const BrowserApp = require('../../../lib/client/BrowserApp')

module.exports = class DomMemoryAssembly {
  constructor () {
    this.memoryTodoList = new MemoryTodoList()
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
    await new BrowserApp({ domNode, todoList: this.memoryTodoList }).mount()
    return new DomTodoList(domNode)
  }
}
