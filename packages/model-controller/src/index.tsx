import React, { Component, ClassAttributes } from 'react'
import {
  __RouterContext as RouterContext,
  RouteComponentProps,
} from 'react-router'
import Model, { reducer } from './model/model'
import { session, local } from './model/storage'

export interface CacheOpts {
  cache: 'sessionStorage' | 'localStorage'
  expired?: number
}

export interface ModelConfig {
  namespace: string
  publishers?: string[]
  initState?: any
  reducer?: reducer
  cacheOpts?: CacheOpts
  reset?: boolean
}

export interface WrappedComponentProps extends ClassAttributes<any> {
  // [key: string]: any
  dispatch: (state: any) => void
  getState: () => any
  subscribed: any[] | undefined
  context: RouteComponentProps
}

export interface ControllerProps {
  [key: string]: any
}

interface ControllerState {
  [key: string]: any
}

const CACHE_PREFIX = '(@*@)react-mvc/model-cache//'

function _getState(ns: string) {
  let state
  try {
    const key = CACHE_PREFIX + ns
    const s = session.getItem(key)
    const l = local.getItem(key)
    if (s && l) {
      console.warn(`namespace ${ns} used two caching methods, please
            choose one of "localStorage" and "sessionStorage"`)
    } else if (s && !l) {
      state = s
    } else if (l && !s) {
      const expired = l.expired
      if (expired && expired >= Date.now()) {
        state = l.value
      }
    }
  } catch (error) {
    //
  }

  return state
}

export const getState = (ns: string) => {
  let state = Model.getState(ns)
  if (state === undefined) {
    state = _getState(ns)
  }
  return state
}

export default function config({
  namespace,
  publishers,
  initState,
  reducer,
  cacheOpts,
  reset,
}: ModelConfig) {
  const cacheKey = CACHE_PREFIX + namespace

  function clearLocal() {
    if (local.getItem(cacheKey) != null) {
      local.removeItem(cacheKey)
    }
  }

  function clearSession() {
    if (session.getItem(cacheKey) != null) {
      session.removeItem(cacheKey)
    }
  }

  if (reset) {
    clearLocal()
    clearSession()
    Model.reset(namespace)
  }

  return (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    return class Controller extends Component<
      ControllerProps,
      ControllerState
    > {
      constructor(props: ControllerProps) {
        super(props)
        this.state = {}
        this.init()
      }

      componentDidMount() {
        let subscribed = []
        if (Array.isArray(publishers)) {
          Model.subscribe(namespace, publishers, this.update)
          subscribed = publishers.map((item) => {
            let state = Model.getState(item)
            if (state === undefined) {
              state = this.getInitState(item)
            }
            return state
          })
        }
        this.setState({ subscribed })
      }

      init = () => {
        this.clearAbandonCache()
        const state = this.getInitState(namespace)
        this.register(namespace, state)
        this.setCache(Model.getState(namespace))
      }

      clearAbandonCache = () => {
        if (cacheOpts) {
          switch (cacheOpts.cache) {
            case 'sessionStorage':
              clearLocal()
              break
            case 'localStorage':
              clearSession()
              break
          }
        } else {
          clearLocal()
          clearSession()
        }
      }

      getInitState = (ns: string) => {
        let state = _getState(ns)
        if (state === undefined && ns === namespace) {
          state = initState
        }
        return
      }

      register = (ns: string, state: any) => {
        Model.register(ns, state, reducer)
      }

      update = (state: any) => {
        this.setState({
          subscribed: state,
        })
      }

      getState = (ns?: string) => {
        return getState(ns || namespace)
      }

      dispatch = (state: any, action?: string) => {
        const n = action || namespace
        const newState = Model.dispatch(state, n)
        this.setCache(newState)
      }

      setCache = (state: any) => {
        if (cacheOpts) {
          switch (cacheOpts.cache) {
            case 'sessionStorage':
              session.setItem(cacheKey, state)
              break
            case 'localStorage':
              let expired = 0
              if (typeof cacheOpts.expired === 'number') {
                expired = Date.now() + cacheOpts.expired
              }

              local.setItem(cacheKey, {
                value: state,
                expired,
              })
              break
          }
        }
      }

      componentWillUnmount() {
        Model.unSubscribe(namespace)
      }

      render() {
        const { _ref, ...restProps } = this.props
        const { subscribed, ...restState } = this.state
        return (
          <RouterContext.Consumer>
            {(context) => {
              return (
                <WrappedComponent
                  {...restState}
                  subscribed={subscribed}
                  dispatch={this.dispatch}
                  getState={this.getState}
                  context={context}
                  {...restProps}
                  ref={_ref}
                />
              )
            }}
          </RouterContext.Consumer>
        )
      }
    }
  }
}
