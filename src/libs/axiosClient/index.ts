import { AUTH_INFO_KEY, ERROR_CODES, isAuthRequest, LOCALE_SELECTED_KEY, TOKEN_KEY } from '@/constants/system'
import { BaseAPIResponse } from '@/models/api/common'
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const isSameOriginApi =
  process.env.NEXT_PUBLIC_USE_SAME_ORIGIN_API === 'true' ||
  !process.env.NEXT_PUBLIC_BACK_END_DOMAIN

const axiosClient = axios.create({
  baseURL: isSameOriginApi ? '/api/v1' : process.env.NEXT_PUBLIC_BACK_END_DOMAIN,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  timeout: !isNaN(Number(process.env.NEXT_PUBLIC_TIME_OUT_API))
    ? Number(process.env.NEXT_PUBLIC_TIME_OUT_API)
    : 60000,
})

axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    if (!isAuthRequest(config.url)) {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    const lang = localStorage.getItem(LOCALE_SELECTED_KEY)
    if (lang) {
      config.headers['Accept-Language'] = lang
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data
  },
)

export default axiosClient
