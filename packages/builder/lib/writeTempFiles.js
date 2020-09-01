const fs = require('fs-extra')
const path = require('path')

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

class Generator {
  constructor(cwd, config) {
    const {
      base,
      history,
      routes
    } = config
    this.cwd = cwd
    this.base = base || '/'
    this.history = history
    this.routes = routes || []
  }

  reactRouter() {
    let _type = 'browser'
    let _options = {}
    if (this.history && isPlainObject(this.history)) {
      const {
        type,
        options
      } = this.history
      _type = type
      _options = isPlainObject(options) ? options : {}
    }

    const {
      routes,
      esModules,
      options
    } = this.parseRouter(_options)

    let router = null
    switch (_type) {
      case 'browser':
        router =
          `<BrowserRouter {...options} basename="${this.base}">
          {renderRoutes(${routes})}
        </BrowserRouter>`
        break;
      case 'hash':
        router =
          `<HashRouter {...options} basename="${this.base}">
          {renderRoutes(${routes})}
        </HashRouter>`
        break;
      case 'memory':
        router =
          `<MemoryRouter {...options} basename="${this.base}">
          {renderRoutes(${routes})}
        <MemoryRouter>`
        break;
    }

    return {
      router,
      esModules,
      options,
    }
  }

  parseRouter(options) {
    const esModules = []

    function deepParse(list) {
      list.map(item => {
        const relativePath = item.component
        if (!relativePath) return

        const ext = path.extname(relativePath)
        const filename = path.basename(relativePath, ext)
        const component = filename.replace(/.?/, ($1) => {
          if (!$1) return ''
          return $1.toUpperCase()
        })
        item.component = component
        const esImport = `import ${component} from "${relativePath}"`
        esModules.push(esImport)

        if (Array.isArray(item.routes)) {
          deepParse(item.routes)
        }
      })
    }

    deepParse(this.routes)

    const getUserConfirmation = options.getUserConfirmation

    if (typeof getUserConfirmation === 'string') {
      const matchs = getUserConfirmation.match(/^\s*import(.*)from/)
      if (matchs) {
        let name = matchs[1]
        name = name.replace(/{|}/g, '').trim()
        esModules.push(getUserConfirmation.replace(/^\s*(import.*?from)(.*)/, (_, b, c) => {
          return `${b} "${c.trim()}"`
        }))
        options.getUserConfirmation = name
      }
    } else {
      options.getUserConfirmation = undefined
    }

    return {
      routes: JSON.stringify(this.routes).replace(/("component":)"(.*?)"/g, (_, $1, $2) => {
        return $1 + $2
      }),
      esModules,
      options: JSON.stringify(options),
    }
  }


  entry() {
    const {
      router,
      esModules,
      options,
    } = this.reactRouter()

    const cnt = `
      /* tslint:disable */
      import React from 'react'
      import ReactDOM from 'react-dom'
      import { BrowserRouter } from 'react-router-dom'
      import { renderRoutes } from 'react-router-config'
      ${esModules.join('\n')}


      function renderApp(app: React.ReactElement) {
        ReactDOM.render(
          app,
          document.getElementById('root')
        );
      }

      const options = ${options}


      const Root = () => (
        ${router}
      )

      renderApp(<Root />)

      if (module.hot) {
        module.hot.accept()
      }
    `
    return cnt
  }

  create() {
    const cnt = this.entry()
    const dir = path.join(this.cwd, '.easy')
    fs.removeSync(dir)
    fs.ensureDirSync(dir)
    fs.writeFileSync(path.join(dir, 'index.tsx'), cnt.replace(/^ {6}/gm, '').trim())
    fs.utimesSync(path.join(dir, 'index.tsx'), (Date.now() - 10 * 1000) / 1000, (Date.now() - 10 * 1000) / 1000)
  }
}


exports.writeTempFiles = function (cwd, config) {
  const g = new Generator(cwd, config)
  g.create()
}
