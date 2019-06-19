const Sequelize = require('sequelize');

module.exports = class DatabaseTodoList {

  constructor() {
    const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost/todo-subsecond'
    this._sequelize = new Sequelize(databaseUrl, { logging: false })

    this.Todo = this._sequelize.define('todo', {
      text: Sequelize.STRING,
      // Use Sequelize.BOOLEAN for the done field
    })
  }

  async start(truncate) {
    if (truncate) {
      await this._sequelize.sync({ force: true })
    }
  }

  async addTodo({ text }) {
    await this.Todo.create({ text })
  }

  async getTodos() {
    return this.Todo.findAll().map(record => ({
      text: record.text
    }))
  }

  // async markAsDone(index) {
  //   const todo = .....
  //   await todo.update({ done: true })
  // }
}
