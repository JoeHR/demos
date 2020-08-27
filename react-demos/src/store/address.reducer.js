/*
 * @Author: rh
 * @Date: 2020-08-26 14:14:14
 * @LastEditTime: 2020-08-26 14:31:58
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import * as address from './action-type'

const defaultState = {
    verify:false,			//姓名 校验
    verifythree:false,		//地址
    verifyfour:false,		//电话
    verifyfive:false,		//备用电话
    butpart:false,			//新增地址按钮的透明度
    sendaddress:'',  //地址
    message:'', //姓名
    mesthree:'', //送餐地址
    telenum:'', //手机号
    telephone:'', //手机号提示
    standbytele:'', //备用手机号提示 
    standbytelenum:'', //备用手机号
}


export default (state = defaultState , action = {}) => {
  switch (action.type) {
    case address.SAVE_ADDRESS_PAGE:
      return {...state, ...action.address}
    default:
      return {...state}
  }
}

