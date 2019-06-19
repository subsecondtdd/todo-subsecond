const webdriver = require('selenium-webdriver')
const { By, until } = webdriver

module.exports = class WebDriverTodoList {
  constructor(baseUrl) {
    this._baseUrl = baseUrl
    this._driver = this.buildDriver(new webdriver.Builder()).build()
  }

  buildDriver(builder) {
    return builder.forBrowser('firefox')
  }

  async start() {
    await this._driver.get(this._baseUrl + '/')
    const todoListLocator = By.css('[aria-label="Todos"] ol')
    await this._driver.wait(until.elementLocated(todoListLocator), 10000)
  }

  async addTodo({ text }) {
    const textField = this._driver.findElement(By.css('[aria-label="New Todo Text"]'))
    await textField.sendKeys(text)
    const count = (await this.getTodos()).length
    await this._driver.findElement(By.css('[aria-label="Add Todo"]')).click()
    await this._driver.wait(async () => (await this.getTodos()).length > count, 10000)
  }

  async getTodos() {
    return this._driver.executeScript(() =>
      [...document.querySelectorAll('[aria-label="Todos"] li label')].map(label => ({
        text: label.innerText
      }))
    )
  }

  async stop() {
    await this._driver.quit()
  }
}
