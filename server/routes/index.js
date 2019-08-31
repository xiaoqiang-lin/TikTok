const router = require('koa-router')()
const fs = require('fs')
const jwt = require('jsonwebtoken');
const query = require('./../db')
const uuid = require('node-uuid');  
const {spawn} = require('child_process')
const path  = require('path')


const {secret,auth} = require('./../utils/auth')
const formatTime = require('./../utils/formatTime')
const handleBase64 = require('./../utils/base64_handler')


router.post('/uploadAvatar', async (ctx,next) => {
    let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
    const user_id = payload.id;
    const {relative_path,url,buffer} = handleBase64(ctx,user_id,'./public/images/usersAvatar/')
    await fs.writeFile(relative_path,buffer,async function(err){
      if(err){
        ctx.body = {message:err}
        return;
      }else{
        let sqlStr = `UPDATE users SET avatar=? WHERE id ='${user_id}'`
        let res = await query(sqlStr,[url])
      }
    })
    ctx.body = {success_code:200,
      message: url
    }
})

router.post('/uploadVideo', async (ctx, next) => {
   let token = ctx.request.headers["authorization"];
   let payload;
   try{
        payload = await auth(token)
      }catch(e){
        throw 'failed to auth the identify...'
   }
  const user_id = payload.id;
  const {relative_path,url,buffer} = handleBase64(ctx,user_id,'./public/videos/')
  const bgm_id = ctx.request.body.bgmId
  const desc = ctx.request.body.desc
  let sqlStr = `SELECT path FROM bgm WHERE id ='${bgm_id}'`
  let res = await query(sqlStr)
  console.log(res[0].path)
  const audio_path = path.resolve(res[0].path.replace(/http:\/\/127\.0\.0\.1:3000/g,'./public'))
  // const audio_path = path.resolve(res[0].path.replace(/\.\/public/g,'http://127.0.0.1'))
  if(!res.length){
      ctx.body = {
        err_code: 0,
        message: 'bgm不存在...'
       }
  }
  else{
    await fs.writeFile(relative_path, buffer, async function (err) {
      if (err) {
        ctx.body = { message: err }
      } else {
        const id = uuid.v1()
        const video_path = path.resolve(relative_path)
        const cp1 = spawn(`ffprobe.exe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width,duration  ${video_path}`, {cwd: 'D:\\Applications\\ffmpeg\\bin',shell:true,stdout:'inherit' })
        cp1.stdout.setEncoding('utf8')
        cp1.stdout.on('data',(chunk)=>{
          let data = chunk.toString()
          let arr = data.match(/=(.*)/g)
          const width = ~~(arr[0].replace(/=/g, ''))
          const height = ~~(arr[1].replace(/=/g, ''))
          arr[2].split('=')[1].match(/\"([^\"]*)\"/g)
          const duration = ~~(RegExp.$1)
          let new_video_path = video_path.replace(/videos/g,'tiktok')
          let video_cover_path = video_path.split('.')[0].replace(/videos\\/g,'images\\videoCovers\\') +'.jpg'
          spawn(`ffmpeg.exe -i ${video_path} -i ${audio_path} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 -t ${duration} -y ${new_video_path}`,{cwd: 'D:\\Applications\\ffmpeg\\bin',shell:true})
          spawn(`ffmpeg.exe -ss 00:00:01 -y -i ${video_path} -vframes 1 ${video_cover_path}`,{cwd: 'D:\\Applications\\ffmpeg\\bin',shell:true})
          sqlStr = `INSERT INTO videos(id,user_id,audio_id,video_desc,video_path,video_seconds,video_width,video_height,cover_path)
           values(?,?,?,?,?,?,?,?,?)`
           new_video_path = new_video_path.replace(/E:\\TikTok\\server\\public\\/g,'http://127.0.0.1:3000/')
           video_cover_path = video_cover_path.replace(/E:\\TikTok\\server\\public\\/g,'http://127.0.0.1:3000/')
          query(sqlStr,[id,user_id,bgm_id,desc,new_video_path,duration,width,height,video_cover_path])
        })
      }
    })
    ctx.body = {
          success_code: 200,
          message: url
    }
  }
})
router.get('/bgmList',async(ctx,next)=>{
  // 获取用户上传
  let sqlStr = 'SELECT * FROM bgm'
  let res = await query(sqlStr)
  if(res.length){
    ctx.body = {success_code:200,
      message: res
    }
  }else{
    ctx.body = {success_code:200,
      message: '暂时还没有背景音乐哦...'
    }
  }
})

router.get('/videoList',async(ctx,next)=>{
  let res = await query('SELECT v.*,u.avatar AS avatar,u.nickname AS nickname,count(comment) AS comment_counts FROM  (videos v LEFT JOIN users u ON u.id = user_id) LEFT JOIN comments c ON c.video_id=v.id GROUP BY v.id ORDER BY v.create_time DESC')
  console.log(res)
  if(res.length){
    ctx.body = {success_code:200,
      message: res
    }
  }else{
    ctx.body = {success_code:200,
      info:'暂时还没有视频哦',
      message: [],
    }
  }
})

router.post('/videoLike',async(ctx,next)=>{
  let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
  const user_id = payload.id;
  const video_author_id = ctx.request.body.user_id;
  const video_id = ctx.request.body.video_id;
  let sqlStr = `SELECT * from users_like_videos WHERE user_id ='${user_id}' and video_id='${video_id}'`
  let res = await query(sqlStr) 
  if(!res.length){//未点赞过
    const id = uuid.v1()//添加到记录
    await query(`INSERT INTO users_like_videos(id,user_id,video_id) values(?,?,?)` ,[id,user_id,video_id])
    await query(`UPDATE videos SET like_counts =like_counts+1 WHERE id = '${video_id}'`)
    await query(`UPDATE users SET receive_like_counts=receive_like_counts+1 WHERE id = '${video_author_id}'`)
  }else{
    await query(`DELETE FROM users_like_videos WHERE user_id = '${user_id}'`)
    await query(`UPDATE videos SET like_counts =like_counts-1 WHERE id = '${video_id}'`)
    await query(`UPDATE users SET receive_like_counts=receive_like_counts-1 WHERE id = '${video_author_id}'`)
  }
  ctx.body={
    message:'操作成功'
  }
})

router.post('/followMe',async(ctx,next)=>{
  let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
  const fan_id = payload.id;
  const user_id = ctx.request.body.user_id;
  let sqlStr = `SELECT * from users_fans WHERE fan_id ='${fan_id}' and user_id='${user_id}'`
  let res = await query(sqlStr) 
  if(!res.length){//未关注过
    const id = uuid.v1()//添加到记录
    await query(`INSERT INTO users_fans(id,user_id,fan_id) values(?,?,?)` ,[id,user_id,fan_id])
    await query(`UPDATE users SET follow_counts = follow_counts+1 WHERE id = '${fan_id}'`)
    await query( `UPDATE users SET fans=fans+1 WHERE id = '${user_id}'`)
  }else{
    await query(`DELETE FROM users_fans WHERE user_id = '${user_id}'`)
    await query(`UPDATE users SET follow_counts = follow_counts-1 WHERE id = '${fan_id}'`)
    await query(`UPDATE users SET fans=fans-1 WHERE id = '${user_id}'`)
  }
  ctx.body={
    message:'操作成功'
  }
})
router.post('/saveComment',async(ctx,next)=>{
  let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
  const from_user_id = payload.id;
  const to_user_id = ctx.request.body.to_user_id;
  const video_id = ctx.request.body.video_id;
  const comment = ctx.request.body.comment;
  const father_comment_id = ctx.request.body.father_comment_id;

  const id = uuid.v1()
  let res = await query(`INSERT INTO comments(id,father_comment_id,to_user_id,video_id,from_user_id,comment) values(?,?,?,?,?,?)`,[id,father_comment_id,to_user_id,video_id,from_user_id,comment])
  ctx.body={
    success_code:200,
    message:'操作成功'
  }
})

router.post('/commentLike',async(ctx,next)=>{
  const comment_id = ctx.request.body.comment_id;
  const flag = ctx.request.body.flag;
  let res;
  if(flag){ //点赞
    res = await query(`UPDATE comments SET  has_like =1,like_counts=like_counts+1 WHERE id = '${comment_id}'`) 
  }else{
    res = await query(`UPDATE comments SET  has_like =0,like_counts=like_counts-1 WHERE id = '${comment_id}'`) 
  }
  ctx.body={
    message:'操作成功'
  }
})


router.get('/commentList',async(ctx,next)=>{
  // 获取用户上传
  const video_id = ctx.query.video_id
  let arr = await query(`SELECT c.*,u.avatar AS avatar,u.nickname AS nickname FROM comments c LEFT JOIN users u ON c.from_user_id = u.id WHERE c.video_id = '${video_id}' ORDER BY c.create_time DESC`)
  arr.forEach((item)=>{
    item.create_time = formatTime(new Date(item.create_time))
  })
  let parent_comments = arr.filter((item)=>item.father_comment_id==false)
  let child_comments = arr.filter((item)=>item.father_comment_id!=false)
  console.log(child_comments)
  parent_comments.forEach((item)=>{
    item.child_comments = child_comments.filter((item2)=>item2.father_comment_id === item.id)
  })
  ctx.body = {success_code:200, message: parent_comments}
})


router.get('/worksList',async(ctx,next)=>{
  // 获取用户上传
  let user_id;
  let fan_id;
  if(ctx.query.who==='others'){
    user_id = ctx.query.id
  }else{
    let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
      user_id = payload.id;
      fan_id = payload.id;
    }catch(e){
      throw 'failed to auth the identify...'
    }
  }
  let res0 = await query(`SELECT nickname,avatar,fans,follow_counts,receive_like_counts FROM users WHERE id='${user_id}'`)
  let res1 = await query(`SELECT id,video_desc,video_path,cover_path,like_counts FROM videos WHERE user_id='${user_id}'`)
  let res2 = await query(`SELECT id FROM users_fans WHERE user_id = '${ctx.query.id}' AND fan_id='${fan_id}' LIMIT 1`)
  let hasFollow = res2.length?true:false;
  ctx.body = {success_code:200, message: {
    nickname:res0[0].nickname,
    avatar:res0[0].avatar,
    fas:res0[0].fans,
    follow_counts:res0[0].follow_counts,
    receive_like_counts:res0[0].receive_like_counts,
    worksList:res1,
    hasFollow
  }}
})

router.get('/favorVideosList',async(ctx,next)=>{
  let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
  const user_id = payload.id;
  let res = await query(`SELECT v.id,like_counts,video_path,cover_path FROM users_like_videos ulv LEFT JOIN videos v ON ulv.video_id=v.id WHERE ulv.user_id='${user_id}'`)
  ctx.body = {
    success_code:200,
    message:res
  }
})

router.get('/favorUsersList',async(ctx,next)=>{
  let token = ctx.request.headers["authorization"];
    let payload;
    try{
      payload = await auth(token)
    }catch(e){
      throw 'failed to auth the identify...'
    }
  const user_id = payload.id;
  let res = await query(`SELECT u.id AS id,u.nickname AS nickname,u.avatar FROM users_fans uf LEFT JOIN users u ON uf.user_id=u.id WHERE uf.fan_id='${user_id}'`)
  console.log(res)
  ctx.body = {
    success_code:200,
    message:res
  }
})

module.exports = router
 
