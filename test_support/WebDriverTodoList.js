const webdriver = require('selenium-webdriver')
const { By } = webdriver

module.exports = class WebDriverTodoList {
  constructor(baseUrl) {
    this._baseUrl = baseUrl
    this._driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build()

    this._visited = false
  }

  async addTodo({ text }) {
    if (!this._visited) {
      await this._driver.get(this._baseUrl + '/')
      this._visited = true
    }
    const textField = this._driver.findElement(By.css('[aria-label="New Todo Text"]'))
    await textField.sendKeys(text)
    const count = (await this.getItems()).length
    await this._driver.findElement(By.css('[aria-label="Add Todo"]')).click()
    await this._driver.wait(async () => (await this.getItems()).length > count, 10000)
  }

  async getItems() {
    return this._driver.executeScript(() =>
      [].slice.apply(document.querySelectorAll('[aria-label="Todos"] li')).map(li => li.innerText))
  }

  async stop() {
    await this._driver.quit()
  }
}
