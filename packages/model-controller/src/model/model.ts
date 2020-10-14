type subscriber = (state: any) => void
export type reducer = (oldState: any, payload: any) => any

interface Model {
  namespaces: string[]
  state: {
    [namespace: string]:
      | {
          state: any
          reducer?: reducer
        }
      | undefined
  }
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
  subs: [],
  register(namespace, initState, reducer) {
    if (!this.namespaces.includes(namespace)) {
      // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
      this.namespaces.push(namespace)
      this.state[namespace] = {
        state: initState,
        reducer,
      }
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
    const { reducer: r, state: oldState } = this.state[namespace]!
    let newState: any
    if (typeof r === 'function') {
      newState = r(oldState, state)
    } else {
      newState = state
    }
    this.state[namespace]!.state = newState
    this.subs.forEach((item) => {
      if (item.publishers.includes(namespace)) {
        const values = item.publishers.map((item) => {
          return this.getState(item)
        })
        item.callback(values)
      }
    })
    return newState
  },
  getState(namespace) {
    return this.state[namespace] ? this.state[namespace]!.state : undefined
  },
  reset(namespace: string) {
    this.namespaces = this.namespaces.filter((item) => {
      return item !== namespace
    })
    this.state[namespace] = undefined
  },
}

export default Model
