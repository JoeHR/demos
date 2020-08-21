/*
 * @Author: rh
 * @Date: 2020-08-18 19:10:24
 * @LastEditTime: 2020-08-21 15:22:21
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import axios from 'axios'

const publicPath = [/^\/mock/, /^\/login/]
const CancelToken = axios.CancelToken

export default class Server {
  constructor(){
    this.pending = {}
  }

  getInstanceConfig(){
    const config = {
      headers:{
        'Content-type':'application/json;charset=utf-8'
      },
      timeout: 30000
    }
    return config
  }

  removePending (key, isRequest = false){
    if(this.pending[key] && isRequest){
      this.pending[key]('cancel request')
    }
    delete this.pending[key]
  }

  interceptors (instance) {
    instance.interceptors.request.use(config => {
      let isPublic = false
      publicPath.map(path => {
        isPublic = isPublic || path.test(config.url ? config.url : '')
        return isPublic
      })

      // const token = getToken()
      // if(!isPublic && token){
      //   config.headers.Authorization = 'Bearer ' + token
      // }
      const key = config.url + '&'  + config.method + '&' +  (config.params ? Object.keys(config.params).map(v=>`${v}=${config.params[v]}`).join('&') : null)
      this.removePending(key,true)
      config.cancelToken = new CancelToken(c => {
        this.pending[key] = c
      })

      return config
    })

    instance.interceptors.response.use(res => {
      const key = res.config.url + '&' + res.config.method
      this.removePending(key)

      if (res.status === 200) {
        const { data } = res
        return Promise.resolve(data)
      } else {
        return Promise.reject(res)
      }
    }, err => {
      // if(err.message !== 'cancel request'){
        
      // }
      return Promise.reject(err)
    })
  }

  getInstance (options) {
    const instance = axios.create()
    const newOps = Object.assign(this.getInstanceConfig(),options)
    this.interceptors(instance)
    return instance(newOps)
  }

  get (url, config = null) {
    const options = Object.assign({
      method:'get',
      url:url
    },config)
    return this.getInstance(options)
  }

  post (url, data = null){
    return this.getInstance({
      method:'post',
      url,
      data: data
    })
  }
}