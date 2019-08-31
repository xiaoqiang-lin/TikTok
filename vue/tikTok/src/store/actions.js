import * as types from './mutation-types'
import { getUserInfo } from '@/api/mine'
export default {
  async fetchUserInfo({ commit }) {
    const result = await getUserInfo();
    if (result.data.success_code === 200) {
      commit(types.SET_USER_INFO, { userInfo: result.data.message });
    }
  },
  syncUserInfo({ commit }, userInfo) {
    commit(types.SET_USER_INFO, userInfo);
  },
  async signOut({ commit }) {
    const result = await logout();
    if (result.data.success_code === 200) {
      commit(types.CLEAR_USER_INFO);
    }
  },
}

