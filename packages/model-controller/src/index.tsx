import React, { Component } from 'react'
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

export type Subscribed = { [key: string]: any }

export interface WrappedComponentProps {
  dispatch: (state: any, action?: string) => void
  getState: (ns?: string) => any
  replaceCacheOpts: (newCacheOpts: CacheOpts) => void
  unRegister: (ns?: string) => void
  subscribed: Subscribed
  context: RouteComponentProps,
}

export interface ControllerProps {
  [key: string]: any
}

interface ControllerState {
  subscribed: Subscribed
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
      if (!expired || expired >= Date.now()) {
        state = l.value
      } else {
        // 清除缓存
        local.removeItem(key)
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

export const dispatch = (state: any, namespace: string) => {
  Model.dispatch(state, namespace)
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

  return <P extends WrappedComponentProps>(WrappedComponent: React.ComponentType<P>) =>
   {
    return class Controller extends Component<
      ControllerProps,
      ControllerState
    > {
      constructor(props: ControllerProps) {
        super(props)

        this.init()
        const subscribed = this.getInitSubscribed()
        this.state = {
          subscribed
        }
      }

      init = () => {
        this.clearAbandonCache()
        const state = this.getInitState(namespace)
        this.register(namespace, state)
      }

      getInitSubscribed = () => {
        let subscribed: Subscribed = {}
        if (Array.isArray(publishers)) {
          Model.subscribe(namespace, publishers, this.update)
          publishers.forEach((item) => {
            subscribed[item] = getState(item)
          })
        }
        return subscribed
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
        return state
      }

      register = (ns: string, state: any) => {
        Model.register(ns, state, this.setCache, reducer)
      }

      update = (state: Subscribed) => {
        this.setState({
          subscribed: state,
        })
      }

      getState = (ns?: string) => {
        return getState(ns || namespace)
      }

      dispatch = (state: any, action?: string) => {
        const n = action || namespace
        Model.dispatch(state, n)
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

      unRegister = (ns?: string) => {
        Model.unRegister(ns || namespace)
      }

      replaceCacheOpts = (newCacheOpts: CacheOpts) => {
        cacheOpts = {
          ...cacheOpts,
          ...newCacheOpts
        }
      }

      componentWillUnmount() {
        Model.unSubscribe(namespace)
      }

      render() {
        const { _ref, ...restProps } = this.props
        const { subscribed } = this.state
        return (
          <RouterContext.Consumer>
            {(context) => {
              return (
                // @ts-ignore
                <WrappedComponent
                  subscribed={subscribed}
                  dispatch={this.dispatch}
                  getState={this.getState}
                  replaceCacheOpts={this.replaceCacheOpts}
                  unRegister={this.unRegister}
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
