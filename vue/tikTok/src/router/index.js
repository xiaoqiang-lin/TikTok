// 1. 引入
import Vue from 'vue'
import VueRouter from 'vue-router'

//引入一级路由
import Login from '@/pages/Login/Login'
import Home from '@/pages/Home/Home'
import Register from '@/pages/Register/Register'
import Mine from '@/pages/Mine/Mine'
import ChooseBgm from '@/pages/ChooseBgm/ChooseBgm'
import Profile from '@/pages/Profile/Profile'
// 声明使用
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/mine', component: Mine, meta: {
        requiresAuth: true      // 要求验证的页面,在此情况下其子页面也会被验证.
      },
    },
    {
      path: '/chooseBgm', component: ChooseBgm, meta: {
        requiresAuth: true      // 要求验证的页面,在此情况下其子页面也会被验证.
      },
    },
    { path: '/profile', component: Profile}
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {     // 哪些需要验证
    if (localStorage.getItem("token")==='undefined') {                      // token存在条件   
      next({
        path: '/login',                                               // 验证失败要跳转的页面
      })
    } else {
      next()
    }
  } else {
    next()                                                       // 确保一定要调用 next()
  }
})

export default router;