const { setWorldConstructor, Before, After } = require('cucumber')

const assembly = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assembly}`)

const assemblyNames = [
  'memory',
  'dom-memory',
  'http-memory',
  'dom-http-memory',
  'database',
  'webdriver-memory',
  'webdriver-database',
  'browserstack-memory'
]

const assemblies = assemblyNames.reduce((all, file) => {
  const AssemblyModule = require(`./assemblies/${file}`)
  all[file.replace(/\.js$/, '')] = new AssemblyModule()
  return all
}, {})

class TodoWorld {
  constructor() {
    this._startables = []
    this._stoppables = []

    for (let member of Object.getOwnPropertyNames(Object.getPrototypeOf(assemblies[assembly]))) {
      if (member === 'start') {
        this._startables.push(assemblies[assembly])
      } else if (member === 'stop') {
        this._stoppables.push(assemblies[assembly])
      } else if (member !== 'constructor' && typeof assemblies[assembly][member] === 'function') {
        this[member] = assemblies[assembly][member].bind(assemblies[assembly])
      }
    }

    Object.assign(this, assemblies[assembly])
  }
}

setWorldConstructor(TodoWorld)

Before(async function() {
  return Promise.all(this._startables.map(startable => startable.start()))
})

After(async function() {
  return Promise.all(this._stoppables.map(stoppable => stoppable.stop()))
})
