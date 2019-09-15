const fs = require('fs')
const {spawn} = require('child_process')
function getVideoInfo(path){
  const cp1 = spawn(`ffprobe.exe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width,duration  ${path}`, { cwd: 'D:\\Applications\\ffmpeg\\bin', shell: true, stdout: 'inherit' })
    cp1.stdout.setEncoding('utf8')
    cp1.stdout.on('data', (chunk) => {
      let data = chunk.toString()
      let arr = data.match(/=(.*)/g)
      const payload = {}
      payload.width = ~~(arr[0].replace(/=/g, ''))
      payload.height = ~~(arr[1].replace(/=/g, ''))
      arr[2].split('=')[1].match(/\"([^\"]*)\"/g)
      payload.duration = ~~(RegExp.$1)
      console.log(payload)
      // process.stdout.write(JSON.stringify({
      //   payload
      // }))

  })
}

module.exports = {
  getVideoInfo
}