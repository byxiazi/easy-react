type subscriber = (state: any) => void
export type reducer = (oldState: any, payload: any) => any

interface Model {
  // namespaces: string[]
  state: {
    [namespace: string]:
      | {
          state: any
          reducer?: reducer
        }
      | undefined
  }
  publishers: Array<{
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
}

const Model: Model = {
  // namespaces: [],
  state: {},
  publishers: [],
  register(namespace, initState, reducer) {
    this.state[namespace] = {
      state: initState,
      reducer,
    }
  },
  subscribe(namespace, publishers, callback) {
    this.publishers = this.publishers.filter((item) => {
      return item.namespace !== namespace
    })
    this.publishers.push({
      publishers,
      namespace,
      callback,
    })
  },
  unSubscribe(namespace: string) {
    this.publishers = this.publishers.filter((item) => {
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
    this.publishers.forEach((item) => {
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
}

export default Model
