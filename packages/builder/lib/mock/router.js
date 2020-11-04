exports.get = function (app, url, value) {
  if (typeof value === 'function') {
    app.get(url, value)
  } else {
    app.get(url, function (req, res) {
      res.send(value)
    })
  }
}

exports.post = function (app, url, value) {
  if (typeof value === 'function') {
    app.post(url, value)
  } else {
    app.post(url, function (req, res) {
      res.send(value)
    })
  }
}

exports.put = function (app, url, value) {
  if (typeof value === 'function') {
    app.put(url, value)
  } else {
    app.put(url, function (req, res) {
      res.send(value)
    })
  }
}

exports.delete = function (app, url, value) {
  if (typeof value === 'function') {
    app.delete(url, value)
  } else {
    app.delete(url, function (req, res) {
      res.send(value)
    })
  }
}
