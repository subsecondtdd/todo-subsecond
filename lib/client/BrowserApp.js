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
      this._todoList.addTodo({ text })
      this._todoTextField.value = ''
    })
  }

  mount() {
    this.renderTodos(this._todoList.getTodos())
    this._todoList.docUpdated(() => this.renderTodos(this._todoList.getTodos()))
  }

  renderTodos(todos) {
    // Remove old todos
    while (this._todos.hasChildNodes()) {
      this._todos.removeChild(this._todos.lastChild)
    }

    const ol = document.createElement('ol')
    this._todos.appendChild(ol)

    // Render new ones
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      const li = document.createElement('li')
      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      const textNode = document.createTextNode(todo.text)

      label.appendChild(checkbox)
      label.appendChild(textNode)
      li.appendChild(label)
      ol.appendChild(li)
    }
  }
}
