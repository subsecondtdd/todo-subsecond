const Sequelize = require('sequelize');

let sequelize

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres'
  })
} else {
  sequelize = new Sequelize('todo-subsecond', '', '', {
    dialect: 'postgres',
    logging: false
  })
}

const Todo = sequelize.define('todo', {
  text: Sequelize.STRING,
})

module.exports = class DatabaseTodoList {

  async start(truncate) {
    if (truncate) {
      await sequelize.sync({ force: true })
    }
  }

  async addTodo({ text }) {
    await Todo.create({ text })
  }

  async getTodos() {
    return Todo.all().map(record => ({
      text: record.text
    }))
  }
}
