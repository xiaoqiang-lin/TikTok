import axios from 'axios'

import {BASE_URL} from './route'


export function getVideoList(){
  return axios.get(`${BASE_URL}/videoList`)
}

export function likeVideo(params){
  return axios.post(`${BASE_URL}/videoLike`,params)
}

export function followMe(params){
  return axios.post(`${BASE_URL}/followMe`,params)
}

export function getCommentList(video_id){
  return axios.get(`${BASE_URL}/commentList/?video_id=${video_id}`)
}

export function sendComment(params){
  return axios.post(`${BASE_URL}/saveComment`,params)
}

export function likeComment(params){
  return axios.post(`${BASE_URL}/commentLike`,params)
}