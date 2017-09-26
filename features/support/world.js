const fs = require('fs')
const path = require('path')

const { setWorldConstructor, After } = require('cucumber')
const memoize = require('map-memo')
const TodoList = require('../../lib/TodoList')
const HttpTodoList = require('../../lib/HttpTodoList')
const mountBrowserApp = require('../../lib/mountBrowserApp')
const mountWebApp = require('../../lib/mountWebApp')
const DomTodoList = require('../../test_support/DomTodoList')
const WebDriverTodoList = require('../../test_support/WebDriverTodoList')

if(process.env.CUCUMBER_DOM === 'true') {
  // This is primarily for debugging - cucumber-electron doesn't always provide
  // good error messages (because of Electron?)
  const { JSDOM } = require("jsdom")
  const dom = new JSDOM(`<!DOCTYPE html>`)
  global.document = dom.window.document
}

const factory = {
  todoList: memoize(async () => new TodoList()),
  domTodoList: memoize(async todoList => {
    const publicIndexHtmlPath = path.join(__dirname, '..', '..', 'public', 'index.html')
    const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
    const domNode = document.createElement('div')
    domNode.innerHTML = html
    document.body.appendChild(domNode)
    await mountBrowserApp({ domNode, todoList })
    return new DomTodoList(domNode)
  }),
  httpTodoList: memoize(async todoList => {
    const webApp = await mountWebApp({ todoList })
    const port = 8899
    const baseUrl = `http://localhost:${port}`
    return new Promise((resolve, reject) => {
      webApp.listen(port, err => {
        if (err) return reject(err)
        resolve(new HttpTodoList(baseUrl))
      })
    })
  }),
  webDriverTodoList: memoize(async () => {
    const webApp = await mountWebApp({ todoList: new TodoList() })
    const port = 8898
    const baseUrl = `http://localhost:${port}`
    return new Promise((resolve, reject) => {
      webApp.listen(port, err => {
        if (err) return reject(err)
        resolve(new WebDriverTodoList(baseUrl))
      })
    })
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
    actionTodoList: async () => await factory.httpTodoList(await factory.todoList()),
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
    contextTodoList: async () => factory.webDriverTodoList(),
    actionTodoList: async () => factory.webDriverTodoList(),
    outcomeTodoList: async () => factory.webDriverTodoList()
  }
}

class TodoWorld {
  constructor() {
    Object.assign(this, assemblies[process.env.CUCUMBER_HONEYCOMB || 'memory'])
  }

  async stop() {
    return await Promise.all([
      await this.contextTodoList(),
      await this.actionTodoList(),
      await this.outcomeTodoList()
    ].map(list => {
      return list.stop ? list.stop() : Promise.resolve()
    }))
  }
}
setWorldConstructor(TodoWorld)

After(async function () {
  await this.stop()
})
