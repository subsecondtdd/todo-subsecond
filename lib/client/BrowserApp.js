module.exports = class BrowserApp {
  constructor({ domNode, todoList }) {
    this._domNode = domNode
    this._todoList = todoList

    this._addTodoButton = this._domNode.querySelector('[aria-label="Add Todo"]')
    this._todoTextField = this._domNode.querySelector('[aria-label="New Todo Text"]')
    this._todos = this._domNode.querySelector('[aria-label="Todos"]')

    this._addTodoButton.addEventListener('click', event => {
      event.preventDefault()
      const text = this._todoTextField.value
      this.addTodo({ text })
        .then(() => {
          this._todoTextField.value = ''
        })
        .catch(err => console.error(err))
    })
  }

  async mount() {
    this.renderTodos(await this._todoList.getTodos())
  }

  async addTodo({ text }) {
    await this._todoList.addTodo({ text })

    const todos = await this._todoList.getTodos()
    await this.renderTodos(todos)

    this._domNode.dispatchEvent(
      new window.CustomEvent('todos:todo:added', {
        bubbles: true,
      })
    )
  }

  renderTodos(todos) {
    // Remove old todos
    while (this._todos.hasChildNodes()) {
      this._todos.removeChild(this._todos.lastChild)
    }

    // Render new ones
    for(const { text } of todos) {
      const li = document.createElement('li')
      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      const textNode = document.createTextNode(text)

      label.appendChild(checkbox)
      label.appendChild(textNode)
      li.appendChild(label)
      this._todos.appendChild(li)
    }
  }
}
