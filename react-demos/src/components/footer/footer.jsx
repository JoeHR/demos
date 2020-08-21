/*
 * @Author: rh
 * @Date: 2020-08-18 20:54:28
 * @LastEditTime: 2020-08-18 20:54:30
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './footer.scss'
import '../../assets/iconfont/iconfont.js';

class Footer extends Component {
  render () {
    return (
      <section className='footer-container'>
        <NavLink className='guide-item' to='/msite'>
          <div className='icon-changyonglogo40 icon-style'></div>
          <span className='spec-text'>外卖</span>
        </NavLink>
        <NavLink className='guide-item' to='/technology'>
          <div className='icon-zhinanzhen icon-style'></div>
          <span>搜索</span>
        </NavLink>
        <NavLink className='guide-item' to='/technology'>
          <div className='icon-dingdan icon-style'></div>
          <span>订单</span>
        </NavLink>
        <NavLink className='guide-item' to='/profile'>
          <div className='icon-account icon-style'></div>
          <span>我的</span>
        </NavLink>
      </section>
    )
  }
}

export default Footer