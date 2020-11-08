var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { Component } from 'react';
import { __RouterContext as RouterContext, } from 'react-router';
import Model from './model/model';
import { session, local } from './model/storage';
var CACHE_PREFIX = '(@*@)react-mvc/model-cache//';
function _getState(ns) {
    var state;
    try {
        var key = CACHE_PREFIX + ns;
        var s = session.getItem(key);
        var l = local.getItem(key);
        if (s && l) {
            console.warn("namespace " + ns + " used two caching methods, please\n            choose one of \"localStorage\" and \"sessionStorage\"");
        }
        else if (s && !l) {
            state = s;
        }
        else if (l && !s) {
            var expired = l.expired;
            if (expired && expired >= Date.now()) {
                state = l.value;
            }
        }
    }
    catch (error) {
        //
    }
    return state;
}
export var getState = function (ns) {
    var state = Model.getState(ns);
    if (state === undefined) {
        state = _getState(ns);
    }
    return state;
};
export default function config(_a) {
    var namespace = _a.namespace, publishers = _a.publishers, initState = _a.initState, reducer = _a.reducer, cacheOpts = _a.cacheOpts, reset = _a.reset;
    var cacheKey = CACHE_PREFIX + namespace;
    function clearLocal() {
        if (local.getItem(cacheKey) != null) {
            local.removeItem(cacheKey);
        }
    }
    function clearSession() {
        if (session.getItem(cacheKey) != null) {
            session.removeItem(cacheKey);
        }
    }
    if (reset) {
        clearLocal();
        clearSession();
        Model.reset(namespace);
    }
    return function (WrappedComponent) {
        return /** @class */ (function (_super) {
            __extends(Controller, _super);
            function Controller(props) {
                var _this = _super.call(this, props) || this;
                _this.init = function () {
                    _this.clearAbandonCache();
                    var state = _this.getInitState(namespace);
                    _this.register(namespace, state);
                    _this.setCache(Model.getState(namespace));
                };
                _this.clearAbandonCache = function () {
                    if (cacheOpts) {
                        switch (cacheOpts.cache) {
                            case 'sessionStorage':
                                clearLocal();
                                break;
                            case 'localStorage':
                                clearSession();
                                break;
                        }
                    }
                    else {
                        clearLocal();
                        clearSession();
                    }
                };
                _this.getInitState = function (ns) {
                    var state = _getState(ns);
                    if (state === undefined && ns === namespace) {
                        state = initState;
                    }
                    return;
                };
                _this.register = function (ns, state) {
                    Model.register(ns, state, reducer);
                };
                _this.update = function (state) {
                    _this.setState({
                        subscribed: state,
                    });
                };
                _this.getState = function (ns) {
                    return getState(ns || namespace);
                };
                _this.dispatch = function (state, action) {
                    var n = action || namespace;
                    var newState = Model.dispatch(state, n);
                    _this.setCache(newState);
                };
                _this.setCache = function (state) {
                    if (cacheOpts) {
                        switch (cacheOpts.cache) {
                            case 'sessionStorage':
                                session.setItem(cacheKey, state);
                                break;
                            case 'localStorage':
                                var expired = 0;
                                if (typeof cacheOpts.expired === 'number') {
                                    expired = Date.now() + cacheOpts.expired;
                                }
                                local.setItem(cacheKey, {
                                    value: state,
                                    expired: expired,
                                });
                                break;
                        }
                    }
                };
                _this.state = {};
                _this.init();
                return _this;
            }
            Controller.prototype.componentDidMount = function () {
                var _this = this;
                var subscribed = [];
                if (Array.isArray(publishers)) {
                    Model.subscribe(namespace, publishers, this.update);
                    subscribed = publishers.map(function (item) {
                        var state = Model.getState(item);
                        if (state === undefined) {
                            state = _this.getInitState(item);
                        }
                        return state;
                    });
                }
                this.setState({ subscribed: subscribed });
            };
            Controller.prototype.componentWillUnmount = function () {
                Model.unSubscribe(namespace);
            };
            Controller.prototype.render = function () {
                var _this = this;
                var _a = this.props, _ref = _a._ref, restProps = __rest(_a, ["_ref"]);
                var _b = this.state, subscribed = _b.subscribed, restState = __rest(_b, ["subscribed"]);
                return (React.createElement(RouterContext.Consumer, null, function (context) {
                    return (React.createElement(WrappedComponent, __assign({}, restState, { subscribed: subscribed, dispatch: _this.dispatch, getState: _this.getState, context: context }, restProps, { ref: _ref })));
                }));
            };
            return Controller;
        }(Component));
    };
}
//# sourceMappingURL=index.js.map