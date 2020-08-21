/*
 * @Author: rh
 * @Date: 2020-08-18 19:09:59
 * @LastEditTime: 2020-08-21 16:07:55
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import Server from './server'
import { getUrlConcat } from '@/utils/commons'

class API extends Server {

  /**
   * 获取首页默认地址
   */
  async cityGuess () {
    const params = {type:'guess'}
    const result = await this.get('/api/v1/cities', { params })
    return result
  }

  /**
   * 获取首页热门城市
   */
  async hotcity () {
    const params = { type: 'hot' }
    return await this.get('/api/v1/cities', { params })
  }

  /**
   * 获取首页所有城市
   */
  async groupcity () {
    const params = { type: 'group' }
    return await this.get('/api/v1/cities', { params })
  }

  /**
   * 获取用户信息
   * @param {*} data 
   */
  async getUser (data) {
    let result = await this.get('/api/v1/user' + getUrlConcat(data))
    return result
  }

  /**
   * 监测账号是否存在
   * @param {*} checkNumber 
   * @param {*} type 
   */
  async checkExist (checkNumber,type) {
    const params = {[type]:checkNumber,type}
    let result = await this.get('/api/v1/users/exists',{ params })
    return result
  }

  /**
   * 获取短信验证码
   * @param {*} phone 
   */
  async mobileCode (phone) {
    const params = { mobile: phone, scene:'login',type:'sms'}
    return this.post('/api/v4/mobile/verify_code/send',params)
  }

  /**
   * 获取图片验证码
   */
  async getcaptchas () {
    return this.post('/api//v1/captchas')
  }

  /**
   * 手机号登录
   * @param {*} code 
   * @param {*} mobile 
   * @param {*} validate_token 
   */
  async sendLogin (code, mobile, validate_token) {
    const params = {code, mobile, validate_token }
    return this.post('/api/v1/login/app_mobile', params)
  }

  async accountLogin (username, password, captcha_code) {
    const params = {username, password, captcha_code }
    return this.post('/api/v2/login', params)
  }

}


export default new API()