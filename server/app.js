const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koajwt = require('koa-jwt');
const koaBody = require('koa-body');
const index = require('./routes/index')
const users = require('./routes/users')
const pool = require('./db.js')


// error handler
onerror(app)

app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  accessControlAllowCredentials:true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.use(require('koa-static')(__dirname + '/public/dist'))
// middlewares

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 20*1024*1024,    // 设置上传文件大小最大限制，默认2M,
        keepExtensions:true,
        onFileBegin:(name,file)=>{
          console.log('koa-body中的方法被执行了')
        }
    }
}));
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// app.use(
//     koajwt({
//         secret
//     }).unless({
//         path: [/^\/smslogin/, /^\/pwdlogin/,/^\/register/]
//     })
// );

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
