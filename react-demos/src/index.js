/*
 * @Author: rh
 * @Date: 2020-08-18 10:42:21
 * @LastEditTime: 2020-08-24 18:20:52
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick'
import Route from '@/router'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import store from '@/store'
import * as serviceWorker from '@/serviceWorker';
import '@/style/base.scss'

FastClick.attach(document.body)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('root')
  )
}

render(Route)

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
