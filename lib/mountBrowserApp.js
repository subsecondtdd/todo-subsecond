module.exports = ({ domNode, todoList }) => {
  const addTodoButton = domNode.querySelector('[aria-label="Add Todo"]')
  const todoTextField = domNode.querySelector('[aria-label="New Todo Text"]')
  const todos = domNode.querySelector('[aria-label="Todos"]')

  for(const item of todoList.getItems()) {
    addTodo(item)
  }

  addTodoButton.addEventListener('click', event => {
    const item = { text: todoTextField.value }
    todoList.addTodo(item)
    addTodo(item)
  })

  function addTodo({ text }) {
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
