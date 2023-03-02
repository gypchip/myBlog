---
title: 'React函数组件和类组件'
date: 2022-03-01 12:44:15
tags:
- 'react'
categories:
- 'react'
---

在react创建组件的形式有三种
+ 纯函数定义无状态组件
+ React.createClass定义组件
+ Extends React.Component定义的组件

今天我们要聊的是纯函数式定义无状态组件以及类组件的到底有什么不同，分别在什么场景下适合使用

首先我们来看一下用上述方法如何创建一个组件

**Extends React.Component定义的组件**

React.Component是以ES6的形式来创建react的组件的，是React目前极为推荐的创建有状态组件方式，最终会取代React.createClass形式
```js
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.initValue || '请输入'
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      text: event.target.value
    })
  }
  render() {
    return (
      <div>
        <input value={this.state.text} onChange={this.handleChange}>
      </div>
    )
  }
}
Demo.propTypes = {
  initValue: React.PropTypes.string
}
```
**纯函数式定义的无状态组件**

纯函数组件的特点：
+ 组件不会被实例化，整体渲染性能得到提升
+ 组件不能访问this对象
+ 组件无法访问生命周期的方法
+ 无状态组件只能访问输入的props，无副作用
```js
function DemoComponent(props) {
  return <div>Hello {props.name}</div>
}

ReactDOM.reander(<DemoComponent name="阿甘">, mountNode)

```
**使用场景**

以类形式创建的组件不用多说，该怎么用还怎么用，这里说一说纯函数组件，纯函数组件被鼓励在大型项目中尽可能以简单的写法来分割庞大的组件，未来React也会这种面向无状态组件在譬如无意义的检查和内存分配领域进行一系列优化，所以只要有可能，尽量使用无状态组件。