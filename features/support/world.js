const fs = require('fs')
const path = require('path')

const { setWorldConstructor } = require('cucumber')
const TodoList = require('../../lib/TodoList')
const HttpTodoList = require('../../lib/HttpTodoList')
const mountBrowserApp = require('../../lib/mountBrowserApp')
const mountWebApp = require('../../lib/mountWebApp')
const DomTodoList = require('../../test_support/DomTodoList')

if(process.env.CUCUMBER_DOM === 'true') {
  // This is primarily for debugging - cucumber-electron doesn't always provide
  // good error messages (because of Electron?)
  const { JSDOM } = require("jsdom")
  const dom = new JSDOM(`<!DOCTYPE html>`)
  global.document = dom.window.document
}

class TodoWorld {
  constructor() {
    const todoList = new TodoList()

    this.contextTodoList = async () => todoList

    if (global.document)
      this.actionTodoList = async () => createDomTodoList(await this.contextTodoList())
    else if (process.env.CUCUMBER_ACTION === 'HTTP')
      this.actionTodoList = async () => createHttpTodoList(await this.contextTodoList())
    else
      this.actionTodoList = this.contextTodoList

    if (process.env.CUCUMBER_OUTCOME === 'DOM') {
      this.outcomeTodoList = this.actionTodoList
    } else
      this.outcomeTodoList = this.contextTodoList
  }
}

async function createHttpTodoList(todoList) {
  const webApp = await mountWebApp({ todoList })
  const port = 8899
  const baseUrl = `http://localhost:${port}`
  return new Promise((resolve, reject) => {
    webApp.listen(port, err => {
      if (err) return reject(err)
      resolve(new HttpTodoList(baseUrl))
    })
  })
}

async function createDomTodoList(todoList) {
  const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
  const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
  const domNode = document.createElement('div')
  domNode.innerHTML = html
  document.body.appendChild(domNode)
  mountBrowserApp({ domNode, todoList })
  return new DomTodoList(domNode)
}

setWorldConstructor(TodoWorld)
