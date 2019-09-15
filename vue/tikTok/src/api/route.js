import axios from 'axios'

let token = localStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = token
export const BASE_URL = 'http://47.94.148.11:3000'