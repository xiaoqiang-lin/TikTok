<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "App",
  data(){
    return {
      transitionName: 'fold-left',
    }
  },
  created() {
    if (localStorage.getItem('token')!==null) {
      this.fetchUserInfo().then(val => {
        this.setLoginState(true);
      });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapMutations({
      setUserInfo: "SET_USER_INFO",
      setLoginState: "SET_LOGIN_STATE"
    }),
    ...mapActions(["fetchUserInfo"])
  },
  watch:{
    '$route' (to,from){
      const routes =['/register','/login','/home','/profile','/mine','/chooseBgm']
      const toDepth = routes.indexOf(to.path);
      const fromDepth = routes.indexOf(from.path);
      this.transitionName = toDepth > fromDepth ? 'fold-left' : 'fold-right';
    }
  },
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
.fold-left-enter-active {
    animation-name: fold-left-in;
    animation-duration: .3s;
  }
  .fold-left-leave-active {
    animation-name: fold-left-out;
    animation-duration: .3s;
  }
  @keyframes fold-left-in {
    0% {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      /* visibility: visible; */
    }
    /*50% {
      transform: translate3d(50%, 0, 0);
    }*/
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-left-out {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    /*50% {
      transform: translate3d(-50%, 0 , 0);
    }*/
    100% {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      /* visibility: hidden; */
    }
  }

  .fold-right-enter-active {
    animation-name: fold-right-in;
    animation-duration: .3s;
  }
  .fold-right-leave-active {
    animation-name: fold-right-out;
    animation-duration: .3s;
  }
  @keyframes fold-right-in{
    0% {
      width: 100%;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      /* visibility: visible; */
    }
    /*50% {
      transform: translate3d(50%, 0, 0);
    }*/
    100% {
      width: 100%;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-right-out  {
    0% {
      width: 100%;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    /*50% {
      transform: translate3d(-50%, 0 , 0);
    }*/
    100% {
      width: 100%;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      /* visibility: hidden; */
    }
  }
</style>
