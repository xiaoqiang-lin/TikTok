const jwt = require('jsonwebtoken');
const secret = 'TikTok'

function auth(token) {
	return new Promise((resolve,reject)=>{
		jwt.verify(token,secret,(error,decoded)=>{
			error?reject(error):resolve(decoded)
		})
	})
}
module.exports = {
	secret,
	auth
}