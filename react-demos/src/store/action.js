/*
 * @Author: rh
 * @Date: 2020-08-19 19:05:49
 * @LastEditTime: 2020-08-27 13:39:51
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import * as action from './action-type'
import { setStore, removeStore, clearStore } from '@/utils/commons'

export const saveUserInfo = userInfo => {
  setStore('userInfo',JSON.stringify(userInfo))
  setStore('user_id',userInfo.user_id)
  return {
    type: action.SAVE_USERINFO,
    userInfo
  }
}

/**
 * 退出登录
 */
export const loginOut = () => {
  removeStore('userInfo')
  clearStore()
  return {
    type: action.LOGIN_OUT
  }
}

/**
 * 保存头像
 * @param imgPath
 */
export const saveAvander = (imgPath) =>{
  return {
    type:action.SAVE_AVANDER,
    imgPath
  }
}

/**
 * 保存可删除收货地址
 * @param removeAddress
 */
export const saveRemoveAddress = (removeAddress) => {
  return {
    type: action.SAVE_REMOVEADDRESS,
    removeAddress
  }
}

/**
 * 保存新增地址
 * @param addAddress 
 */
export const saveAddAddress = (addAddress) => {
  return {
    type: action.SAVE_ADDADDRESS,
    addAddress
  }
}

/**
 * 添加地址
 * @param addAddress 
 */
export const saveAddDetail = addAddress => {
  return {
    type: action.SAVE_ADDDETAIL,
    addAddress
  }
}

/**
 * 保存添加地址页面状态
 * @param address 
 */
export const saveAddressPage = address => {
  return {
    type: action.SAVE_ADDRESS_PAGE,
    address
  }
}

