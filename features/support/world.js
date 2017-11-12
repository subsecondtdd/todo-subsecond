const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule()

class TodoWorld {
  constructor() {
    this.contextTodoList = () => assembly.contextTodoList()
    this.actionTodoList = () => assembly.actionTodoList()
    this.outcomeTodoList = () => assembly.outcomeTodoList()
  }
}

setWorldConstructor(TodoWorld)

Before(async function() {
  await assembly.start()
})

After(async function() {
  await assembly.stop()
})
