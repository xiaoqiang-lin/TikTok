import axios from 'axios'
import {BASE_URL} from './route'

export function getBgmList(){
  return axios.get(`${BASE_URL}/bgmList`)
}