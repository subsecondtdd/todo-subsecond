const fs = require('fs')
const path = require('path')

const { setWorldConstructor, After } = require('cucumber')
const DatabaseTodoList = require('../../lib/server/DatabaseTodoList')
const HttpTodoList = require('../../lib/client/HttpTodoList')
const BrowserApp = require('../../lib/client/BrowserApp')
const WebApp = require('../../lib/server/WebApp')
const MemoryTodoList = require('../../test_support/MemoryTodoList')
const DomTodoList = require('../../test_support/DomTodoList')
const WebDriverTodoList = require('../../test_support/WebDriverTodoList')
const BrowserStackTodoList = require('../../test_support/BrowserStackTodoList')

const assembly = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒  ${assembly}`)

class TodoWorld {
  constructor() {
    this._truncate = true
    this._stoppables = []

    const memoryTodoList = new MemoryTodoList()

    const makeDomTodoList = async todoList => {
      const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
      const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
      const domNode = document.createElement('div')
      domNode.innerHTML = html
      document.body.appendChild(domNode)
      await new BrowserApp({ domNode, todoList }).mount()
      return new DomTodoList(domNode)
    }

    const makeDatabaseTodoList = async () => {
      const databaseTodoList = new DatabaseTodoList()
      await databaseTodoList.start(this._truncate)
      this._truncate = false
      return databaseTodoList
    }

    const makeHttpTodoList = async webAppTodoList => {
      const webApp = new WebApp({ todoList: webAppTodoList, serveClient: false })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      return new HttpTodoList(`http://localhost:${port}`)
    }

    const makeWebDriverTodoList = async webAppTodoList => {
      const webApp = new WebApp({ todoList: webAppTodoList, serveClient: true })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      const webDriverTodoList = new WebDriverTodoList(`http://localhost:${port}`)
      await webDriverTodoList.start()
      this._stoppables.push(webDriverTodoList)
      return webDriverTodoList
    }

    const makeBrowserStackTodoList = async webAppTodoList => {
      const webApp = new WebApp({ todoList: webAppTodoList, serveClient: true })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      const browserStackTodoList = new BrowserStackTodoList(`http://localhost:${port}`)
      await browserStackTodoList.start()
      this._stoppables.push(browserStackTodoList)
      return browserStackTodoList
    }

    const assemblies = {
      'memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => memoryTodoList,
        outcomeTodoList: async () => memoryTodoList,
      },
      'database': {
        contextTodoList: async () => makeDatabaseTodoList(),
        actionTodoList: async () => makeDatabaseTodoList(),
        outcomeTodoList: async () => makeDatabaseTodoList(),
      },
      'http-memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => makeHttpTodoList(memoryTodoList),
        outcomeTodoList: async () => makeHttpTodoList(memoryTodoList),
      },
      'dom-memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => makeDomTodoList(memoryTodoList),
        outcomeTodoList: async () => makeDomTodoList(memoryTodoList),
      },
      'dom-http-memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => makeDomTodoList(await makeHttpTodoList(memoryTodoList)),
        outcomeTodoList: async () => makeDomTodoList(await makeHttpTodoList(memoryTodoList)),
      },
      'webdriver-http-database': {
        contextTodoList: async () => makeDatabaseTodoList(),
        actionTodoList: async () => makeWebDriverTodoList(await makeDatabaseTodoList()),
        outcomeTodoList: async () => makeWebDriverTodoList(await makeDatabaseTodoList())
      },
      'webdriver-memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => makeWebDriverTodoList(memoryTodoList),
        outcomeTodoList: async () => makeWebDriverTodoList(memoryTodoList)
      },
      'browserstack-memory': {
        contextTodoList: async () => memoryTodoList,
        actionTodoList: async () => makeBrowserStackTodoList(memoryTodoList),
        outcomeTodoList: async () => makeBrowserStackTodoList(memoryTodoList)
      }
    }

    Object.assign(this, assemblies[assembly])
  }
}

setWorldConstructor(TodoWorld)

After(async function() {
  return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
})
