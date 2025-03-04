import { AxiosError } from 'axios'
import { api } from './api'
import router from '@/router'

/**
 * @param api_url URL a fazer o get
 * @param args objetos passados através do body
 * @param callbackOnSuccess
 * @param callbackOnError
 * @returns
 */
async function get(
  api_url: string,
  args?: object | undefined,
  callbackOnSuccess?: any | undefined,
  callbackOnError?: any | undefined,
) {
  try {
    const response = await api.get(api_url, args)
    if (response.data?.errors) {
      /* se deu algum erro */
      throw new Error(response.data?.errors)
    }
    if (callbackOnSuccess != undefined) callbackOnSuccess()
    return response
  } catch (error: any) {
    if (callbackOnError != undefined) callbackOnError()
    const err = error as AxiosError
    handle_error(err)
    if (err.response) {
      return err.response as any
    } else {
      throw new Error(error.message)
    }
  }
}

/**
 * @param api_url URL a fazer o post
 * @param args objetos passados através do body
 * @param callbackOnSuccess
 * @param callbackOnError
 * @returns
 */
async function post(
  api_url: string,
  args?: object | undefined,
  callbackOnSuccess?: any,
  callbackOnError?: any,
) {
  try {
    const response = await api.post(api_url, args)

    if (response.data?.errors) {
      throw new Error(response.data?.errors)
    }
    if (callbackOnSuccess != undefined) callbackOnSuccess()
    return response
  } catch (error: any) {
    if (callbackOnError != undefined) callbackOnError()
    const err = error as AxiosError
    handle_error(err)
    if (err.response) {
      return err.response as any
    } else {
      throw new Error(error.message)
    }
  }
}

async function put(
  api_url: string,
  args?: object | undefined,
  callbackOnSuccess?: any,
  callbackOnError?: any,
) {
  try {
    const response = await api.put(api_url, args)

    if (response.data?.errors) {
      throw new Error(response.data?.errors)
    }
    if (callbackOnSuccess != undefined) callbackOnSuccess()
    return response
  } catch (error: any) {
    if (callbackOnError != undefined) callbackOnError()
    const err = error as AxiosError
    handle_error(err)
    if (err.response) {
      return err.response as any
    } else {
      throw new Error(error.message)
    }
  }
}

async function deletar(
  api_url: string,
  args?: object | undefined,
  callbackOnSuccess?: any,
  callbackOnError?: any,
) {
  try {
    const response = await api.delete(api_url, args)

    if (response.data?.errors) {
      throw new Error(response.data?.errors)
    }
    if (callbackOnSuccess != undefined) callbackOnSuccess()
    return response
  } catch (error: any) {
    if (callbackOnError != undefined) callbackOnError()
    const err = error as AxiosError
    handle_error(err)
    if (err.response) {
      return err.response as any
    } else {
      throw new Error(error.message)
    }
  }
}

function handle_error(axios_error: AxiosError) {
  switch (axios_error.response?.status) {
    case 401 /* unauthorized */:
      router.push('/')
      break
    case 440 /* login time-out */:
      break
    case 403:
      router.push('/')
      break
    default:
      break
  }
}

export { get, post, put, deletar }
