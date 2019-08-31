<template>
  <div class="sms-mode">
    <form action="">
        <div class="input-wrapper">
          <input type="tel" maxlength="30" placeholder="输入QQ邮箱" v-model="qqEmail">
          <button v-show="!countdown" class="pin-btn" :class="{validBtn: validEmail}" @click.prevent="getCode()">获取验证码</button>
          <button disabled="disabled" class="pin-btn" v-show="countdown"> 已发送({{countdown}}s)</button>
        </div>
        <div class="input-wrapper">
          <input type="text" placeholder="输入验证码" v-model="pin">
        </div>
    </form>
  </div>
</template>

<script>
import {getPIN} from '@/api/login'
import {Toast} from 'vant'
export default {
  name:'SmsLogin',
  data () {
    return {
      qqEmail:'',
      pin:'',
      countdown:0
    };
  },
  computed: {
    validEmail(){
      return /^([a-zA-Z0-9_-])+@qq.com$/.test(this.qqEmail)
    },
  },
  methods: {
    async getCode(){
      if(this.validEmail){
        this.countdown=60
        this.timer = setInterval(()=>{
          this.countdown--;
          if(this.countdown === 0){
            clearInterval(this.timer);
          }
        },1000)
      let result = await getPIN(this.qqEmail);
      result=result.data;
      console.log(result)
      if(result.success_code){
        Toast({
            message: result.message,
            position: 'center',
            duration: 3000
        });
      }
      if(result.err_code==0){
        Toast({
            message: result.message,
            position: 'center',
            duration: 3000
        });
        setTimeout(()=>{
          clearInterval(this.timer);
            this.countdown = 0;
          }, 3000)
        }
      }else{
        Toast('请输入正确的qq邮箱!');
        return;
      }
    },
  }
}

</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
  .sms-mode
    width 100%
    display flex
    form
      width 100%
      .input-wrapper
        width 100%
        height 48px
        display flex
        justify-content space-between
        align-items center
        margin-top 20px
        input
          width 100%
          height 100%
          padding-left 8px
          box-sizing border-box
          border 1px solid #ddd
          border-radius 4px
          outline 0
          font 400 14px Arial
          &:focus
            border 1px solid mediumpurple
        .pin-btn
          position absolute
          right 8px
          border 0
          color #ccc
          font-size 14px
          background transparent
          &.validBtn
            color purple
</style>