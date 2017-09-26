module.exports = async ({ domNode, todoList }) => {
  const addTodoButton = domNode.querySelector('[aria-label="Add Todo"]')
  const todoTextField = domNode.querySelector('[aria-label="New Todo Text"]')
  const todos = domNode.querySelector('[aria-label="Todos"]')

  function render(items) {
    // Remove old items
    while (todos.hasChildNodes()) {
      todos.removeChild(todos.lastChild)
    }

    // Render new ones
    for(const { text } of items) {
      const li = document.createElement('li')
      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      const textNode = document.createTextNode(text)

      label.appendChild(checkbox)
      label.appendChild(textNode)
      li.appendChild(label)
      todos.appendChild(li)
    }
  }

  const items = await todoList.getItems()
  await render(items)

  addTodoButton.addEventListener('click', event => {
    event.preventDefault()
    const text = todoTextField.value
    addTodo({ text })
      .then(() => {
        todoTextField.value = ''
      })
      .catch(err => console.error(err))
  })

  async function addTodo({ text }) {
    await todoList.addTodo({ text })

    const items = await todoList.getItems()
    await render(items)

    domNode.dispatchEvent(
      new window.CustomEvent('todos:item:added', {
        bubbles: true,
      })
    )
  }
}
