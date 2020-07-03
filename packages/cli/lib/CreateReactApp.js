"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var FileTpl_1 = __importDefault(require("./FileTpl"));
var Generator_1 = __importDefault(require("./Generator"));
var CreateReactApp = /** @class */ (function (_super) {
    __extends(CreateReactApp, _super);
    function CreateReactApp(name, targetDir) {
        var _this = _super.call(this) || this;
        _this.init = function () {
            _this.copyTemplates(['index.html', 'package.json', 'tsconfig.json', 'tslint.json', 'babel.config.json', 'postcss.config.js',
                'stylelint.config.js', '.editorconfig', '.gitignore', '.prettierignore', '.prettierrc', 'README.md'], path_1.default.resolve(__dirname, '..', 'templates'), _this.targetDir, {
                'index.html': 'public/index.html'
            });
            ['config', 'public', 'scripts', 'src/common', 'src/features/components',
                'src/features/common-rc', 'src/images', 'src/styles'].forEach(function (item) {
                _this.generator.mkdirs(path_1.default.join(_this.targetDir, item));
            });
        };
        _this.copyTemplates = function (files, srcDir, destDir, options) {
            var srcFiles = {};
            var destFiles = {};
            files.forEach(function (item) {
                srcFiles[item] = path_1.default.join(srcDir, item);
                destFiles[item] = path_1.default.join(destDir, (options && options[item]) || item);
            });
            _this.generator.copyFiles(srcFiles, destFiles);
        };
        _this.createPages = function () {
            var pagesDir = path_1.default.join(_this.targetDir, 'src/features');
            ['Home', 'Login'].forEach(function (item) {
                _this.generator.writeFiles(path_1.default.join(pagesDir, item.toLowerCase()), {
                    'index.tsx': _this.componentTpl(item)
                });
                _this.generator.writeFiles(path_1.default.join(pagesDir, item.toLowerCase(), 'redux'), {
                    'reducers.ts': _this.reducerTpl(),
                    'actions.ts': '',
                });
            });
        };
        _this.app = function () {
            var _a;
            _this.generator.writeFiles(path_1.default.join(_this.targetDir, 'src/.easy'), (_a = {},
                _a['index.tsx'] = _this.entry(),
                _a));
        };
        _this.name = name;
        _this.targetDir = targetDir;
        _this.generator = new Generator_1.default();
        _this.init();
        return _this;
    }
    CreateReactApp.prototype.createStore = function () {
        this.generator.writeFiles(path_1.default.join(this.targetDir, 'common'), {
            'config-store.ts': this.storeConfig(),
            'root-reducer.ts': this.rootReducer()
        });
    };
    CreateReactApp.prototype.create = function () {
        this.createPages();
        this.createStore();
    };
    return CreateReactApp;
}(FileTpl_1.default));
exports.default = CreateReactApp;
