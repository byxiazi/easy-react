var Model = {
    namespaces: [],
    state: {},
    reducers: [],
    subs: [],
    register: function (namespace, initState, reducer) {
        if (!this.namespaces.includes(namespace)) {
            // throw new Error(`[${namespace}]: Cannot register the same namespace！`)
            this.namespaces.push(namespace);
            this.state[namespace] = undefined;
            this.reducers = this.reducers.filter(function (item) {
                return item.namespace !== namespace;
            });
            reducer &&
                this.reducers.push({
                    namespace: namespace,
                    reducer: reducer,
                });
            this.dispatch(initState, namespace);
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
        var oldState = this.state[namespace];
        var r = this.reducers.find(function (item) {
            return item.namespace === namespace;
        });
        // @ts-ignore
        var reducer = (r || {}).reducer;
        var newState;
        if (typeof reducer === 'function') {
            newState = reducer(oldState, state);
        }
        else {
            newState = state;
        }
        this.state[namespace] = newState;
        this.subs.forEach(function (item) {
            if (item.publishers.includes(namespace)) {
                var values_1 = {};
                item.publishers.forEach(function (item) {
                    values_1[item] = _this.getState(item);
                });
                item.callback(values_1);
            }
        });
        return newState;
    },
    getState: function (namespace) {
        return this.state[namespace] ? this.state[namespace] : undefined;
    },
    reset: function (namespace) {
        this.namespaces = this.namespaces.filter(function (item) {
            return item !== namespace;
        });
        this.reducers = this.reducers.filter(function (item) {
            return item.namespace !== namespace;
        });
        this.state[namespace] = undefined;
    },
};
export default Model;
//# sourceMappingURL=model.js.map