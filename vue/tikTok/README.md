# `TikTok`

## 一、准备

### 项目初始化

 1. 创建项目

    `npm init webpack tiktok`

    `cd tiktok`

    `npm install`

    `npm run dev`

2. 测试成功之后，删除项目根目录下的`src`文件夹，重新定义目录结构

   ```bash
   src
   ---api 后台数据接口
   —--assets  通用静态资源
   ---components 非路由组件
   ---filter 自定义过滤器
   ---router 路由
   ---pages 路由组件
   ---store vuex数据仓库
   ---App.vue 应用组件
   ---main.js 项目入口文件
   ```

   3.重新编写`App.vue`和`main.js`

**`App.vue`**

```javascript
<template>
  <div id="app">
  </div>
</template>
<style scoped lang="stylus" ref="stylesheet/stylus">
  #app
    width 100%
    height 100%
    position relative
</style>

```

**`main.js`**

```js
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
```

4.安装`stylus`预编译器

`npm i stylus stylus-loader --save-dev`

5.初始化样式

引入外部的`reset.css`

6.移动端配置

* 禁止用户缩放

  在`index.html`文件中加入

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  ```

* 引入`fastclick`解决`300ms`点击延迟

  ```javascript
  <script src="static/js/fastclick.js"></script>
  <script>
        if ('addEventListener' in document) {
          document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
          }, false);
        }
  </script>
  ```

### 使用自定义字体图标

​	在`iconfont.cn`准备好所需要的字体图标后，在项目中引入。

​	**注意**：***要修改`iconfont.css`里面的路径***

​	在`main.js`中引入

```bash
Resource interpreted as Stylesheet but transferred with MIME type text/html: "http://localhost:8080/src/common/css/iconfont.css".
```



```import '/src/common/css/iconfont.css' ```


## 搭建`koa2`服务器
1. 生成项目
    `koa2 server`
    `cd server`
    `npm install`
    `npm start` <--- 测试是否成功
2. 创建数据库，设计表
3. 封装对`mysql`的`crud`操作
```javascript

```
4.在`koa2`中使用`token`进行身份验证


5. 小技巧
**每次修改后端代码都需要重新启动服务器，太过麻烦**
```bash
npm install --save-dev nodemon
```
修改`package.json`文件
```json
"scripts": {
    "start": "nodemon ./bin/www"
  },
```
数据库用户`id`设计
## 三、登录注册页面开发
### 页面`UI`
  项目使用`vue-router`进行路由管理。
  `UI`页面效果如图
![](https://ws1.sinaimg.cn/large/006AJU2Sly1g50wj59tfjg308g0f0jvm.gif)



图中验证码没有正常显示，是因为链接是无效的，接下来，需要配置后端接口，生成验证码，完善登录`ui`页面。

####后台接口设计
 * 请求验证码是一个`get`请求,接口地址`/captcha`
 * 使用第三方中间件生成`svg`验证码
  * 安装` npm install --save svg-captcha`
  * 使用时，注意需要指定`ctx.type='svg'`
####跨域问题处理
![20190716130826.png](https://i.loli.net/2019/07/16/5d2d5bd4cf01f81779.png)

在这里，通过服务端配置解决跨域问题。
1. 安装相关依赖
`npm install koa2-cors`
2. 在项目中使用`cors`
编写`app.js`，加入以下内容
```js
const cors = require('koa2-cors') // 引入
app.use(cors({ // 注意顺序问题
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  accessControlAllowCredentials:true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
```
###`UI`完善后效果
![](https://ws1.sinaimg.cn/large/006AJU2Sly1g51m5olfzzg308g0f0dhs.gif)
####总结
src
unkown column
###注册流程逻辑
1. 

```bash
xhr.js?363a:172 GET http://127.0.0.1:3000/getpin/15731213131 401 (Unauthorized)
```

![20190717155215.png](https://i.loli.net/2019/07/17/5d2ed3bbd922b80761.png)

koa multer上传图片

```bash
server error Error: Multipart: Boundary not found
```

递归算法设计原则

1. 求解最基本问题（一般直接return）

2. 缩小问题规模

   注重递归函数本身的宏观语义，设计递归函数时可以将其假设为非递归函数，将其理解为子过程。