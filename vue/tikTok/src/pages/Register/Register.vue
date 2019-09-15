<template>
  <div class="register-container">
    <header class="head">
      <img src="./../../assets/images/logo.png" alt="logo" class="logo">
      <div class="title">
        <h4>用户注册</h4>
      </div>
    </header>
    <section class="register-form-wrapper">
      <form action="">
          <div class="input-wrapper">
            <input type="text" placeholder="用户名" v-model="username">
          </div>
          <div class="input-wrapper">
            <input type="tel" maxlength="30" placeholder="输入qq邮箱" v-model="qqEmail">
          </div>
          <div class="input-wrapper">
            <input :type="isCypher?'password':'text'" placeholder="输入密码" v-model="password">
            <span class="iconfont eyes" v-html="isCypher?'&#xe631;':'&#xe61f;'" @click="switchPwdMode()"></span>
          </div>
          <div class="input-wrapper">
          <input type="text" placeholder="验证码" v-model="captcha">
           <img
              ref="captcha"
              class="captcha"
              src="http://47.94.148.11:3000/captcha"
              alt="captcha"
              @click="getCaptcha()"
            >
          </div>
      </form>
      <p class="login-hint">
      温馨提示：注册代表已同意
        <a href="javascript:;">服务协议与隐私政策</a>
      </p>
      <button class="submit" @click="register()">立即注册</button>
      <button class="cancel" @click="backToLogin()">返回登录</button>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import {Toast,Loading} from 'vant'
import {BASE_URL} from '@/api/route'
export default {
  name: 'Register',
  data () {
    return {
      flag: true,
      isCypher:true,
      username:'',
      password:'',
      captcha:'',
      qqEmail:''
    };
  },
  components:{
    [Loading.name]:Loading
  },
  computed: {
    validEmail(){
      return /^([a-zA-Z0-9_-])+@qq.com$/.test(this.qqEmail)
    },
  },
  methods: {
    switchPwdMode(){
      this.isCypher = !this.isCypher
    },
    backToLogin(){
      this.$router.back()
    },
    getCaptcha(){
      this.$refs.captcha.src = 'http://47.94.148.11:3000/captcha?time=' + new Date();
    },
    async register(){
      if(!this.username){
        Toast('请输入用户名!');
        return;
      }else if(!this.validEmail){
        Toast('请输入正确的QQ邮箱!');
        return;
      }else if(!this.password){
        Toast('请输入密码!');
        return;
      }else if(!this.captcha){
        Toast('请输入验证码!');
        return;
      }
      let res = await axios.post(`${BASE_URL}/register`,{username:this.username,qqEmail:this.qqEmail,password:this.password,captcha:this.captcha})
      // Indicator.close()
      if(res.data.success_code){
        this.$router.replace('/login')
      }else{
        Toast(res.data.message);
      }
    }
  }
}

</script>


<style lang='stylus'  ref='stylesheet/stylus' scoped>
.register-container
  width 100%
  height 100%
  background: #ffffff
  .head
    position absolute
    left 50%
    top 25%
    transform translate(-50%,-50%)
    z-index 999
    width 70%
    display flex
    flex-direction column
    align-items center
    .logo
      width 150px
    .title
      margin-top 50px
      width 100%
      display flex
      justify-content space-around
      align-items center
      h4
        padding-bottom 10px
        color mediumpurple
        font-size 20px
        font-weight 700
        border-bottom 2px solid mediumpurple
  .register-form-wrapper
    width 80%
    position absolute
    z-index 999
    left 50%
    top 40%
    transform translateX(-50%)
    .input-wrapper
      width 100%
      height 48px
      display flex
      justify-content space-between
      align-items center
      margin-top 20px
      .eyes
        position absolute
        font-size 22px
        right 10px
        color mediumpurple
      input
        width 100%
        height 100%
        padding-left 8px
        box-sizing border-box
        border 1px solid #ddd
        border-radius 4px
        outline 0
        font 400 14px Arial
      .captcha
        position absolute
        right 0px
        border 0
        color #ccc
        font-size 14px
        background transparent
    .login-hint
      margin-top 12px
      color #999
      font-size 12px
      line-height 20px
      > a
        color mediumpurple
    .submit
      margin-top 30px
      background mediumpurple
      width 100%
      height 42px
      border-radius 4px
      color #fff
      text-align center
      font-size 16px
      line-height 42px
      border 0
    .cancel
      display block
      width 100%
      height 42px
      margin-top 15px
      border-radius 4px
      background transparent
      border: 1px solid mediumpurple
      color mediumpurple
      text-align center
      font-size 16px
      line-height 42px
</style>
