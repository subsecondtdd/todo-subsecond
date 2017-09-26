const mountBrowserApp = require('./mountBrowserApp')
const HttpTodoList = require('../HttpTodoList')

document.addEventListener("DOMContentLoaded", function(event) {
  mountBrowserApp({
    domNode: document.body,
    todoList: new HttpTodoList('', window.fetch.bind(window))
  })
})
