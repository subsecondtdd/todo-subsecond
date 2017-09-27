const Sequelize = require('sequelize');

let sequelize

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres'
  })
} else {
  sequelize = new Sequelize('todo-subsecond', '', '', {
    dialect: 'postgres',
    logging: false
  })
}

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
