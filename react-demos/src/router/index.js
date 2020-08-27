/*
 * @Author: rh
 * @Date: 2020-08-18 11:25:26
 * @LastEditTime: 2020-08-26 10:11:13
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, {Component} from 'react'
import {BrowserRouter,Route,Redirect,withRouter, Switch} from 'react-router-dom'
import asyncComponent from '@/utils/asyncComponent'
import { TransitionGroup, CSSTransition} from 'react-transition-group'
import './index.scss'


const Home = asyncComponent(() => import('@/pages/home/home'))
const Login = asyncComponent(() => import('@/pages/login/login'))
const Profile = asyncComponent(() => import('@/pages/profile/profile'))
const ProfileInfo = asyncComponent(() => import('@/pages/profile/info/info'))
const ProfileInfoSetUserName = asyncComponent(() => import('@/pages/profile/setusername/setusername'))
const ProfileInfoAddress = asyncComponent(()=>import('@/pages/profile/address/address'))
const ProfileInfoAddAddress = asyncComponent(()=>import('@/pages/profile/addaddress/addaddress'))
const ProfileInfoAddAddressDetail = asyncComponent(()=>import('@/pages/profile/adddetail/adddetail'))

const ANIMATION_MAP = {
  PUSH: 'forward',
  POP: 'back'
}

const Routes = withRouter(({location,history})=>(
  <TransitionGroup
  className={'router-wrapper'}
  childFactory={child => React.cloneElement(
    child,
    {classNames: ANIMATION_MAP[history.action]}
  )}
>
  <CSSTransition
    timeout={500}
    key={location.pathname}
  >
    <Switch location={location}>
      <Route path="/login" exact component={ Login } />
      <Route path="/home" exact component={ Home } />
      <Route path="/profile" exact component={ Profile } />
      <Route path="/profile/info" exact component={ ProfileInfo } />
      <Route path="/profile/info/setusername" exact component={ ProfileInfoSetUserName } />
      <Route path="/profile/info/address" exact component={ ProfileInfoAddress } />
      <Route path="/profile/info/address/add" exact component={ ProfileInfoAddAddress } />
      <Route path="/profile/info/address/add/addDetail" exact component={ ProfileInfoAddAddressDetail } />
      <Redirect exact to='/home' from='/' />
    </Switch>
  </CSSTransition>
</TransitionGroup>
))
export default class RouteConfig extends Component{
  render(){
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    )
  }
}