module.exports = class TodoList {
  addTodo({ text }) {
    if (this._doc.todos === undefined) this._doc.todos = []
    this._doc.todos.push({ text, done: false })
  }

  getTodos() {
    return this._doc.todos || []
  }
}
