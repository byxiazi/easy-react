# @react-mvc/model-controller

> model-controller 集成了`react-mvc`框架中的model层和controller层，该包提供了一个体验更好的
状态管理

## Installation

    $ npm install @react-mvc/model-controller

## Usage

### controller

controller是一个提供控制器功能的函数，接收一个配置对象，其返回值是一个高阶函数，该函数需要传入`react`组件

```
import controller from '@react-mvc/model-controller'

controller(config)(<ReactComponent />)
```

### config

config对象拥有强大的配置项.

| key | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| namespace | 命名空间用于区分不同的容器组件，必须为唯一值 | string | - |
| publishers | 需要订阅的其他命名空间，通过订阅，可以拿到其他命名空间的状态 | string[] | - |
| initState | 初始状态 | any | - |
| reducer | 用户自定义函数，其返回值作为命名空间的状态 | (oldState: any, newState: any) => any | - |
| cacheOpts |  缓存选项 | CacheOpts | - |
| reset | 重置命名空间状态为初始状态，用于开发调试 | boolean | false |

```
interface CacheOpts {
  cache: 'sessionStorage' | 'localStorage'
  expired?: number
}

cache：缓存类型
expired：缓存过期时间
```