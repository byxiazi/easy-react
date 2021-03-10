import { Subscribed } from '../index'
type notifyCb = (state: Subscribed) => void
type setCache = (state: any, expired?: number) => void
export type reducer = (oldState: any, payload: any) => any

interface Model {
  namespaces: string[]
  state: {
    [namespace: string]: any
  }
  reducers: { namespace: string; reducer: reducer }[]
  subs: Array<{
    publishers: string[]
    namespace: string
    callback: notifyCb
  }>
  caches: Array<{
    namespace: string
    callback: setCache
  }>
  register(
    namespace: string,
    initState: any,
    setCacheCb: setCache,
    reducer?: reducer
  ): void
  subscribe(namespace: string, publishers: string[], callback: notifyCb): void
  unSubscribe(namespace: string): void
  unRegister(namespace: string): void
  dispatch(state: any, action: string, expired?: number): any
  getState(namespace: string): any
  reset(namespace: string): void
}

const Model: Model = {
  namespaces: [],
  state: {},
  reducers: [],
  subs: [],
  caches: [],
  register(namespace, initState, setCacheCb, reducer) {
    if (!this.namespaces.includes(namespace)) {
      // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
      this.namespaces.push(namespace)
      this.state[namespace] = undefined
      this.reducers = this.reducers.filter((item) => {
        return item.namespace !== namespace
      })
      this.caches.push({
        namespace,
        callback: setCacheCb,
      })
      reducer &&
        this.reducers.push({
          namespace,
          reducer,
        })
      this.dispatch(initState, namespace)
    }
  },
  unRegister(namespace: string) {
    this.namespaces = this.namespaces.filter((item) => {
      return item !== namespace
    })
  },
  subscribe(namespace, publishers, callback) {
    this.subs = this.subs.filter((item) => {
      return item.namespace !== namespace
    })
    this.subs.push({
      publishers,
      namespace,
      callback,
    })
  },
  unSubscribe(namespace: string) {
    this.subs = this.subs.filter((item) => {
      return item.namespace !== namespace
    })
  },
  dispatch(state, namespace, expired?: number) {
    const oldState = this.state[namespace]
    const r = this.reducers.find((item) => {
      return item.namespace === namespace
    })
    // @ts-ignore
    const { reducer } = r || {}

    let newState: any
    if (typeof reducer === 'function') {
      newState = reducer(oldState, state)
    } else {
      newState = state
    }
    this.state[namespace] = newState
    // 设置缓存
    this.caches.forEach((item) => {
      if (namespace === item.namespace) {
        item.callback(newState, expired)
      }
    })
    // 通知订阅者更新
    this.subs.forEach((item) => {
      if (item.publishers.includes(namespace)) {
        const values: Subscribed = {}
        item.publishers.forEach((item) => {
          values[item] = this.getState(item)
        })
        item.callback(values)
      }
    })
    return newState
  },
  getState(namespace) {
    return this.state[namespace] ? this.state[namespace] : undefined
  },
  reset(namespace: string) {
    this.namespaces = this.namespaces.filter((item) => {
      return item !== namespace
    })
    this.reducers = this.reducers.filter((item) => {
      return item.namespace !== namespace
    })
    this.state[namespace] = undefined
  },
}

export default Model
