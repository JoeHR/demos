/*
 * @Author: rh
 * @Date: 2020-08-25 11:30:46
 * @LastEditTime: 2020-08-25 14:21:36
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, { Component } from 'react'
import HeadTop from '@/components/header/head'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getStore } from '@/utils/commons'
import { saveUserInfo } from '@/store/action'
import './setusername.scss'

class SetUserName extends Component {
  
  state = {
    inputValue: '', // 输入框得内容
    opacityall: false,  // 字体透明度
    bordercolor: false, // 输入框边框颜色
    newusername:'',  // 新用户名
    earn: true  // 输入框提醒
  }

  inpChange = (name,event) => {
    const newState = {}
    let value = ''
    let result = false
    if(typeof event === 'object' && event ){
      value = event.target.value
    }else{
      value = event
    }
    newState[name] = value
    if(value.length < 5 || value.length > 24){
      newState['earn'] = false
      newState['bordercolor'] = true
      newState['opacityall'] = false
      result = false
    }else{
      newState['earn'] = true
      newState['bordercolor'] = false
      newState['opacityall'] = true
      result = true
    }
    this.setState(newState)
    return result
  }

  resetName = () =>{
    const {inputValue} = this.state
    const {userInfo} = this.props
    const result = this.inpChange('inputValue',inputValue)
    if(!result) {
      return false
    }
    userInfo.username = inputValue
    this.props.saveUserInfo(userInfo)
    this.props.history.go(-1)
  }

  render(){
    const { inputValue, bordercolor, opacityall, earn}  = this.state
    const { inpChange } = this
    return (
      <div className='rating_page'>
        <HeadTop headTitle='修改用户名' goBack={this.props.history.goBack}></HeadTop>
        <section className='setname'>
          <section className='setname-top'>
            <input type="text" placeholder='输入用户名' className={bordercolor?'setname-input':''} value={inputValue} onChange={inpChange.bind(this,'inputValue')}/>
            <div>
              {
                earn?(
                  <p>用户名只能修改一次（5-24字符之间）</p>
                ):(
                  <p className='unlikep'>用户名长度在5到24位之间</p>
                )
              }
            </div>
          </section>
          <section className='reset'>
            <button className={opacityall ? 'fontopacity': ''} onClick={this.resetName}>确认修改</button>
          </section>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo || getStore('userInfo') || {},
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: userInfo=>dispatch(saveUserInfo(userInfo))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(SetUserName))