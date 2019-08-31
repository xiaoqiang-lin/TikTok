const sms_generator = require('./../utils/sms_generator');
const router = require('koa-router')()
const svgCaptcha = require('svg-captcha');
const uuid = require('node-uuid');  
const jwt = require('jsonwebtoken');
const query = require('./../db')
const {secret,auth} = require('./../utils/auth')
const Email = require('./../config')
let code=''
let sms=''

router.get('/captcha', (ctx, next) => {
    let captcha = svgCaptcha.create({
        color: true,
        noise: 3,
        ignoreChars: '0o1i',
        size: 4
    });
    code = captcha.text.toLocaleLowerCase();
    ctx.type='svg';
    ctx.body=`${captcha.data}`
});

router.post('/register',async(ctx,next)=>{
	const username = ctx.request.body.username
	const password = ctx.request.body.password
	const captcha = ctx.request.body.captcha
	const qqEmail = ctx.request.body.qqEmail
	if(captcha!=code){
    code = ''
		ctx.body={err_code:0,message:'验证码不正确！'}
		return;
	}
	if(!username || !password){
		ctx.body={err_code:0,message:'用户名或密码不能为空！'}
		return;
	}
	let find_sql = `SELECT 1 FROM users WHERE username='${username}' LIMIT 1;`
	let res = await query(find_sql)
	if(res.length){
		ctx.body={err_code:0,message:'用户已存在！'}
	}else{
		const id = uuid.v1()
		let insert_sql = `INSERT INTO users(id,username,password,qqEmail,fans,follow_counts,nickname) VALUES (?,?,?,?,?,?,?);`
		res = await query(insert_sql,[id,username,password,qqEmail,0,0,username])
		ctx.body={success_code:200,message:'注册成功！'}
	}
})

router.get('/getpin',async (ctx, next) => {
    // 1. 随机产生验证码
    let mail = ctx.request.query.email
    let PIN = sms_generator.randomPIN(6);
    let options = {
      from: 'TikTok 3060717478@qq.com',
      to:mail,
      subject:'TikTok短信验证码',
      text:`欢迎使用TikTok,您的验证码是: ${PIN}`
    }
    let res = await Email.transporter.sendMail(options)
    sms = PIN;
    ctx.body={
      success_code:200,
      message:'邮件发送成功,请登录查收'
    }
});

// sms-lgin
router.post('/smslogin', async(ctx,next) => {
    // 1. 获取数据
    const qqEmail = ctx.request.body.qqEmail;
    const pin = ctx.request.body.pin;
    console.log(sms)
    console.log(qqEmail,pin)
    // // 2. 验证验证码是否正确
    if (pin != sms) {
        ctx.body={err_code: 0, message: '验证码不正确!'};
        sms = ''
        return;
    }
    // 3. 查询数据
    let sqlStr = `SELECT * FROM users WHERE qqEmail = '${qqEmail}'`;
    let res = await query(sqlStr)
    if(res[0]){
      const token = jwt.sign({
        id:res[0].id,
        username:res[0].username
      },secret,{ expiresIn: '7d' });
      res[0].password = ''
      ctx.body={success_code:200,info:'登录成功！',message:res[0],token}
    }else{
      ctx.body={err_code:200,message:'请注册后登录！'}
    }
});

router.post('/pwdlogin',async(ctx,next) => {
    // 1. 获取数据
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const captcha = ctx.request.body.captcha;
    if(captcha != code){
    	 code = ''
      	ctx.body={err_code:200,message:'验证码不正确！'}
      	return;
    }else{
      let sqlStr = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
      let res = await query(sqlStr);
      if(res[0]){
        if(password!=res[0].password){
          ctx.body = {
            err_code: 0, message: '密码不正确!'
            };
          }
        else{
          const token = jwt.sign({
            id:res[0].id,
            username:res[0].username
            },secret,{ expiresIn: '7d' });
          res[0].password = ''
          ctx.body={success_code:200,info:'登录成功！',message:res[0],token}
          }
        }
    }
});

router.get('/userinfo',async(ctx,next) => {
    // 1.0 获取参数
    let token = ctx.request.headers["authorization"];
    console.log(token)
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
    let res = await query(`SELECT * FROM users WHERE id = '${payload.id}'`)
    delete res[0].password
    ctx.body={
      success_code:200,
      message:res[0]
    }
});
module.exports = router
