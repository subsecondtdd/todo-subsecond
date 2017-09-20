module.exports = ({ domNode, todoList }) => {
  const addTodoButton = domNode.querySelector('[aria-label="Add Todo"]')
  const todoTextField = domNode.querySelector('[aria-label="New Todo Text"]')
  const todos = domNode.querySelector('[aria-label="Todos"]')

  addTodoButton.addEventListener('click', event => {
    todoList.addTodo(todoTextField.value)

    const li = document.createElement('li')
    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    const text = document.createTextNode(todoTextField.value)

    label.appendChild(checkbox)
    label.appendChild(text)
    li.appendChild(label)
    todos.appendChild(li)
  })
}
