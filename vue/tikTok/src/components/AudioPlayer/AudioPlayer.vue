<template>
  <div class="audio_player">
      <h6 v-text="audio.author" class="song_name"></h6>
      <span v-text="audio.name" class="song_author"></span>
      <span class="song_duration">{{duration | formatTime}}</span>
  </div>
</template>

<script>
import {Image} from 'vant'
export default {
  name:'AudioPlayer',
  data(){
    return {
      player:null,
      duration:"00:00"
    }
  },
  components:{
     [Image.name]: Image,
  },
  created(){
    this.player = new Audio()
    this.player.src = this.audio.path;
    this.player.addEventListener('loadedmetadata',()=>{
       this.duration = ~~this.player.duration
    })
  },
  filters:{
    formatTime(seconds){
      let min = ~~(seconds / 60)
      let sec = seconds % 60
      return `0${~~(seconds / 60)}:${sec>10?sec:'0'+sec}`
    }
  },
  props:['audio'],
}

</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
.audio_player{
  width 40%
  height 80px
  display flex
  flex-direction column
  justify-content space-around
  align-items space-between
}
.song_name{
  font-size 20px;
  color:#a6c0f1;
  letter-spacing 1px
  font-weight 500px
}
.song_author{
  font-size 18px
  font-weight 500px
  color:#4facfe
}
.song_duration{
  font-size 16px
  font-weight lighten
  color #cd9cf2
}
</style>