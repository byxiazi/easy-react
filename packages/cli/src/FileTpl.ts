export default class FileTpl {
  entry() {
    const index = `
      import React from 'react'
      import ReactDOM from 'react-dom'
      import { Store } from 'redux'
      import { Provider } from 'react-redux'
      import { BrowserRouter, Route } from 'react-router-dom'
      import { renderRoutes } from 'react-router-config'
      import configStore from '@/common/config-store'
      // @ts-ignore
      import easyConfig from '../../easy.config'


      const store = configStore()

      function renderApp(app: React.ReactElement) {
        ReactDOM.render(
          app,
          document.getElementById('root')
        );
      }

      const Root = ({ store }: {store: Store}) => (
        <Provider store={store}>
          <BrowserRouter>
            {
              renderRoutes(easyConfig.routes)
            }
          </BrowserRouter>
        </Provider>
      )

      renderApp(<Root store={store} />)

      if (module.hot) {
        module.hot.accept()
      }
    `
    return index
  }

  componentTpl(name: string) {
    const c = `
      import React, { Component } from 'react'

      export default class ${name} extends Component {
        render() {
          return (
            <div className="${name.toLowerCase()}" >
              ${name} page
            </div>
          )
        }
      }
    `
    return c
  }

  reducerTpl() {
    const r = `
      const initialState = {}

      export default function reducer(state = initialState, action) {
        let newState
        switch (action.type) {
          // Handle cross-topic actions here
          default:
            newState = state
            break
        }
        return newState
      }
    `
    return r
  }

  rootReducer() {
    const rr = `
      import { combineReducers } from 'redux'
      import homeReducer from '@/features/home/redux/reducers'
      import loginReducer from '@/features/login/redux/reducers'

      const reducerMap = {
        home: homeReducer,
        login: loginReducer
      }

      export default combineReducers(reducerMap)
    `
    return rr
  }

  storeConfig() {
    const sc = `
      import { createStore, applyMiddleware, compose, Store } from 'redux'
      import thunk from 'redux-thunk'
      import rootReducer from './root-reducer'

      const middlewares = [
        thunk,
      ]

      let devToolsExtension = (f: any) => f

      if (process.env.NODE_ENV === 'development') {
        const { createLogger } = require('redux-logger')

        const logger = createLogger({collapsed: true})
        middlewares.push(logger)

        if ((window as any).devToolsExtension) {
          devToolsExtension = (window as any).devToolsExtension()
        }
      }

      export default function configureStore(initialState?: any): Store {
        const store = createStore(rootReducer, initialState, compose(
          applyMiddleware(...middlewares),
          devToolsExtension
        ))
        return store
      }
    `
    return sc
  }
}
