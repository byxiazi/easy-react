function storageFactory(storage: Storage) {
  return {
    setItem(key: string, value: any, errMsg?: string) {
      if (typeof value === 'string') {
        storage.setItem(key, value)
      } else {
        try {
          const _value = JSON.stringify(value)
          storage.setItem(key, _value)
        } catch (e) {
          throw new Error(errMsg || `暂不支持${typeof value}类型值的缓存`)
        }
      }
    },
    getItem(key: string) {
      const value = storage.getItem(key)
      if (value === null) return value
      try {
        const _value = JSON.parse(value)
        return _value
      } catch (e) {
        return value
      }
    },
    removeItem(key: string) {
      storage.removeItem(key)
    },
  }
}
export const local = storageFactory(localStorage)

export const session = storageFactory(sessionStorage)
