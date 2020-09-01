export default class FileTpl {
  componentTpl(name: string) {
    const c = `
      import React, { Component } from 'react'
      import controller, { WrapComponentProps } from '@react-mvc/model-controller'

      class ${name} extends Component<WrapComponentProps, any> {
        render() {
          return (
            <div className="${name.toLowerCase()}" >
              ${name} page
            </div>
          )
        }
      }

      export default controller({
        namespace: "${name.toLowerCase()}",
      })(${name})
    `
    return c.replace(/^ {6}/gm, '').trim()
  }

  // reducerTpl() {
  //   const r = `
  //     const initialState = {}

  //     export default function reducer(state = initialState, action) {
  //       let newState
  //       switch (action.type) {
  //         // Handle cross-topic actions here
  //         default:
  //           newState = state
  //           break
  //       }
  //       return newState
  //     }
  //   `
  //   return r
  // }

  // rootReducer() {
  //   const rr = `
  //     import { combineReducers } from 'redux'
  //     import homeReducer from '@/features/home/redux/reducers'
  //     import loginReducer from '@/features/login/redux/reducers'

  //     const reducerMap = {
  //       home: homeReducer,
  //       login: loginReducer
  //     }

  //     export default combineReducers(reducerMap)
  //   `
  //   return rr
  // }

  // storeConfig() {
  //   const sc = `
  //     import { createStore, applyMiddleware, compose, Store } from 'redux'
  //     import thunk from 'redux-thunk'
  //     import rootReducer from './root-reducer'

  //     const middlewares = [
  //       thunk,
  //     ]

  //     let devToolsExtension = (f: any) => f

  //     if (process.env.NODE_ENV === 'development') {
  //       const { createLogger } = require('redux-logger')

  //       const logger = createLogger({collapsed: true})
  //       middlewares.push(logger)

  //       if ((window as any).devToolsExtension) {
  //         devToolsExtension = (window as any).devToolsExtension()
  //       }
  //     }

  //     export default function configureStore(initialState?: any): Store {
  //       const store = createStore(rootReducer, initialState, compose(
  //         applyMiddleware(...middlewares),
  //         devToolsExtension
  //       ))
  //       return store
  //     }
  //   `
  //   return sc
  // }
}
