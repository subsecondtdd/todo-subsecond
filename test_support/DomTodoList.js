module.exports = class DomTodoList {
  constructor(domNode) {
    this._domNode = domNode
  }

  async addTodo({ text }) {
    return new Promise((resolve, reject) => {
      this._domNode.addEventListener('todos:item:added', () => {
        resolve()
      })

      this._domNode.querySelector('[aria-label="New Todo Text"]').value = text
      this._domNode.querySelector('[aria-label="Add Todo"]').click()
    })
  }

  async getItems() {
    const itemNodes = [...this._domNode.querySelector('[aria-label="Todos"]').querySelectorAll('li')]
    return itemNodes
  }
}
