/*
import { clearStore } from '@/utils/commons';
 * @Author: rh
 * @Date: 2020-08-19 17:55:49
 * @LastEditTime: 2020-08-24 20:50:55
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */

/**
 * 用于get方法后面参数的拼接，传入data是对象
 * @param {*} data 
 */
export const getUrlConcat  = data =>{
  let dataStr = ''
  let url = ''
  Object.keys(data).forEach(key=>{
    dataStr += `&key=${data[key]}`
  })
  if (dataStr) {
    dataStr = dataStr.substr(1,dataStr.length-1)
    url = url + '?' + dataStr
  }
  return url
}

/**
 * 存储localStoage
 * @param {*} name 
 * @param {*} content 
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 * @param {*} name 
 */
export const getStore = name => {
  if(!name) return 
  return JSON.parse(window.sessionStorage.getItem(name)||null)
}

/**
 * 删除sessionStorage
 * @param {*} name 
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 * 清空sessionStorage
 * @param {*} name 
 */
export const clearStore = () => {
  window.sessionStorage.clear()
}

/**
 * 处理图片路径
 */
export const getImgPath = (path) => {
  //传递过来的图片地址需要处理后才能正常使用(path) {
    let suffix;
    if (!path) {
      return 'https://elm.cangdu.org/img/default.jpg'
    }
    if (path.indexOf('jpeg') !== -1) {
      suffix = '.jpeg'
    } else {
      suffix = '.png'
    }
    let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
    return 'https://fuss10.elemecdn.com' + url
}