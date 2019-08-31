import axios from 'axios'
import {BASE_URL} from './route'

export function getUserInfo(){
  return axios.get(`${BASE_URL}/userInfo`)
}
export function uploadAvatar(params,config){
  return axios.post(`${BASE_URL}/uploadAvatar`,params,config)
}
export function uploadVideo(formData,config){
  return axios.post(`${BASE_URL}/uploadVideo`,formData,config)
}
export function getFavorVideos(){
  return axios.get(`${BASE_URL}/favorVideosList`)
}
export function getFavorUsers(){
  return axios.get(`${BASE_URL}/favorUsersList`)
}