const WebDriverTodoList = require('./WebDriverTodoList')
const browserstack = require('browserstack-local')

module.exports = class BrowserStackTodoList extends WebDriverTodoList {
  buildDriver(builder) {
    return builder
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities({
        'browserName' : 'firefox',
        'browserstack.user' : process.env.BROWSERSTACK_USER,
        'browserstack.key' : process.env.BROWSERSTACK_KEY,
        'browserstack.local' : 'true'
      })
  }

  async start() {
    this.browserstackLocal = new browserstack.Local()
    await new Promise((resolve, reject) => {
      this.browserstackLocal.start({ key: process.env.BROWSERSTACK_KEY }, () => {
        resolve()
      })
    })
    await super.start()
  }

  async stop() {
    await super.stop()
    await new Promise((resolve, reject) => {
      this.browserstackLocal.stop(() => {
        resolve()
      })
    })
  }
}
