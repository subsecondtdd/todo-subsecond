const Sequelize = require('sequelize');
const sequelize = new Sequelize('todo-subsecond', '', '', {
  dialect: 'postgres',
  logging: null
})

const TodoItem = sequelize.define('todo-item', {
  text: Sequelize.STRING,
})

module.exports = class DatabaseTodoList {

  async start(truncate) {
    await sequelize.sync()
    if(truncate) {
      await TodoItem.truncate()
    }
  }

  async addTodo({ text }) {
    await TodoItem.create({ text })
  }

  async getItems() {
    return TodoItem.all()
  }
}
