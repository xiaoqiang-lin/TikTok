const nodemailer = require('nodemailer')

const Email = {
	config:{
		host:'smtp.qq.com',
		port:587,
		auth:{
			user:'3060717478@qq.com',
			pass:'xyohfzrjmkzxdecd'
		}
	},
	get transporter(){
		return nodemailer.createTransport(this.config)
	}	
};

module.exports = Email