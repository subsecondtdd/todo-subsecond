const fs = require('fs')
const path = require('path')

const { setWorldConstructor, After } = require('cucumber')
const memoize = require('map-memo')
const DatabaseTodoList = require('../../lib/server/DatabaseTodoList')
const HttpTodoList = require('../../lib/client/HttpTodoList')
const BrowserApp = require('../../lib/client/BrowserApp')
const WebApp = require('../../lib/server/WebApp')
const MemoryTodoList = require('../../test_support/MemoryTodoList')
const DomTodoList = require('../../test_support/DomTodoList')
const WebDriverTodoList = require('../../test_support/WebDriverTodoList')

if (process.env.CUCUMBER_DOM === 'true') {
  // This is primarily for debugging - cucumber-electron doesn't always provide
  // good error messages (because of Electron?)
  const { JSDOM } = require("jsdom")
  const dom = new JSDOM(`<!DOCTYPE html>`)
  global.document = dom.window.document
}

const assembly = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒  ${assembly}`)

class TodoWorld {
  constructor() {
    this._truncate = true
    this._stoppables = []

    const memoryTodoList = memoize(async () => new MemoryTodoList())

    const domTodoList = async todoList => {
      const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
      const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
      const domNode = document.createElement('div')
      domNode.innerHTML = html
      document.body.appendChild(domNode)
      await new BrowserApp({ domNode, todoList }).mount()
      return new DomTodoList(domNode)
    }

    const databaseTodoList = async () => {
      const databaseTodoList = new DatabaseTodoList()
      await databaseTodoList.start(this._truncate)
      this._truncate = false
      return databaseTodoList
    }

    const httpTodoList = memoize(async webApppTodoList => {
      const webApp = new WebApp({ todoList: webApppTodoList, serveClient: false })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      return new HttpTodoList(`http://localhost:${port}`)
    })

    const webDriverTodoList = memoize(async webApppTodoList => {
      const webApp = new WebApp({ todoList: webApppTodoList, serveClient: true })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      const webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
      await webDriverTodoList.start()
      this._stoppables.push(webDriverTodoList)
      return webDriverTodoList
    })

    const assemblies = {
      'memory': {
        contextTodoList: async () => memoryTodoList(),
        actionTodoList: async () => memoryTodoList(),
        outcomeTodoList: async () => memoryTodoList(),
      },
      'database': {
        contextTodoList: async () => databaseTodoList(),
        actionTodoList: async () => databaseTodoList(),
        outcomeTodoList: async () => databaseTodoList(),
      },
      'http-memory': {
        contextTodoList: async () => memoryTodoList(),
        actionTodoList: async () => httpTodoList(await memoryTodoList()),
        outcomeTodoList: async () => httpTodoList(await memoryTodoList()),
      },
      'dom-memory': {
        contextTodoList: async () => memoryTodoList(),
        actionTodoList: async () => domTodoList(await memoryTodoList()),
        outcomeTodoList: async () => domTodoList(await memoryTodoList()),
      },
      'dom-http-memory': {
        contextTodoList: async () => memoryTodoList(),
        actionTodoList: async () => domTodoList(await httpTodoList(await memoryTodoList())),
        outcomeTodoList: async () => domTodoList(await httpTodoList(await memoryTodoList())),
      },
      'webdriver-database': {
        contextTodoList: async () => databaseTodoList(),
        actionTodoList: async () => webDriverTodoList(await databaseTodoList()),
        outcomeTodoList: async () => webDriverTodoList(await databaseTodoList())
      },
      'webdriver-memory': {
        contextTodoList: async () => memoryTodoList(),
        actionTodoList: async () => webDriverTodoList(await memoryTodoList()),
        outcomeTodoList: async () => webDriverTodoList(await memoryTodoList())
      }
    }

    Object.assign(this, assemblies[assembly])
  }
}

setWorldConstructor(TodoWorld)

After(async function() {
  return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
})
