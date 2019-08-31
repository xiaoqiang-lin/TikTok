import axios from 'axios'
import {BASE_URL} from './route'

export function getWorksList(params){
  return axios.get(`${BASE_URL}/worksList?who=${params.who}&id=${params.id}`)
}