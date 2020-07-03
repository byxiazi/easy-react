"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileTpl = /** @class */ (function () {
    function FileTpl() {
    }
    FileTpl.prototype.entry = function () {
        var index = "\n      import React from 'react'\n      import ReactDOM from 'react-dom'\n      import { Store } from 'redux'\n      import { Provider } from 'react-redux'\n      import { BrowserRouter, Route } from 'react-router-dom'\n      import { renderRoutes } from 'react-router-config'\n      import configStore from '@/common/config-store'\n      // @ts-ignore\n      import easyConfig from '../../easy.config'\n\n\n      const store = configStore()\n\n      function renderApp(app: React.ReactElement) {\n        ReactDOM.render(\n          app,\n          document.getElementById('root')\n        );\n      }\n\n      const Root = ({ store }: {store: Store}) => (\n        <Provider store={store}>\n          <BrowserRouter>\n            {\n              renderRoutes(easyConfig.routes)\n            }\n          </BrowserRouter>\n        </Provider>\n      )\n\n      renderApp(<Root store={store} />)\n\n      if (module.hot) {\n        module.hot.accept()\n      }\n    ";
        return index;
    };
    FileTpl.prototype.componentTpl = function (name) {
        var c = "\n      import React, { Component } from 'react'\n\n      export default class " + name + " extends Component {\n        render() {\n          return (\n            <div className=\"" + name.toLowerCase() + "\" >\n              " + name + " page\n            </div>\n          )\n        }\n      }\n    ";
        return c;
    };
    FileTpl.prototype.reducerTpl = function () {
        var r = "\n      const initialState = {}\n\n      export default function reducer(state = initialState, action) {\n        let newState\n        switch (action.type) {\n          // Handle cross-topic actions here\n          default:\n            newState = state\n            break\n        }\n        return newState\n      }\n    ";
        return r;
    };
    FileTpl.prototype.rootReducer = function () {
        var rr = "\n      import { combineReducers } from 'redux'\n      import homeReducer from '@/features/home/redux/reducers'\n      import loginReducer from '@/features/login/redux/reducers'\n\n      const reducerMap = {\n        home: homeReducer,\n        login: loginReducer\n      }\n\n      export default combineReducers(reducerMap)\n    ";
        return rr;
    };
    FileTpl.prototype.storeConfig = function () {
        var sc = "\n      import { createStore, applyMiddleware, compose, Store } from 'redux'\n      import thunk from 'redux-thunk'\n      import rootReducer from './root-reducer'\n\n      const middlewares = [\n        thunk,\n      ]\n\n      let devToolsExtension = (f: any) => f\n\n      if (process.env.NODE_ENV === 'development') {\n        const { createLogger } = require('redux-logger')\n\n        const logger = createLogger({collapsed: true})\n        middlewares.push(logger)\n\n        if ((window as any).devToolsExtension) {\n          devToolsExtension = (window as any).devToolsExtension()\n        }\n      }\n\n      export default function configureStore(initialState?: any): Store {\n        const store = createStore(rootReducer, initialState, compose(\n          applyMiddleware(...middlewares),\n          devToolsExtension\n        ))\n        return store\n      }\n    ";
        return sc;
    };
    return FileTpl;
}());
exports.default = FileTpl;
