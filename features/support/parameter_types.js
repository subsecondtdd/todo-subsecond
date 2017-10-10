const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'ordinal',
  regexp: /(\d+)(?:st|nd|rd|th)/,
  transformer(s) {
    return parseInt(s) - 1
  }
})