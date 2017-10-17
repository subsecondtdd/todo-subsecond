const Automerge = require('automerge')

module.exports = class TodoListCollection {
  constructor() {
    this._docSet = new Automerge.DocSet()
    // TODO: Get rid of the dummy - it's needed to trigger a sync
    this._docSet.setDoc('todolist', Automerge.change(Automerge.init(), doc => doc.dummy = 1))
  }

  createConnection(sendMsg) {
    return new Automerge.Connection(this._docSet, sendMsg)
  }
}