---
title: 'React中合成事件this的指向和事件对象'
date: 2023-03-13 15:10:15
tags:
- 'react'
categories:
- 'react'
---
### 合成事件this指向问题
基于React内部的处理，如我我们给合成事件绑定一个普通函数，当事件行为触发，绑定的函数执行；方法中的this会是undefined，解决方案：this->实例
  + 我们可以基于JS在的bind方法预先处理函数中this和实参
  + 我们可以将绑定的函数设置为箭头函数，让其使用上下文中的this 也就是实例

  ```js
  import React from "react"
  class Demo extends React.Component {
    handle() { // Demo.prototype => Demo.prototype.handle = function handle() {}
      console.log(this); // undefined
    }
    handle2(x,y) {
      console.log(this); // this->实例
      console.log(x,y); // 10, 20
    }
    const handle3 = ()=>{
      console.log(this) // this->实例
    }
    render() {
      return <div>
        <button onClick={this.handle}></button>
        <button onClick={this.handle2.bind(this, 10, 20)}></button>
        <button onClick={this.handle3}></button>
      </div>
    }
  }
  ```
### 合成事件对象SyntheticBaseEven
  合成事件对象SyntheticBaseEvent：我们在react合成事件触发的时候，可以获取到事件对象，只不过该事件对象是react内部特殊处理，把各个浏览器的事件对象统一化后，构建的一个事件对象
  
  合成事件对象中，也包含浏览器内置事件对象的一些属性和方法
  + clientX/clientY
  + pageX/pageY
  + preventDefault
  + stopPropagation
  + nativeEvent 可以获取浏览器内置的事件对象

```js
import React from "react"
  class Demo extends React.Component {
    handle= (ev)=> { 
      console.log(ev); 
    }

    render() {
      return <div>
        <button onClick={this.handle}></button>
      </div>
    }
  }
```