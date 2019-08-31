module.exports = function handleBase64(ctx,user_id,dir){
	let bitmap = ctx.request.body.content.split(',')[1].slice(0,-2)
	const extend_name = ctx.request.body.name.slice(-4)
    let index = bitmap.lastIndexOf('=')
    if(index!==-1){
        index = bitmap.charAt(index-1)==='#'?-2:-1
        bitmap = bitmap.slice(0,index)
    }
    let date = new Date()
    let timeStamp = date.valueOf()
    const relative_path = `${dir}${user_id}${timeStamp}${extend_name}`
    const url = relative_path.replace(/\.\/public/g,'http://127.0.0.1:3000')
    const buffer = Buffer.from(bitmap, 'base64')
    return {relative_path,url,buffer}
}