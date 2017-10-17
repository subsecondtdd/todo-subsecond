const Automerge = require('automerge')
const { AutomergeModel, AutomergeHttp } = require('automerge-ext')
const TodoList = require('../TodoList')
const BrowserApp = require('./BrowserApp')

// TODO: Move more of this stuff into BrowserApp
// TODO: Handle reconnect

async function start() {
  const docSet = new Automerge.DocSet()
  await AutomergeHttp.makeClient(
    `/automerge`,
    window.EventSource,
    window.fetch.bind(window),
    docSet,
    err => console.error(err)
  )

  const handler = (docId) => {
    // TODO: Probably check that it's the right docId. I think the docId should be "hard coded"
    // And we have a docSet per "resource", i.e. per todolist.
    docSet.unregisterHandler(handler)
    const todoList = AutomergeModel.make(docSet, 'todolist', TodoList, ['addTodo'])

    new BrowserApp({
      domNode: document.body,
      todoList
    }).mount()
  }
  docSet.registerHandler(handler)
}

start()
  .then(() => console.log('OK'))
  .catch(err => console.error(err))