const fs = require('fs')
const path = require('path')

const { setWorldConstructor, After } = require('cucumber')
const memoize = require('map-memo')
const TodoList = require('../../lib/server/TodoList')
const HttpTodoList = require('../../lib/client/HttpTodoList')
const BrowserApp = require('../../lib/client/BrowserApp')
const WebApp = require('../../lib/server/WebApp')
const DomTodoList = require('../../test_support/DomTodoList')
const WebDriverTodoList = require('../../test_support/WebDriverTodoList')

if(process.env.CUCUMBER_DOM === 'true') {
  // This is primarily for debugging - cucumber-electron doesn't always provide
  // good error messages (because of Electron?)
  const { JSDOM } = require("jsdom")
  const dom = new JSDOM(`<!DOCTYPE html>`)
  global.document = dom.window.document
}

class TodoWorld {
  constructor() {
    this._stoppables = []

    const factory = {
      todoList: memoize(async () => new TodoList()),
      domTodoList: memoize(async todoList => {
        const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
        const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
        const domNode = document.createElement('div')
        domNode.innerHTML = html
        document.body.appendChild(domNode)
        await new BrowserApp({ domNode, todoList }).mount()
        return new DomTodoList(domNode)
      }),
      httpTodoList: memoize(async todoList => {
        const port = 8899
        const webApp = new WebApp({ todoList})
        await webApp.listen(port)
        this._stoppables.push(webApp)
        return new HttpTodoList(`http://localhost:${port}`)
      }),
      webDriverTodoList: memoize(async todoList => {
        const port = 8898
        const webApp = new WebApp({ todoList })
        await webApp.listen(port)
        this._stoppables.push(webApp)
        const webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
        this._stoppables.push(webDriverTodoList)
        return webDriverTodoList
      })
    }

    const assemblies = {
      'memory': {
        contextTodoList: async () => factory.todoList(),
        actionTodoList: async () => factory.todoList(),
        outcomeTodoList: async () => factory.todoList(),
      },
      'http-domain': {
        contextTodoList: async () => factory.todoList(),
        actionTodoList: async () => factory.httpTodoList(await factory.todoList()),
        outcomeTodoList: async () => factory.todoList(),
      },
      'ui-domain': {
        contextTodoList: async () => factory.todoList(),
        actionTodoList: async () => factory.domTodoList(await factory.todoList()),
        outcomeTodoList: async () => factory.domTodoList(await factory.todoList()),
      },
      'full-stack': {
        contextTodoList: async () => factory.todoList(),
        actionTodoList: async () => factory.domTodoList(await factory.httpTodoList(await factory.todoList())),
        outcomeTodoList: async () => factory.domTodoList(await factory.httpTodoList(await factory.todoList())),
      },
      'full-stack-lite': {
        contextTodoList: async () => factory.todoList(),
        actionTodoList: async () => factory.domTodoList(await factory.httpTodoList(await factory.todoList())),
        outcomeTodoList: async () => factory.todoList(),
      },
      'integrated': {
        contextTodoList: async () => factory.webDriverTodoList(await factory.todoList()),
        actionTodoList: async () => factory.webDriverTodoList(await factory.todoList()),
        outcomeTodoList: async () => factory.webDriverTodoList(await factory.todoList())
      }
    }

    Object.assign(this, assemblies[process.env.CUCUMBER_HONEYCOMB || 'memory'])
  }

  async stop() {
    return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
  }
}
setWorldConstructor(TodoWorld)

After(async function () {
  await this.stop()
})
