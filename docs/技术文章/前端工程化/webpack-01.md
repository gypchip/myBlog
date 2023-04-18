---
title: '为什么要使用webpack'
date: 2023-3-23 12:44:15
tags:
- 'webpack'
categories:
- 'webpack'
---

# webpack

::: tip
webpack是一个现代JavaScript应用程序的静态模块打包工具。当webpack处理应用程序时，它会在内部构建一个依赖图。此依赖图会映射项目所需每个模块，并生成一个或多个bundle/包。
webpack是前端开发中，自动化和工程化的打包工具，我们借助它，可以实现自动合并压缩，实现图片base64处理
:::
## 为啥要学习webpack
前端性能优化的时候，我们可以从以下几个方面，去提高页面第一次渲染的速度，以及运行时的性能：

### 第一类： 明显改善页面第一次渲染加载的速度，减少白屏等待的时间
  1. 使用骨架屏技术
    * 服务器骨架屏： 页面首屏内容是基于服务渲染的
    * 前端骨架屏： 在真实内容渲染出来之前，我们给予相关位置用“色框”占位！
  2. 减少HTTP请求的次数和大小
    * CSS/JS都要做合并压缩，尽可能合并为一个css和一个js
    * 图片的合并压缩，例如：雪碧图
    * 使用图片BASE64来加快图片渲染
    * 图片一定要做延迟加载
    * 使用字体图片和矢量图，来代替位置
    * 音频视频资源也要设置延迟加载 preload="none"
    * 数据的异步加载
    * 开启服务器的GZIP压缩，可以让访问的资源压缩60%
  3. 渲染页面中的优化
    + 因为`<script>`会阻碍GUI渲染，所以放在页面末尾，或者设置async/defer
    + 因为`<link`>是异步加载css资源，所以建议放在页面开始，尽快获取样式资源
    + 不要使用import导入css，因为会阻碍GUI渲染
    + 样式代码较少的情况下，使用`<style>`内嵌样式，尤其是移动端开发！
  4. 在网络传输中的优化
    + 减少cookie的内容大小（因为要想服务器发送请求，不论服务器是否需要，总会在请求头中把cookie传递给服务器，如果cookie比较大，会让所有的请求都变慢）
    + 资源分服务器部署（例如： web服务器，图片服务器，数据服务器）这样可以降低服务器压力，提高服务端的并发，让资源能更加合理的被利用，但是也会导致DNS解析次数增加。
    + 基于HTTP2.0代替HTTP1.1
      + 基于新的二进制更上，让传输内容更加丰富健壮
      + header压缩，可以减少HTTP请求次数
      + 服务端推送，可以减少HTTP请求次数
      + 多路复用，让传输速度更快，避免线头阻塞
    + 基于connection:keep-alive保持TCP通道长链路
    + 开启CDN地域分布服务器部署
    + 对于静态资源文件采取强缓存和协商缓存，对于不经常更新的数据请求，设置数据缓存
### 第二类： 提高页面运行时的性能
  1. 减少循环嵌套，降低时间复杂度；避免出现死循环/死递归
  2. 使用事件委托来优化事件绑定，性能可以提高40%
  3. 减少DOM的回流和重绘
    + 样式分离读写
    + 批量新增元素，字符串拼接、文档碎片
    + 基于transform/opacity等方式操作样式
    + 把需要频繁修改样式的元素，脱离文档流
  4. 使用函数的防抖节流处理高频触发操作
  5. 合理使用闭包，避免内存泄漏，以及手动释放无用的内存
  6. 减少页面冗余代码，提高代码的重复使用率
  7. 尽可能不要使用for/in循环，因为消耗性能
  8. 避免使用eval/with等消耗性能的代码
  9. 能用css3处理的动画坚决不用JS（JS动画尽可能基于requestAnimationFrame来代替定时器）
  10. 避免使用css表达式，因为非常消耗性能
  11. css选择器前缀不要过长（css选择器渲染是从右到左）
  12. 减少table布局（table渲染是比较消耗性能的）

## webpack可以帮我们干的事情
  + 代码转换：Ts编译成js，less、scss编译成css、es6编译成es5、虚拟dom编译成真实dom
  + 文件优化：压缩js、css、html代码，压缩合并图片，突变base64等
  + 代码分割：提取多个页面的公共代码、提取首屏不需要执行的部分代码
  + 模块合并：把模块分类合并成一个文件
  + 自动刷新：创建本地web服务器，监听本地源代码的变化，自动重新构建，刷新浏览器
  + 代码校验：elint代码规范校验和检测，单元测试等
  + 自动发布：自动构建出线上发布代码，并传输给发布系统
  + 跨域处理

## 处理webpack还有
  + vite
  + gulp
  + rollup
  + Turbopack

项目比较大的时候，webpack因为底层处理机制问题，导致每次打包速度都会变慢，热启动、冷启动。比webpack好的，目前很好发展趋势，vite【rollup】，比webpack快。

## 模块规范

1. 按照功能和需求划分：普通业务模块/组件
2. 按照复用性划分： 通用业务模块/组件
3. 通用功能型组件/模块

模块化编程进化历史
  + 单例设计模式
  + AMD require js
  + CommonJS
  + CMD
  + ES6Module

### AMD
优势：在保证模块之间独立和可以相互访问的基础上，HTML中无需再导入各个模块了，不需要自己考虑模块之间的导入顺序
劣势： 

```js
// main.js
// 全局配置
require.config({
  baseUrl: './lib', // 声明后期所有模块导出，都在lib目录下找

})
require(['B', 'A'], funciton(B, A) {
  console.log(A.sum())
  console.log(B.average())
})


// A.js
// define([依赖模块], funciton(用形参接收依赖的模块) {
  // 写模块代码
  //  return {提供外部的方法导出}
// })
define(funciton(require,) {
  let name = 'A'
  const sum = funtion() {
    // .....
  }
  return {
    sum
  }
})

// B.js
define(['A'], function(A, factory) {
  'use strict'
  // A存储的就是A模块导出的方法
  let name = 'B'
  const average = function average(...params) {
    A.sum()
  }
  return {
    average
  }
})
```

### CommonJS模块规范
CommonJS中，每创建一个JS文件，就相当于创建一个模块。如果想把模块中的内容，就需要模块导出

导出模块
  module.exports = { ... }

CommonJS模块规范实现模块导入的缓存机制
导入一个模块，会把这个模块的的代码执行，获取导出的内容缓存起来，当后续遇到这个模块的导入，不会在重新执行

只支持在Node和webpack环境下运行，不支持浏览器环境
```js

// A.js
let name = "A"
const sum = function sum(){

}

module.exports = {
  sum
}

// B.js

let name = 'B';
const A = require('./A');

const average = function() {

}

// 模块导出
module.exports = average

// main.js

const A = require("./A")
console.log(A.sum())

const average = require("./B")

```

### ES6Moudle

模块导出：export 或者 export default

无论基于何种方式，模块导出永远是一个Module对象

1. 第一种方式： export
  + 一个模块中可以使用多次，分别导出多项内容
  + 导出的每一项内容，都是给Module对象设置相关成员

```js

// 不能直接导出变量/值，必须在声明的时候同时导出
export let age = 14； // Module对象.age

export function fn() {};

export const obj = {};

// 可以导出一个对象（代码块），包含多个需要导出内容
export {
  name, // 正确语法：前提name存在，把name赋值给module对象
  // x: 10,  // 报错：不能直接用键值对方式
}
```

2. 第二种方式： export default
  + 一个模块只能用一次
  + Module对象设置default的成员，成员值是导出内容

```js
// 正确：导出变量，值，函数，对象
export default function() {

}
export default {
  x: 10,
  name
}

export default sum;
export default 10;

export default let age = 12 // 错误语法


// 导入
import sum './A.js'
```

3. 导入，把Module对象中每一项内容拿到

  导入模块地址： 相对地址，不能省略后缀，webpack单独处理可以省略

  + 语法一： 
    import xxx from './A.js'
      不是把Module对象整体导入，赋值给XXX，而是只拿到Module对象default属性值，换句话说基于export default xxx导出的内容，用这种方式直接导入。
  + 语法二： 
    用解构赋值的方式获取导出内容，首先不是把Module对象.default属性值进行解构赋值，而是直接给Module对象解构赋值
  ```js
    // 导出默认的
    export default sum;
    import sum from './xxx.js'

    // 导出对象
    export default {x:10, y:20}
    import {x,y} from '.xxx.js'

    // 导出默认的+导出声明的变量
    export default sum
    export let age = 10;
    import * as A from './ xxx.js'
    
  ```











