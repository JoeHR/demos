/*
 * @Author: rh
 * @Date: 2020-08-18 20:59:17
 * @LastEditTime: 2020-08-19 09:21:03
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import * as user from './action-type'

let defaultState = {
  addressList: [],   // 地址列表
  addressName: '',  // 选中的地址
  temMessage: '', //临时姓名
  hasAddressList: [], // 已有的地址
  operate: 'edit',
  userInfo: {},
  geohash: []
}

export default (state = defaultState, action = { }) => {
  switch(action.type){
    case user.SAVE_USERINFO:
      return {
        ...state,
        userInfo: action.userInfo
      }
    case user.SAVE_ATTRINFO:
      return {...state,...{[action.datatype]:action.value}}
    case user.MODIFY_USERINFO:
      return {...state,userInfo: {...state.userInfo,[action.key]:action.value}}
    default:
      return state
  }
}