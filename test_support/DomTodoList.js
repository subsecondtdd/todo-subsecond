module.exports = class DomTodoList {
  constructor(domNode) {
    this._domNode = domNode
  }

  addTodo({ text }) {
    this._domNode.querySelector('[aria-label="New Todo Text"]').value = text
    this._domNode.querySelector('[aria-label="Add Todo"]').click()
  }

  getItems() {
    const itemNodes = [...this._domNode.querySelector('[aria-label="Todos"]').querySelectorAll('li')]
    return itemNodes
  }
}
