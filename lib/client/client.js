const BrowserApp = require('./BrowserApp')
const HttpTodoList = require('../HttpTodoList')

new BrowserApp({
  domNode: document.body,
  todoList: new HttpTodoList('', window.fetch.bind(window))
}).mount()
