const fs = require('fs')
const path = require('path')

module.exports = class DomTodoList {
  constructor() {
    const publicIndexHtmlPath = path.join(__dirname, '..', 'public', 'index.html')
    const html = fs.readFileSync(publicIndexHtmlPath, 'utf-8')
    this._container = document.createElement('div')
    this._container.innerHTML = html
    document.body.appendChild(this._container)
  }

  addTodo({ text }) {
    this._container.querySelector('[aria-label="New Todo Text"]').value = text
    this._container.querySelector('[aria-label="Add Todo"]').click()
  }

  getItems() {
    return [null, null]
  }
}
