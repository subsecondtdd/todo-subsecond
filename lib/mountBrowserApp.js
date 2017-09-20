module.exports = ({ domNode, todoList }) => {
  const addTodoButton = domNode.querySelector('[aria-label="Add Todo"]')
  const todoTextField = domNode.querySelector('[aria-label="New Todo Text"]')

  addTodoButton.addEventListener('click', event => {
    todoList.addTodo(todoTextField.value)
  })
}
