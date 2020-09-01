"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileTpl = /** @class */ (function () {
    function FileTpl() {
    }
    FileTpl.prototype.componentTpl = function (name) {
        var c = "\n      import React, { Component } from 'react'\n      import controller, { WrapComponentProps } from 'model-controller'\n\n      class " + name + " extends Component<WrapComponentProps, any> {\n        render() {\n          return (\n            <div className=\"" + name.toLowerCase() + "\" >\n              " + name + " page\n            </div>\n          )\n        }\n      }\n\n      export default controller({\n        namespace: \"" + name.toLowerCase() + "\",\n      })(" + name + ")\n    ";
        return c.replace(/^ {6}/gm, '').trim();
    };
    return FileTpl;
}());
exports.default = FileTpl;
