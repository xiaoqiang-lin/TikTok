<template>
  <div class="pwd-mode">
    <form action="">
        <div class="input-wrapper">
          <input type="text" placeholder="输入用户名" v-model="username">
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
              src="http://127.0.0.1:3000/captcha"
              alt="captcha"
              @click="getCaptcha()"
            >
        </div>
      </form>
  </div>
</template>

<script>
export default {
  name:'PwdLogin',
  data () {
    return {
      isCypher: true,
      username:'',
      password:'',
      captcha:''
    };
  },

  components: {

  },

  computed: {

  },

  mounted () {

  },

  methods: {
    switchPwdMode(){
      this.isCypher = !this.isCypher
    },
    getCaptcha(){
      this.$refs.captcha.src = 'http://127.0.0.1:3000/captcha?time=' + new Date(); 
    }
  }
}

</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
  .pwd-mode
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
          &:focus
            border 1px solid mediumpurple
        .captcha
          position absolute
          right 0px
          border 0
          color #ccc
          font-size 14px
          background transparent
          &.validBtn
            color purple
</style>