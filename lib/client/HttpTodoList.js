module.exports = class HttpTodoList {
  constructor(baseUrl, fetch) {
    this._baseUrl = baseUrl
    this._fetch = fetch || require('node-fetch')
  }

  async addTodo({ text }) {
    const res = await this._fetch(this._baseUrl + '/todos', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })
    if(res.status !== 201)
      throw new Error('Failed to create TODO')
  }

  async getTodos() {
    const res = await this._fetch(this._baseUrl + '/todos')
    if(res.status !== 200)
      throw new Error('Failed to get TODOs')
    return res.json()
  }
}
