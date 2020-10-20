import path from 'path'
import FileTpl from './FileTpl'
import Generator from './Generator'
import { gitInit } from './shell'
import { IObj } from './index'

export default class CreateReactApp extends FileTpl {
  name: string
  targetDir: string
  generator: Generator
  constructor(name: string, targetDir: string) {
    super()
    this.name = name
    this.targetDir = targetDir
    this.generator = new Generator()
    this.init()
  }

  init = () => {
    ;[
      '.vscode',
      'public',
      'scripts',
      'src/common',
      'src/features/components',
      'src/images',
      'src/styles',
    ].forEach((item) => {
      this.generator.mkdirs(path.join(this.targetDir, item))
    })
    this.copyTemplates(
      [
        'index.html',
        'package.json',
        'tsconfig.json',
        'tslint.json',
        'babel.config.js',
        'easy.config.js',
        'stylelint.config.js',
        'typings.d.ts',
        '.editorconfig',
        '.gitignore.tpl',
        '.prettierignore',
        '.prettierrc',
        'README.md',
        'settings.json',
        'verify-commit-msg.js',
      ],
      path.resolve(__dirname, '..', 'templates'),
      this.targetDir,
      {
        'index.html': 'public/index.html',
        'settings.json': '.vscode/settings.json',
        'verify-commit-msg.js': 'scripts/verify-commit-msg.js',
        '.gitignore.tpl': '.gitignore',
      }
    )
  }

  copyTemplates = (
    files: string[],
    srcDir: string,
    destDir: string,
    options?: IObj<string>
  ) => {
    const srcFiles: IObj<string> = {}
    const destFiles: IObj<string> = {}

    files.forEach((item) => {
      srcFiles[item] = path.join(srcDir, item)
      destFiles[item] = path.join(destDir, (options && options[item]) || item)
    })

    this.generator.copyFiles(srcFiles, destFiles)
  }

  // createStore() {
  //   this.generator.writeFiles(path.join(this.targetDir, 'src/common'), {
  //     'config-store.ts': this.storeConfig(),
  //     'root-reducer.ts': this.rootReducer(),
  //   })
  // }

  createPages = () => {
    const pagesDir = path.join(this.targetDir, 'src/features')
    ;['Home', 'Login'].forEach((item) => {
      this.generator.writeFiles(path.join(pagesDir, item.toLowerCase()), {
        'index.tsx': this.componentTpl(item),
      })
    })
  }

  create() {
    this.createPages()
    this.afterCreated()
  }

  afterCreated() {
    gitInit(this.targetDir)
  }
}
