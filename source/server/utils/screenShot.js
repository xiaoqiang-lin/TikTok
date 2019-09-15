const fs = require('fs')
const child_process = require('child_process')

class FFMpeg{

}


function screeShot(executor,input,output){
  try{
    child_process.exec(`${executor} -ss 00:00:01 -y -i ${input} -vframes 1 ${output}`,{cwd:'D:\\Applications\\ffmpeg\\bin'},function(error,stdout,stderr){
      console.log(error)
      if(error){
        throw 'something was wrong...'
      }
    }).on('exit',function(code){
      console.log(code)
    })
  }catch{
    throw 'unexpected exceptions happened...'
  }

}
screeShot('ffmpeg.exe','pumpkin.mp4','test.jpg')


const fs = require('fs')
const child_process = require('child_process')

class FFMpeg {
  
}


function screeShot(executor, input, output) {
  try {
    child_process.exec(`${executor} -ss 00:00:01 -y -i ${input} -vframes 1 ${output}`, { cwd: 'D:\\Applications\\ffmpeg\\bin' }, function (error, stdout, stderr) {
      console.log(error)
      if (error) {
        throw 'something was wrong...'
      }
    }).on('exit', function (code) {
      console.log(code)
    })
  } catch{
    throw 'unexpected exceptions happened...'
  }

}
screeShot('ffmpeg.exe', 'pumpkin.mp4', 'test.jpg')

function getVideo(executor,input){
  try{
    child_process.exec(`${executor}`)
  }catch{

  }
}

merge(executor, inputVideo, inputAudio, output){
  if (fs.stat('output', function (err, stats) {
    if (stats.isFile()) {
      fs.unlink(output)
    }
    try {
      child_process.exec(`${executor} -i ${inputVideo} -i ${inputAudio} -t 14 -y ${output}`, { cwd: 'D:\\Applications\\ffmpeg\\bin' }, function (error, stdout, stderr) {
        if (error) {
          throw 'something was wrong...'
        }
      }).on('exit', function (code) {
        console.log(code)
      })
    } catch{
      throw 'unexpected exceptions happened...'
    }
  }))
}


ffmpeg -i pumpkin.mp4 -i pure_music.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 outputto.mp4

ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width,duration pumpkin.mp4