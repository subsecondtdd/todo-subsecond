const fs = require('fs')
const path = require('path')

const { setWorldConstructor } = require('cucumber')
const TodoList = require('../../lib/TodoList')
const mountBrowserApp = require('../../lib/mountBrowserApp')
const DomTodoList = require('../../test_support/DomTodoList')

class TodoWorld {
  constructor() {
    const todoList = new TodoList()

    const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
    const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
    const domNode = document.createElement('div')
    domNode.innerHTML = html
    document.body.appendChild(domNode)
    mountBrowserApp({ domNode, todoList })

    this.contextTodoList = todoList
    this.actionTodoList = new DomTodoList(domNode)
    this.outcomeTodoList = todoList
  }
}

setWorldConstructor(TodoWorld)
