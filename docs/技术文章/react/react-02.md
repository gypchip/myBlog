---
title: 'React中setState'
date: 2022-03-01 12:44:15
tags:
- 'react'
categories:
- 'react'
---
## setState基本用法
this.setState([partialState],[callback])

`[partialState]`：支持部分状态更改
`this.setState({x: 100})` // 不论总共有多少状态，我们只修改了x，其余的状态不变

`[callback]`：在状态更改/视图更新完毕后触发执行，也可以说只要执行了steState，callback一定会执行。

+ 发生在componentDidUpdate周期函数之后，DidUpdate会在任何状态更改后都执行；而回调函数方式，可以在指定状态更新后处理一些事情
+ 特殊：即便我们基于shouldComponentUpdate阻止了状态/视图的更新，DidUpdate周期函数肯定不会执行了，但是我们设置的这个callback回调函数依然会被执行。

```js
class Demo extends React.Component {
  state = {
    x: 10,
    y: 5,
    z:0
  }
  handleClick = ()=> {
    // this-> 实例
    let {x, y, z} = this.state
    // 同时修改3个状态值，只会触发一次视图更新
    this.setState = {
      x: x+1,
      y: y+1,
      z: z+1
    }
    this.setState({x: x+1});
    this.setState({y: y+1});
    this.setState({z: z+1});
  }
  render() {
    let {x, y, z} = this.state
    return (
      <div>
        {x} - {y} - {z}
        <button onClick={this.handleClick}>
          按钮
        </button>
      </div>
    )
  }
}
```
## setState异步执行
在React18中setState在任何地方执行，都是异步操作。例如：合成事件、周期函数、定时器
+ React18中有一套更新队列的机制
+ 基于异步操作，实现状态批处理
+ 减少视图更新的次数，降低渲染消耗的性能
+ 让更新的逻辑流程更新清晰稳健

```js
class Demo extends React.Component {
  state = {
    x: 10,
    y: 5,
    z:0
  }
  handleClick = ()=> {
    //箭头函数 this-> 实例
    let {x, y, z} = this.state
    // 只会触发一次视图更新
    this.setState({x: x+1});
    console.log(this.state.x)  // 10
    this.setState({y: y+1});
    console.log(this.state.y)  // 5
    this.setState({z: z+1});
    console.log(this.state.z)  // 0

    // 同步任务不执行定时器
    // 当定时器执行，setState就是异步，再次渲染一次视图更新
    setTimeout(()=>{
      this.setState({z: z+1})
      console.log(this.state.z)  // 1 第一次更新队列之后z已经+1了
    })
  }
  render() {
    let {x, y, z} = this.state
    return (
      <div>
        {x} - {y} - {z}
        <button onClick={this.handleClick}>
          按钮
        </button>
      </div>
    )
  }
}
```
当在handleClick函数中遇到setState，不会立即更新状态和视图，而是加入到更新队列中，代码至上而下的执行，只会对当前上下文的同步代码进行处理，当上下文中的代码都处理完后，会让更新队列的任务统一批处理一次，统一渲染一次