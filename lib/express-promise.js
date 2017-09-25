const wrap = asyncFn => (req, res, next) => {
  asyncFn(req, res, next).catch(err => next(err))
}

module.exports = function(app) {
  return {
    delete: (path, fn) => app.delete(path, wrap(fn)),
    get: (path, fn) => app.get(path, wrap(fn)),
    post: (path, fn) => app.post(path, wrap(fn)),
    put: (path, fn) => app.put(path, wrap(fn)),
  }
}
