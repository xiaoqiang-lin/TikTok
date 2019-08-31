import axios from 'axios'
import { BASE_URL } from './route'

export function getFile(blobUrl) {
  return axios.get(blobUrl)
}

export function uploadVideo(formData, config) {
  return axios.post(`${BASE_URL}/uploadVideo`, formData, config)
}


