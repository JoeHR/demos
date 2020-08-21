/*
 * @Author: rh
 * @Date: 2020-08-20 09:56:49
 * @LastEditTime: 2020-08-21 11:09:30
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React from 'react'
import './head.scss'
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

function HeadTop (props) {
  const history = useHistory()

  return (
    <header id="head_top" className='head_container'>
      {props.logo}
      {props.search}
      {
        props.goBack ?  
          <section className='head_goback' onClick={ history.goBack() }>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style={{ fill:'none',stroke:'rgb(255,255,255)',strokeWidth:2}}/>
            </svg>
          </section> : null
      }
      {
        props.signinUp ?
        <Link to={ props.userInfo.user_id ? '/profile':'/login'} className='head_login'>
        {
          props.userInfo.user_id ?  
            <svg className='user_avatar' dangerouslySetInnerHTML={{__html:'<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>'}}>
            </svg> 
            :  <span className='login_span'>登录|注册</span>
        }
        </Link> : null
      }
      {
        props.headTitle ? 
        <section className='title_head ellipsis'>
            <span className='title_text'>{props.headTitle}</span>
        </section> : null
      }
      {props.edit}
      {props.msiteTitle}
      {props.changeCity}
      {props.changeLogin}
    </header>
  )
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProps,null)(HeadTop)