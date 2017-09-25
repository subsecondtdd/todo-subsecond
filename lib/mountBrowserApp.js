module.exports = async ({ domNode, todoList }) => {
  const addTodoButton = domNode.querySelector('[aria-label="Add Todo"]')
  const todoTextField = domNode.querySelector('[aria-label="New Todo Text"]')
  const todos = domNode.querySelector('[aria-label="Todos"]')

  async function render() {
    for(const item of await todoList.getItems()) {
      await addTodo(item)
    }
  }

  render().catch(err => console.error(`ERROR: ${err.stack}`))

  addTodoButton.addEventListener('click', event => {
    const text = todoTextField.value
    todoList.addTodo({ text }).catch(err => console.error(`ERROR: ${err.stack}`))
    addTodo({ text }).catch(err => console.error(`ERROR: ${err.stack}`))
  })

  async function addTodo({ text }) {
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
