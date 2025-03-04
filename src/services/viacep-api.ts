import axios, { type AxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
})

api.interceptors.request.use(async (request) => {
  return request
})

