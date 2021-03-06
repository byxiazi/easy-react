export default class FileTpl {
  componentTpl(name: string) {
    const c = `
      import React, { Component } from 'react'
      import controller, { WrappedComponentProps } from '@react-mvc/model-controller'

      class ${name} extends Component<WrappedComponentProps, any> {
        render() {
          return (
            <div className="${name.toLowerCase()}" >
              ${name} page
            </div>
          )
        }
      }

      export default controller({
        namespace: "${name.toLowerCase()}",
      })(${name})
    `
    return c.replace(/^ {6}/gm, '').trim()
  }
}
