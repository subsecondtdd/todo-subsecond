const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'ordinal',
  regexp: /(\d+)(?:st|nd|rd|th)/,
  transformer(s) {
    return parseInt(s) - 1
  }
})

const personRegexp = /[A-Z][a-z]+/

defineParameterType({
  name: 'contextTodoList',
  regexp: personRegexp,
  transformer(person) {
    return this.contextTodoList(person)
  }
})

defineParameterType({
  name: 'actionTodoList',
  regexp: personRegexp,
  transformer(person) {
    return this.actionTodoList(person)
  }
})

defineParameterType({
  name: 'outcomeTodoList',
  regexp: personRegexp,
  transformer(person) {
    return this.outcomeTodoList(person)
  }
})