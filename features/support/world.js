const fs = require('fs')
const path = require('path')

const { setWorldConstructor, Before, After } = require('cucumber')
const memoize = require('map-memo')
const DatabaseTodoList = require('../../lib/server/DatabaseTodoList')
const HttpTodoList = require('../../lib/client/HttpTodoList')
const BrowserApp = require('../../lib/client/BrowserApp')
const WebApp = require('../../lib/server/WebApp')
const MemoryTodoList = require('../../test_support/MemoryTodoList')
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
      memoryTodoList: memoize(async () => new MemoryTodoList()),
      domTodoList: memoize(async todoList => {
        const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
        const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
        const domNode = document.createElement('div')
        domNode.innerHTML = html
        document.body.appendChild(domNode)
        await new BrowserApp({ domNode, todoList }).mount()
        return new DomTodoList(domNode)
      }),
      databaseTodoList: memoize(async() => {
        const databaseTodoList = new DatabaseTodoList()
        await databaseTodoList.start(true)
        return databaseTodoList
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
        contextTodoList: async () => factory.memoryTodoList(),
        actionTodoList: async () => factory.memoryTodoList(),
        outcomeTodoList: async () => factory.memoryTodoList(),
      },
      'database': {
        contextTodoList: async () => factory.databaseTodoList(),
        actionTodoList: async () => factory.databaseTodoList(),
        outcomeTodoList: async () => factory.databaseTodoList(),
      },
      'http-memory': {
        contextTodoList: async () => factory.memoryTodoList(),
        actionTodoList: async () => factory.httpTodoList(await factory.memoryTodoList()),
        outcomeTodoList: async () => factory.httpTodoList(await factory.memoryTodoList()),
      },
      'dom-memory': {
        contextTodoList: async () => factory.memoryTodoList(),
        actionTodoList: async () => factory.domTodoList(await factory.memoryTodoList()),
        outcomeTodoList: async () => factory.domTodoList(await factory.memoryTodoList()),
      },
      'dom-http-memory': {
        contextTodoList: async () => factory.memoryTodoList(),
        actionTodoList: async () => factory.domTodoList(await factory.httpTodoList(await factory.memoryTodoList())),
        outcomeTodoList: async () => factory.domTodoList(await factory.httpTodoList(await factory.memoryTodoList())),
      },
      'webdriver-database': {
        contextTodoList: async () => await factory.databaseTodoList(),
        actionTodoList: async () => factory.webDriverTodoList(await factory.databaseTodoList()),
        outcomeTodoList: async () => factory.webDriverTodoList(await factory.databaseTodoList())
      }
    }

    Object.assign(this, assemblies[process.env.CUCUMBER_HONEYCOMB || 'memory'])
  }
}
setWorldConstructor(TodoWorld)

After(async function () {
  return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
})
