var Model = {
    namespaces: [],
    state: {},
    subs: [],
    register: function (namespace, initState, dispatch, reducer) {
        if (!this.namespaces.includes(namespace)) {
            // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
            this.namespaces.push(namespace);
            this.state[namespace] = {
                state: undefined,
                reducer: reducer,
            };
            dispatch(initState, namespace);
        }
    },
    subscribe: function (namespace, publishers, callback) {
        this.subs = this.subs.filter(function (item) {
            return item.namespace !== namespace;
        });
        this.subs.push({
            publishers: publishers,
            namespace: namespace,
            callback: callback,
        });
    },
    unSubscribe: function (namespace) {
        this.subs = this.subs.filter(function (item) {
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
        this.subs.forEach(function (item) {
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
    reset: function (namespace) {
        this.namespaces = this.namespaces.filter(function (item) {
            return item !== namespace;
        });
        this.state[namespace] = undefined;
    },
};
export default Model;
//# sourceMappingURL=model.js.map