const mysql = require('mysql');

 // 创建数据池
const pool = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '980125',
  database : 'tiktok',
  multipleStatements: true //允许执行多条语句
});

const query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}

// pool.crud = function(retrieve='',create=[],update=[],del=''){ // 数组，第一个参数是语句，第二个参数是参数
// 	// 遍历每一个参数，并对其执行操作
// 	return new Promise((resolve,reject)=>{
// 		pool.getConnection((err,conn)=>{
// 			if(err){
// 				reject(err)
// 			}else{
// 				const args = Array.prototype.slice.call(arguments);
// 				for(let i=0;i<args.length;i++){
// 					if(args[i] instanceof Array){
// 						if(args[i].length){
// 							conn.query(args[i][0],args[i][1],(err,res,fields)=>{
// 								if(err){
// 									reject(err)
// 								}else{
// 									resolve(fields)
// 								}
// 							})
// 						}
// 					}else{
// 						if(args[i]){
// 							conn.query(args[i],(err,res,fields)=>{
// 								if(err){
// 									reject(err)
// 								}else{
// 									resolve(fields)
// 								}
// 							})
// 						}
// 					}
// 				}
// 			  conn.release()
// 			}
// 		})
// 	})
// }

module.exports = query;

