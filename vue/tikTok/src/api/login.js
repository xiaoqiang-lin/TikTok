import axios from 'axios'

import {BASE_URL} from './route'


export function getCaptcha(){
  return axios.get(`${BASE_URL}/captcha`)
}

export function getPIN(email){
  return axios.get(`${BASE_URL}/getpin/?email=${email}`)
}

export function loginBySms(params){
  return axios.post(`${BASE_URL}/smslogin`,params)
}
export function loginByPwd(params){
  return axios.post(`${BASE_URL}/pwdlogin`,params,)
}
