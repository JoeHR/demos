/*
 * @Author: rh
 * @Date: 2020-08-18 11:35:09
 * @LastEditTime: 2020-08-26 14:13:45
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import { createStore, applyMiddleware,combineReducers } from 'redux'
import userReducer from './user.reducer.js'
import addressReducer from './address.reducer.js'
import thunk from 'redux-thunk'

const reducer = combineReducers({
  user:userReducer,
  address:addressReducer
})

let store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store