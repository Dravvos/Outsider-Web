import axios, { type AxiosRequestConfig } from 'axios'
import { getAccessToken } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_GatewayAPI,
})

api.interceptors.request.use(async (request) => {
  await headersWithBearer(request)
  return request
})

const headersWithBearer = async (request: AxiosRequestConfig<any>) => {
  const token = await getAccessToken();
  if (request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
    request.headers["Content-Type"] = "application/json";
  }

  return request;
}
