/*
 * @Author: rh
 * @Date: 2020-08-19 19:05:49
 * @LastEditTime: 2020-08-19 19:07:21
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import * as user from './action-type'

export const saveUserInfo = userInfo => {
  return {
    type: user.SAVE_USERINFO,
    userInfo
  }
}