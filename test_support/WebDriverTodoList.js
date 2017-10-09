const webdriver = require('selenium-webdriver')
const { By } = webdriver

module.exports = class WebDriverTodoList {
  constructor(baseUrl) {
    this._baseUrl = baseUrl
    this._driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build()
  }

  async start() {
    await this._driver.get(this._baseUrl + '/')
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
