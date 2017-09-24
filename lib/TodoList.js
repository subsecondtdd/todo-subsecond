module.exports = class TodoList {
  constructor() {
    this._items = []
  }

  async addTodo({ text }) {
    this._items.push({ text })
  }

  async getItems() {
    return this._items
  }
}
