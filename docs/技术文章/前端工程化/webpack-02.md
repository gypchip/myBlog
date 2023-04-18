---
title: 'webpack使用'
date: 2023-3-23 12:44:15
tags:
- 'webpack'
categories:
- 'webpack'
---

### webpack打包的规则：
  
  webpack其实是一个平台，在平台中，我们会安装，融入，配置各种打包规则

  + mode： 打包模式：开发环境-development、生产环境-production
  + entry： 入口，webpack就是从入口开始，根据CommonJS/ES6Module模块规范，分析出模块之间的依赖，从而按照相关依赖进行打包的
  + output: 出口，
  + loader： 加载器，想编译啥代码，就需要安装对应的加载器，并且完成相关配置。
  + plugin：插件，处理：压缩、编译html、清空打包
  + resolve： 解析器
  + optimization：优化
  + DevServer： 配合webpack-dev-server本地启动，实现项目预览

学习webpack，就是学习各种打包规则和配置

webpack是基于Node.js进行打包的！！
  + 想用webpack，电脑上需要安装Node
  + webpack中，支持CommonJS模块规范，写的配置规则就是基于CommonJS规范处理的
  + webpack中，支持ES6Module模块规范
  + 而且两种规范在webpack中可以混淆使用，webpack内部做了处理。

webpack支持零配置打包：不需要自己写任何的配置规则，直接使用内置的默认的规则进行打包

  + 安装webpack
  ```npm
    npm i webpack webpack-cli
  ```
  package.json里面配置可执行脚本

  ```json
    "script" : {
      "start" : "webpack"
    }
  ```

  + 默认会找src/index.js作为打包入口,打包输出dist/main.js

  ### 自定义打包规则

  在项目根目录下，创建webpack.config.js配置自定义打包规则

  webpack.config.js

```js
/* path是Node内置路径处理模块 */
// __dirname:获取当前文件所在目录的绝对路径
// path.resolve：在某一个绝对路径基础上，基于后面的相对路径地址，获取一个全新的绝对路径

const path = require('path')

// HtmlWebpackPlugin 打包编译html的
// 打包后的JS/css自动导入到页面中
// 对html进行压缩
const HtmlWebpackPlugin =  require('html-webpack-plugin');
module.exports = {
  /* 
    设置环境模式 
      获取环境变量： process.env.NODE_EVN
      production生成环境：打包JS会自动压缩
      development开发环境：代码不会压缩、NODE_EVN = "development"
  */
  mode: 'development',

  /* 指定入口 ： 相对地址*/
  entry: './src/index.js',
  output: {
    // 设置打包后文件名字
    // [name].js表示和入口文件名称一致
    // main.[hash].js/ main.[hash:8].js 生成hash值，8位。有助于强缓存设置
    // 设置清缓存之后，如何保证服务器更新，及时本地缓存还生效，也可以从服务器获取最新资源
    // html页面坚决不能设置强缓存
    // 如果服务器有资源更新，生成新的文件名，在页面中导入新的文件
    // filename: 'main.[hash:8].js',

    filename: '[name].[hash:8].js',
    // 设置打包路径
    path: path.resolve(__dirname, './dist')
  },

  /* 使用插件 */
  plugins: [
    new HtmlWebpackPlugin({
      // 指定页面模板
      template: './public/index.html',
      // 打包后生成的名字
      filename: 'index.html',
      // 是否设置压缩
      minify: true,
      chunks: ["index","login"]
    })
  ],

}
```

多入口，多出口配置
```js
const path = require('path')
const HtmlWebpackPlugin =  require('html-webpack-plugin');

const pageArr = ['index', 'login'],
      entryObj = {},
      htmlPlugin = [];

pageArr.forEach(chunk=> {
  entryObj[chunk] = `./src/${chunk}.js`;
  htmlPlugin.push(
    new HtmlWebpackPlugin({
      // 指定页面模板
      template: `./public/${chunk}.html`,
      // 打包后生成的名字
      filename: `${chunk}.html`,
      // 是否设置压缩
      minify: true,
      chunks: [chunk]
    })
  )
})

module.exports = {
  mode: 'development',
  // 多入口 
  entry: {
    index:'./src/index.js',
    login: './src/login.js'
  },

  output: {
    filename: '[name].[hash:8].js',
    // 设置打包路径
    path: path.resolve(__dirname, './dist')
  },

  /* 使用插件 */

  plugins: [
    new HtmlWebpackPlugin({
      // 指定页面模板
      template: './public/index.html',
      // 打包后生成的名字
      filename: 'index.html',
      // 是否设置压缩
      minify: true,
      chunks: ["index","login"]
    }),
    new HtmlWebpackPlugin({
      // 指定页面模板
      template: './public/login.html',
      // 打包后生成的名字
      filename: 'login.html',
      // 是否设置压缩
      minify: true,
      // 指定导入的资源名称
      chunks: ["login"]
    }),
  ],

}
```

webpack-dev-server
  + 基于Node在客户端本地启动一个web服务，帮助开发者预发作品
  + 第一步：项目打包
  + 第二步：启动web服务器
  + 第三步：热更新，当代码修改后，会实时进行打包编译
```shell
npm i -D webpack-dev-server
```
pagekage.json
```json
 "scripts": {
    "start": "webpack serve",
 }
```
webpack.config.js配置
```js
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    open: true,  // 自动打开浏览器
    hot: true, // 开启热更新
    compress: true, // 开启服务器端的GZIP压缩
    /* 
      跨域代理配置
        "/xxx"前缀：主要就是用来区分，以什么前缀，发的请求，我们代理到哪一台服务器上 
        target: 代理的真正的服务器地址
        changeOrigin：改变请求头中origin源信息
        ws：支持websoket
    */
    proxy: {
      "/jian": {
        target: "https://www.jianshu.com/asimov", 
        pathRewite: {"^/jian": ""}, // 重写地址
      },
      "/zhi": {
        ws:true
      }
    }
  },
```

CSS样式打包配置
```js
/*loader加载器:处理顺序从下到上，从右到左*/
// 抽离css文件
const MiniCssExtractPlugin=require("mini-css-extract-plugin")
module.exports = { plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    })
  ],
  module: {
    rules: [{
      test: /\.(css|less)$/, // 基于正则匹配，哪些文件是需要处理的
      use: [
        // "style-loader", // css内嵌导入页面
        MiniCssExtractPlugin.loader, // 抽离CSS样式
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer')
              ]
            }
          }
        }, // 配合autoprefixer&browserlist 给css属性设置前缀
        "less-loader"  // 把less编译成css
      ]
    },{
      test: /\.js$/,
      use: {}
    }]
  }
}
```

基于babel实现ES6的转换

根目录下创建babel.config.js
```js
// 关于babel-loader的配置项
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
}
```

webpack.config.js
```js
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        "babel-loader"
      ]
    }]
  }
}
```





  