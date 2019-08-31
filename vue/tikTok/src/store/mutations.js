import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO] (state,userInfo){
    state.userInfo = userInfo;
  },
  [types.CLEAR_USER_INFO](state){
    state.userInfo={}
  },
  [types.SET_LOGIN_STATE](state,bool){
    state.isLogin = bool
  },
}


export default mutations;