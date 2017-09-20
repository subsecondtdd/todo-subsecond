module.exports = class TodoList {
  constructor() {
    this._items = []
  }

  addTodo({ text }) {
    this._items.push({ text })
  }

  getItems() {
    return this._items
  }
}
