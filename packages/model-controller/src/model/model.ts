import { Subscribed } from '../index'
type subscriber = (state: Subscribed) => void
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
    callback: subscriber
  }>
  register(namespace: string, initState: any, reducer?: reducer): void
  subscribe(namespace: string, publishers: string[], callback: subscriber): void
  unSubscribe(namespace: string): void
  // unregister(namespace: string): void
  dispatch(state: any, action: string): any
  getState(namespace: string): any
  reset(namespace: string): void
}

const Model: Model = {
  namespaces: [],
  state: {},
  reducers: [],
  subs: [],
  register(namespace, initState, reducer) {
    if (!this.namespaces.includes(namespace)) {
      // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
      this.namespaces.push(namespace)
      this.state[namespace] = undefined
      this.reducers = this.reducers.filter((item) => {
        return item.namespace !== namespace
      })
      reducer &&
        this.reducers.push({
          namespace,
          reducer,
        })
      this.dispatch(initState, namespace)
    }
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
  dispatch(state, namespace) {
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
