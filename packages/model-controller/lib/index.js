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
export default function config(_a) {
    var namespace = _a.namespace, subscribe = _a.subscribe, initState = _a.initState, reducer = _a.reducer, cacheOpts = _a.cacheOpts;
    var cacheKey = CACHE_PREFIX + namespace;
    return function (WrapComponent) {
        return /** @class */ (function (_super) {
            __extends(Controller, _super);
            function Controller(props) {
                var _this = _super.call(this, props) || this;
                _this.init = function () {
                    var state = _this.getInitState(namespace);
                    _this.register(namespace, undefined);
                    _this.dispatch(state);
                };
                _this.getInitState = function (ns) {
                    var state = ns === namespace ? initState : undefined;
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
                            var temp = l;
                            if (temp) {
                                var expired = temp.expired;
                                if (expired >= Date.now()) {
                                    state = temp.value;
                                }
                            }
                        }
                    }
                    catch (error) {
                        //
                    }
                    return state;
                };
                _this.register = function (ns, state) {
                    Model.register(ns, state, reducer);
                };
                _this.update = function (state) {
                    _this.setState({
                        subscribed: state,
                    });
                };
                _this.getState = function () {
                    return Model.getState(namespace);
                };
                _this.dispatch = function (state) {
                    var newState = Model.dispatch(state, namespace);
                    if (cacheOpts) {
                        switch (cacheOpts.cache) {
                            case 'sessionStorage':
                                session.setItem(cacheKey, newState);
                                break;
                            case 'localStorage':
                                var expired = 0;
                                if (typeof cacheOpts.expired === 'number') {
                                    expired = Date.now() + cacheOpts.expired;
                                }
                                local.setItem(cacheKey, {
                                    value: newState,
                                    expired: expired,
                                });
                                break;
                        }
                    }
                };
                _this.init();
                var subscribed = [];
                if (Array.isArray(subscribe)) {
                    Model.subscribe(namespace, subscribe, _this.update);
                    subscribed = subscribe.map(function (item) {
                        var state = Model.getState(item);
                        if (state === undefined) {
                            state = _this.getInitState(item);
                        }
                        return state;
                    });
                }
                _this.state = {
                    subscribed: subscribed,
                };
                return _this;
            }
            // cacheState = (state: any) => {
            //   if (cacheOpts) {
            //     switch (cacheOpts.cache) {
            //       case 'sessionStorage':
            //         session.setItem(cacheKey, state)
            //         break
            //       case 'localStorage':
            //         let expired = 0
            //         if (typeof cacheOpts.expired === 'number') {
            //           expired = Date.now() + cacheOpts.expired
            //         }
            //         local.setItem(cacheKey, {
            //           value: state,
            //           expired,
            //         })
            //         break
            //     }
            //   }
            // }
            Controller.prototype.componentWillUnmount = function () {
                Model.unSubscribe(namespace);
            };
            Controller.prototype.render = function () {
                var _this = this;
                var _a = this.props, _ref = _a._ref, rest = __rest(_a, ["_ref"]);
                return (React.createElement(RouterContext.Consumer, null, function (context) {
                    console.log(context, 'ccc');
                    return (React.createElement(WrapComponent, __assign({}, _this.state, { dispatch: _this.dispatch, getState: _this.getState, context: context }, rest, { ref: _ref })));
                }));
            };
            return Controller;
        }(Component));
    };
}
//# sourceMappingURL=index.js.map