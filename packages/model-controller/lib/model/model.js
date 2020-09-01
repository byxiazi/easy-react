var Model = {
    namespaces: [],
    state: {},
    publishers: [],
    register: function (namespace, initState, reducer) {
        if (!this.namespaces.includes(namespace)) {
            // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
            this.namespaces.push(namespace);
            this.state[namespace] = {
                state: initState,
                reducer: reducer,
            };
        }
    },
    subscribe: function (namespace, publishers, callback) {
        this.publishers = this.publishers.filter(function (item) {
            return item.namespace !== namespace;
        });
        this.publishers.push({
            publishers: publishers,
            namespace: namespace,
            callback: callback,
        });
    },
    unSubscribe: function (namespace) {
        this.publishers = this.publishers.filter(function (item) {
            return item.namespace !== namespace;
        });
    },
    dispatch: function (state, namespace) {
        var _this = this;
        var _a = this.state[namespace], r = _a.reducer, oldState = _a.state;
        var newState;
        if (typeof r === 'function') {
            newState = r(oldState, state);
        }
        else {
            newState = state;
        }
        this.state[namespace].state = newState;
        this.publishers.forEach(function (item) {
            if (item.publishers.includes(namespace)) {
                var values = item.publishers.map(function (item) {
                    return _this.getState(item);
                });
                item.callback(values);
            }
        });
        return newState;
    },
    getState: function (namespace) {
        return this.state[namespace] ? this.state[namespace].state : undefined;
    },
};
export default Model;
//# sourceMappingURL=model.js.map