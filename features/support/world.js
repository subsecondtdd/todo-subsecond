const fs = require('fs')
const path = require('path')
const EventSource = require('eventsource')
const fetch = require('node-fetch')

const { setWorldConstructor, After } = require('cucumber')
const Automerge = require('automerge')
const { AutomergeModel, AutomergeHttp } = require('automerge-ext')
const TodoListCollection = require('../../lib/server/TodoListCollection')
const BrowserApp = require('../../lib/client/BrowserApp')
const WebApp = require('../../lib/server/WebApp')
const TodoList = require('../../lib/TodoList')
const DomTodoList = require('../../test_support/DomTodoList')
const WebDriverTodoList = require('../../test_support/WebDriverTodoList')
const BrowserStackTodoList = require('../../test_support/BrowserStackTodoList')

const assembly = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒  ${assembly}`)

class TodoWorld {
  constructor() {
    const todoListCollection = new TodoListCollection()

    // TODO: Start in Before, make factory methods sync
    this._stoppables = []

    this._todoLists = new Map()
    const makeTodoList = (person) => {
      if (!this._todoLists.has(person)) {
        const docSet = new Automerge.DocSet()

        let clientConnection
        const collectionConnection = todoListCollection.createConnection(msg =>
          clientConnection.receiveMsg(msg)
        )

        clientConnection = new Automerge.Connection(docSet, msg =>
          collectionConnection.receiveMsg(msg)
        )
        clientConnection.open()
        collectionConnection.open()

        const todoList = AutomergeModel.make(docSet, 'todolist', TodoList, ['addTodo'])
        this._todoLists.set(person, todoList)
      }
      return this._todoLists.get(person)
    }

    const makeHttpTodoList = async person => {
      const webApp = new WebApp({ todoListCollection, serveClient: false })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)

      if (!this._todoLists.has(person)) {
        const docSet = new Automerge.DocSet()
        // TODO: refactor this API to something that can be implemented as in-memory as well
        await AutomergeHttp.makeClient(`http://localhost:${port}/automerge`, EventSource, fetch, docSet, () => null)

        await new Promise(resolve => {
          const handler = (docId) => {
            // TODO: Probably check that it's the right docId
            docSet.unregisterHandler(handler)
            const todoList = AutomergeModel.make(docSet, 'todolist', TodoList, ['addTodo'])

            this._todoLists.set(person, todoList)
            resolve()
          }
          docSet.registerHandler(handler)
        })
      }
      return this._todoLists.get(person)
    }

    const makeDomTodoList = async todoList => {
      const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
      const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
      const domNode = document.createElement('div')
      domNode.innerHTML = html
      document.body.appendChild(domNode)
      new BrowserApp({ domNode, todoList }).mount()
      return new DomTodoList(domNode)
    }

    const makeWebDriverTodoList = async (person) => {
      if (this._todoLists.has(person))
        return this._todoLists.get(person)

      const webApp = new WebApp({ todoListCollection, serveClient: true })
      const port = await webApp.listen(0)
      this._stoppables.push(webApp)
      const todoList = new WebDriverTodoList(`http://localhost:${port}`)
      await todoList.start()
      this._stoppables.push(todoList)

      this._todoLists.set(person, todoList)
      return todoList
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
        contextTodoList: async (person) => makeTodoList(person),
        actionTodoList: async (person) => makeTodoList(person),
        outcomeTodoList: async (person) => makeTodoList(person),
      },
      'http-memory': {
        contextTodoList: async (person) => makeHttpTodoList(person),
        actionTodoList: async (person) => makeHttpTodoList(person),
        outcomeTodoList: async (person) => makeHttpTodoList(person),
      },
      'dom-memory': {
        contextTodoList: async (person) => makeTodoList(person),
        actionTodoList: async (person) => makeDomTodoList(await makeTodoList(person)),
        outcomeTodoList: async (person) => makeDomTodoList(await makeTodoList(person)),
      },
      'dom-http-memory': {
        contextTodoList: async (person) => makeTodoList(person),
        actionTodoList: async (person) => makeDomTodoList(await makeHttpTodoList(await makeTodoList(person))),
        outcomeTodoList: async (person) => makeDomTodoList(await makeHttpTodoList(await makeTodoList(person))),
      },
      'webdriver-memory': {
        contextTodoList: async (person) => makeWebDriverTodoList(person),
        actionTodoList: async (person) => makeWebDriverTodoList(person),
        outcomeTodoList: async (person) => makeWebDriverTodoList(person)
      },
      'browserstack-memory': {
        contextTodoList: async (person) => makeTodoList(person),
        actionTodoList: async (person) => makeBrowserStackTodoList(await makeTodoList(person)),
        outcomeTodoList: async (person) => makeBrowserStackTodoList(await makeTodoList(person))
      }
    }

    Object.assign(this, assemblies[assembly])
  }
}

setWorldConstructor(TodoWorld)

After(async function() {
  return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
})
