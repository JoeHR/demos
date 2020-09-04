/*
 * @Author: rh
 * @Date: 2020-08-20 09:56:49
 * @LastEditTime: 2020-08-31 19:53:37
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React from 'react'
import './head.scss'
import { Link, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { getStore } from '@/utils/commons';
import { saveUserInfo } from '@/store/action';
import API from '@/api/api'

class HeadTop extends React.Component {

  async componentDidMount () {
    if((!this.props.userInfo||!this.props.userInfo.user_id)&&getStore('user_id')){
      const userInfo = await API.getUser(getStore('user_id'))
      this.props.saveUserInfo(userInfo)
    }
  }

  render(){
    const props = this.props
    return (
      <header id="head_top" className='head_container'>
        {props.logo}
        {props.search}
        {
          props.goBack ?  
            <section className='head_goback' onClick={ props.history.goBack }>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <polyline points="12,18 4,9 12,0" style={{ fill:'none',stroke:'rgb(255,255,255)',strokeWidth:2}}/>
              </svg>
            </section> : null
        }
        {
          props.signinUp ?
          <Link to={ props.userInfo ? '/profile':'/login'} className='head_login'>
          {
            props.userInfo && props.userInfo.user_id ?  
              <svg className='user_avatar' viewBox="0 0 28 33">
                  <path fillRule="evenodd" d="M20.798 19.289c2.636-2.002 4.215-5.091 4.215-8.437 0-5.886-4.845-10.647-10.808-10.647S3.397 4.966 3.397 10.852c0 3.345 1.578 6.433 4.212 8.435l.264-2.678C4.358 18.32 1.591 21.403.168 25.187l1.478.556v-1.579c-1.485.73-1.485.73-1.501 1.079-.054.188-.054.188-.069.278a2.58 2.58 0 0 0-.026.229 9.112 9.112 0 0 0-.019.4c-.008.265-.014.617-.018 1.039-.005.511-.006 1.037-.006 1.451v.027c-.004 1.732 1.41 3.129 3.154 3.129h22.082a3.18 3.18 0 0 0 3.172-3.153l.011-1.305.008-.897.003-.296.001-.083v-.022-.006-.001l.002-.278-.093-.262c-1.385-3.918-4.203-7.122-7.812-8.88l.263 2.678zm-1.911-2.516l-2.045 1.553 2.309 1.125c2.856 1.392 5.106 3.949 6.218 7.093l-.09-.54V26.033l-.001.083-.003.296-.008.897-.011 1.305c0 .01-.011.021-.013.021H3.161c-.007 0 .005.011.005.032v-.031c0-.404.001-.92.006-1.418.004-.4.01-.732.017-.969.004-.121.008-.212.012-.262l-.006.043c-.009.06-.009.06-.058.229-.01.336-.01.336-1.49 1.063H2.74l.385-1.024c1.141-3.035 3.35-5.495 6.131-6.849l2.309-1.124-2.045-1.554c-1.859-1.412-2.964-3.576-2.964-5.92 0-4.129 3.418-7.488 7.649-7.488s7.649 3.359 7.649 7.488c0 2.344-1.106 4.509-2.966 5.921z" className="path1">
                  </path>
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
}

const mapStateToProps = state => {
  return {
    userInfo: state.user.userInfo || {}
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveUserInfo:userInfo => dispatch(saveUserInfo(userInfo))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(HeadTop))