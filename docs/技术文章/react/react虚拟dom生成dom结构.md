<!--
 * @Description: 
 * @Version: 3.0
 * @Author: ganyanping
 * @Date: 2023-04-07 10:40:52
 * @LastEditors: ganyanping
 * @LastEditTime: 2023-04-07 10:42:20
-->
```js
    // jsx通过babel进行编译，createElement方法创建
    // createElement创建虚拟DOM
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
    // render渲染真的dom结构
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