/*
 * @Author: rh
 * @Date: 2020-08-18 11:25:26
 * @LastEditTime: 2020-08-21 11:14:03
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, {Component} from 'react'
import {HashRouter,Switch,Route,Redirect} from 'react-router-dom'
import asyncComponent from '@/utils/asyncComponent'

const home = asyncComponent(() => import('@/pages/home/home'))
const login = asyncComponent(() => import('@/pages/login/login'))

const profile = asyncComponent(() => import('@/pages/profile/profile'))

export default class RouteConfig extends Component{
  render(){
    return (
      <HashRouter>
        <Switch>
          <Route path="/home" exact component={ home } />
          <Route path="/login" exact component={ login } />
          <Route path="/profile" exact component={ profile } />
          <Redirect exact from='/' to='/login'/>
        </Switch>

      </HashRouter>
    )
  }
}