/*
 * @Author: rh
 * @Date: 2020-08-18 20:59:17
 * @LastEditTime: 2020-08-26 11:10:30
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
  userInfo: null,
  geohash: '31.22299,121.36025',
  latitude: '', // 当前位置纬度
  longitude: '', // 当前位置经度
  newAddress: [], //确认订单页新的地址
  searchAddress: null,//搜索并选择的地址
  choosedAddress: null,//选择地址
  addressIndex: null,//选择地址的索引值
  removeAddress:[],//移除地址
	addAddress:'',		//新增地址
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
    case user.SAVE_REMOVEADDRESS:
      return {...state,removeAddress:action.removeAddress}
    case user.SAVE_ADDADDRESS:
      return {...state,removeAddress:[action.addAddress,...state.removeAddress]}
    case user.SAVE_ADDDETAIL:
      return {...state,addAddress:action.addAddress}
    default:
      return state
  }
}