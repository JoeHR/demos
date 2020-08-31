/*
 * @Author: rh
 * @Date: 2020-08-18 19:09:59
 * @LastEditTime: 2020-08-31 16:40:42
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

  /**
   * 账号密码登录
   * @param {*} username 
   * @param {*} password 
   * @param {*} captcha_code 
   */
  async accountLogin (username, password, captcha_code) {
    const params = {username, password, captcha_code }
    return this.post('/api/v2/login', params)
  }

  /**
   * 退出登录
   */
  async signout () {
    return this.get('/api/v2/signout')
  }

  /**
   * 上传头像
   * @param {*} user_id 
   * @param {*} data 
   */
  uploadAvatar (user_id,data) {
    return this.post('/api/eus/v1/users/' + user_id + '/avatar', data)
  }
  
  /**
   * 搜索地址
   * @param {*} keyword 
   */
  searchNearby (keyword) {
    const params = {type:'nearby',keyword}
    return this.get('/api/v1/pois',{params})
  }

  /**
   * 添加地址
   * @param {*} userId 
   * @param {*} address 
   * @param {*} address_detail 
   * @param {*} geohash 
   * @param {*} name 
   * @param {*} phone 
   * @param {*} phone_bk 
   * @param {*} poi_type 
   * @param {*} sex 
   * @param {*} tag 
   * @param {*} tag_type 
   */
  postAddAddress (userId, address, address_detail, geohash, message, phone, phone_bk, poi_type, sex, tag, tag_type) {
    const url = `/api/v1/users/${userId}/addresses`
    const data = {address, address_detail, geohash, name:message, phone, phone_bk, poi_type, sex, tag, tag_type}
    return this.post(url,data)
  }

  /**
   * 个人中心里搜索地址
   * @param {*} userId 
   */
  getAddressList(userId){
    const url = `/api/v1/users/${userId}/addresses`
    return this.get(url)
  }

  /**
   * 删除地址
   * @param {*} userid 
   * @param {*} addressid 
   */
  deleteAddress (userid,addressid) {
    const url = `/api/v1/users/${userid}/addresses/${addressid}`
    return this.delete(url,{})
  }

  /**
   * 修改密码
   * @param {*} username 
   * @param {*} oldpassWord 
   * @param {*} newpassword 
   * @param {*} confirmpassword 
   * @param {*} captcha_code 
   */
  changePassword (username, oldpassWord, newpassword, confirmpassword, captcha_code) {
    return this.post('/api/v2/changepassword',{username, oldpassWord, newpassword, confirmpassword, captcha_code})
  }

  /**
   * 获取msite页面地址信息
   * @param {*} geohash 
   */
  msiteAddress (geohash) {
    return this.get('/api/v2/pois/' + geohash)
  }

  msiteFoodTypes (geohash) {
    const params = {geohash,group_type:'1','flags[]':'F'}
    return this.get('/api/v2/index_entry',{params})
  }

  shopList (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) {
    let supportStr = ''
    support_ids.forEach(item=>{
      if(item.status){
        supportStr += '&support_ids[]=' + item.id
      }
    })
    let params = {latitude,
      longitude,
      offset,
      limit: '20',
      'extras[]': 'activities',
      keyword: '',
      restaurant_category_id,
      'restaurant_category_ids[]': restaurant_category_ids,
      order_by,
      'delivery_mode[]': delivery_mode + supportStr};
    return this.get('/api/shopping/restaurants',{params})
  }
}


export default new API()