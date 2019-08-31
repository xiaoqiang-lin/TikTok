<template>
  <div class="login-container">
    <header class="head">
      <img src="./../../assets/images/logo.png" alt="logo" class="logo">
      <div class="login-mode-tip">
        <h4 :class={active:flag} @click.prevent="switchLoginMode(true)">验证码登录</h4>
        <h4 :class={active:!flag} @click.prevent="switchLoginMode(false)">密码登录</h4>
      </div>
    </header>
    <section class="login-mode">
      <component :is="flag?'sms-login':'pwd-login'" ref="mode"></component>
      <div class="hint">
        <a>忘记密码？</a>
        <router-link to="/register" style="text-decoration:none">新用户注册</router-link>
      </div>
      <button class="submit" @click.prevent="login()">登录</button>
      <button class="cancel">返回</button>
    </section>
  </div>
</template>

<script>
import SmsLogin from './Children/SmsLogin'
import PwdLogin from './Children/PwdLogin'
import {loginBySms,loginByPwd} from '@/api/login';
import {Toast} from 'vant'
import {mapMutations,mapGetters} from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      flag: true,
    };
  },
  components: {
    SmsLogin,
    PwdLogin
  },
  methods: {
    ...mapMutations({
      'setUserInfo':'SET_USER_INFO',
      'setLoginState':'SET_LOGIN_STATE'
    }),
    ...mapGetters([
      'userInfo'
    ]),
    switchLoginMode(flag){
      this.flag=flag
    },
    async login(){
      let res;
      if(this.flag){
        let qqEmail = this.$refs.mode._data.qqEmail
        let pin = this.$refs.mode._data.pin
        if(!qqEmail){
          Toast('请输入正确的QQ邮箱!');
          return;
        }
        if(!pin){
          Toast('请输入验证码!');
          return;
        }else if(!(/^\d{6}$/gi.test(pin))){
          Toast('请输入正确的邮箱验证码!');
          return;
        }
        res = await loginBySms({qqEmail,pin})
      }else{
        const {username,password,captcha} = this.$refs.mode._data
        if(!username){
              Toast('请输入用户名!');
              return;
          }else if(!password){
              Toast('请输入密码!');
              return;
          }else if(!captcha){
            Toast('请输入验证码!');
            return;
          }
        res = await loginByPwd({username,password,captcha});
      }
      if(res.data.err_code===0){
        Toast(res.data.message)
      }else{
        localStorage.setItem('token',res.data.token)
        console.log(res.data.token)
        this.setUserInfo(res.data.message)
        this.setLoginState(true)
        this.$router.replace('/mine');
      }
    }
  }
}

</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
.login-container
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
    .login-mode-tip
      margin-top 50px
      width 100%
      display flex
      justify-content space-around
      align-items center
      h4
        padding-bottom 10px
      .active
        color mediumpurple
        font-weight 700
        border-bottom 2px solid mediumpurple
  .login-mode
    width 80%
    position absolute
    z-index 999
    left 50%
    top 40%
    transform translateX(-50%)
    .hint
      margin-top 12px
      font-size 14px
      width 100%
      display flex
      justify-content space-between
      align-items center
      a
        padding 0 10px
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
