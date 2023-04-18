---
title: 'React基础学习'
date: 2023-03-13 15:10:15
tags:
- 'react'
categories:
- 'react'
---

### react 脚手架创建项目
```shell
npm install -g create-react-app
create-react-app myreact
```
暴露webpack配置文件
```shell
npm run eject
```
### JSX构建视图基础知识
JS表达式：有执行结果的算js表达式
+ 变量
+ 判断： 三元运算符
+ 循环： map
1. 在HTML中嵌入JS表达式，需要基于{}胡子语法
2. 在`ReactDom.createRoot`的时候，不能直接把HTML/Body作为容器，需要指定一个额外的盒子例如：`#root`
3. 每个构建的视图，只能有一个根节点
  + 出现多个根节点，则报错
  + React中提供一个特殊的节点（标签）:`<></>`,`React.Fragment`(空文档标记标签)，既保证可以只有一个根节点，又不会新增一个`HTML`层级结构。
4. 给元素设置样式
  + 行内样式： `{{`color: red, fontSize: 18px`}}`
  + 设置样式类名: className
### JSX底层处理机制
  第一步：把我们编写的`jsx`语法，编译为虚拟DOM对象【virtual DOM】虚拟DOM对象：框架自己内部构建的一套对象体系（对象的相关成员都是React内部规定的），基于这些属性描述出，我们所构建的视图中的，DOM节点的相关特征。
  1. 基于babel-preset-react-app把`jsx`编译为React.
  createElement(
    ele, // 元素
    props,
    ...child
  )
  + ele:元素的标签名或组件
  + props： 元素的属性集合，是一个对象
  + children：第三个及以后参数，都是当前元素的子节点
  2. 再把React.createElement方法执行，得到virtualDOM对象
  ```js
  virtualDOM = {
    $$typeof: Symbol(react.element),
    key: null,
    type: 标签名(或组件),
    ref: null,
    props: {
      className:元素相关属性，
      style: {},
      children: 子节点信息，如果没有子节点则没有这个属性、属性值可能是一个值或数组
    },
  }
  ```

  第二步：把构建的虚拟DOM渲染为真实DOM。真实DOM浏览器页面中，最后渲染出来，让用户看见的DOM 元素。

  基于ReactDOM中的render方法处理
    
```js
    function createElement(ele, props, ...children) {
      console.log(typeof children)
      console.log(children.length)
      let virtualDOM = {
        $$typeof: Symbol('react.element'),
        key: null,
        ref: null,
        props: {},
        type: null
      }
      
      let len = children.length
      virtualDOM.type = ele;
      if (props) {
        virtualDOM.props = {
          ...props
        }
      }
      if (len === 1) {virtualDOM.props.children = children[0]}
      if (len > 1) {virtualDOM.props.children = children}
      return virtualDOM
    }
  
    function each(obj, callback){
      if (typeof obj === null || typeof obj !== 'object') throw Error(`${obj} is not a object`);
      if (typeof callback !== "function") throw Error('callback is not a funciton');
      let keys = Reflect.ownKeys(obj)
      keys.forEach((key)=> {
        let value = obj[key]
        callback(value, key)
      })
    } 
    function render(virtualDOM, container) {
      let { type, props} = virtualDOM
      if (typeof type === 'string') {
        // 存储的是标签名：动态创建这样一个标签
        let ele = document.createElement(type);
        // 为标签设置相关的属性，子节点
        each(props, (value, key)=>{
          // className处理
          if (key === 'className') {
            ele.className = value
            return;
          }
          // style处理
          if (key === 'style') {
            each(value, (val,attr)=>{
              ele.style[attr] = val
            })
            return
          }
          // children处理
          if (key === 'children') {
            let children = value;
            if (!Array.isArray(children)) children = [children];
            children.forEach(child => {
              // 子节点是文本节点：直接插入
              if (typeof child === 'string') {
                ele.appendChild(document.createTextNode(child))
                return;
              }
              // 子节点不是文本节点，virtualDOM递归处理
              render(child,ele)
            })
            return;
          }
          ele.setAttribute(key, value)
        })
        // 把新增的标签，增加到指定的容器
        container.appendChild(ele)
      }
      
    }
    let root = document.getElementById('app')
    render(createElement(
        'div',
        null,
        createElement('div',{className: 'box', style: {color: 'red'}}, '3333'),
        createElement('span',null, '222')
      ),root)
```
  补充说明：第一次渲染页面是从virtualDOM->真实DOM；但是后期视图更新是经过DOM-DIFF的对比，计算出补丁包（两次视图差异的部分），把补丁包进行渲染！！


### 函数组件底层处理机制
函数组件

在src目录中，创建一个`xxx.jsx`的文件，就是要创建一个组件，在此文件中，创建一个函数，让函数返回`JSX`视图。

1. 渲染机制：
 + 基于babel-preset-react-app调用的组件转换为createElement格式
 + 把createElement方法执行，创建出一个virtualDOM对象
 + 基于root.render把virtualDOM变为真实的DOM
  + type是一个函数，此时把函数执行，DemoOne()
  + 把virtualDOM中的props，作为实参传递给函数DemoOne(props)
  + 接受函数执行的返回结果，当前组件的virtualDOM
  + 最后基于render把组件返回的虚拟DOM 变为真实DOM，插入到id=root的容器中
2. 属性props的处理
+ 调用组件，传递进来的属性是只读的，（原理：porps对象被冻结了）
  获取: props.xxx；
  修改: props.xxx = 'sss'；  // 报错
+ 虽然对于传递进来的属性，我们不能直接修改，但是可以做一些规则校验
  + 设置默认值
  函数组件.defaultProps = {
    x: 0,
    ......
  }
  + 设置规则： 依赖与插件（prop-types）
  import PropTypes from 'prop-types';
  函数组件.propTypes = {
    title: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.oneOfType(
      PropTypes.number,
      PropTypes.bool
    )
  }
  传递进来的属性，首先会经历校验，不管校验成功或者失败，都会把属性给props，只不过不符合规则，控制台会报错，但是不影响使用。


补充知识：
  + 冻结 Object.freeze(obj)
    检测是否冻结：Object.isFrozen()
    + 被冻结的对象，不能做Object.defineProperty做数据劫持，新增，修改
  + 密封
    密封对象：Object.seal(obj)
    检测是否被密封：Object.isSealed(obj)
    + 被密封的对象：可以修改成员的值，但不能删除，不能新增，不能劫持
  + 扩展
    把对象设置为不可扩展：Object.preventExtensions()
    检视是否可扩展: Object.isExtensible(obj)
    +被设置的对象，除了不能新增成员，其余的都可以操作处理
