module.exports = class DomTodoList {
  constructor(domNode) {
    this._domNode = domNode
  }

  addTodo({ text }) {
    this._domNode.querySelector('[aria-label="New Todo Text"]').value = text
    this._domNode.querySelector('[aria-label="Add Todo"]').click()
  }

  getItems() {
    return [null, null]
  }
}
