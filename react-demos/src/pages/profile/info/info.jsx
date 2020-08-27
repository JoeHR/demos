/*
 * @Author: rh
 * @Date: 2020-08-24 18:58:56
 * @LastEditTime: 2020-08-27 11:38:29
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, {Component} from 'react'
import  HeadTop  from '@/components/header/head';
import { Link } from 'react-router-dom';
import AlertTip from '@/components/alert_tip/alert_tip'
import { getStore } from '@/utils/commons'
import { connect } from 'react-redux';
import { loginOut, saveAvander} from '@/store/action'
import API from '@/api/api'
import './info.scss'
import { saveUserInfo } from './../../../store/action';

class ProfileInfo extends Component {

  fileInput = React.createRef()

  constructor(props){
    super(props)
    const {userInfo} = props
    this.state = {
      imgBaseUrl: 'https://elm.cangdu.org/img/',
      username:userInfo.username,  // 用户名
      resetname:'', // 重置用户名
      infotel:userInfo.mobile, // 用户手机
      avatar:userInfo.avatar,  // 用户头像
      show: false,  // 显示提示框
      isEnter:true, // 是否登录
      isLeave: false, // 是否退出
      showAlert: false,
      alertText: null,
    }
  }

  goBack = () => {
    this.props.history.goBack()
  }

  changePhone = () =>{
    this.setState({showAlert:true,alertText:'请在手机APP中设置'})
  }

  exitlogin = () => {
    this.setState({show:true,isEnter:true,isLeave:false})
  }

  waitingThing = () =>{
    clearTimeout(this.timer)
    this.setState({isEnter:false,isLeave:true})
    this.timer  = setTimeout(()=>{
      clearTimeout(this.timer)
      this.setState({show:false})
    },200)
  }
  
  outLogin = async () => {
    this.props.loginOut()
    this.waitingThing()
    const {history} = this.props
    history.go(-1)
    await API.signout()
  }

  uploadAvatar = async (value) => {
    const {userInfo} = this.props
    const {files} = this.fileInput.current
    // 上传头像
    if(userInfo && userInfo.user_id && files[0]) {
      let data = new FormData()
      data.append('file',files[0])
      const result = await API.uploadAvatar(userInfo.user_id,data)
      if(result.status===1){
        userInfo.avatar = result.image_path
        this.setState({userInfo})
        this.props.saveUserInfo(userInfo)
        this.props.saveAvander(result.image_path)
      }else{
        this.setState({showAlert:true,alertText:'上传失败'})
        throw new Error('上传失败');
      }
    }
  } 

  closeTip = () => {
    this.setState({showAlert:false})
  }

  render(){
    const { userInfo } = this.props
    const { imgBaseUrl, username,infotel, isEnter, isLeave, show, showAlert, alertText} = this.state
    return (
      <div className='rating_page'>
        <HeadTop headTitle='账户信息' goBack={this.goBack.bind(this)}></HeadTop>
        <section className='profile-info'>
          <section className='headportrait'>
            <input type="file" className='profileinfopanel-upload' ref={this.fileInput} onChange={this.uploadAvatar.bind(this)}/>
            <h2>头像</h2>
            <div className='headportrait-div'>
              {
                userInfo&&userInfo.user_id ? (
                  <img src={imgBaseUrl + userInfo.avatar} className='headportrait-div-top' alt="img is wrong"/>
                ) : (
                  <span className='headportrait-div-top'>
                    <svg viewBox="0 0 122 122">
                      <path fill="#DCDCDC" fillRule="evenodd" d="M61 121.5c33.413 0 60.5-27.087 60.5-60.5S94.413.5 61 .5.5 27.587.5 61s27.087 60.5 60.5 60.5zm12.526-45.806c-.019 3.316-.108 6.052.237 9.825 3.286 8.749 18.816 9.407 28.468 17.891-1.833 1.998-6.768 6.788-15 10.848-7.02 3.463-16.838 6.416-24.831 6.416-17.366 0-32.764-7.149-42.919-17.264 9.713-8.407 25.49-9.173 28.769-17.891.345-3.773.258-6.509.24-9.825l-.004-.002c-1.903-.985-5.438-7.268-6.01-12.571-1.492-.12-3.843-1.561-4.534-7.247-.37-3.053 1.107-4.77 2.004-5.31-5.046-19.212 1.507-33.16 20.749-34.406 5.753 0 10.18 1.52 11.909 4.523 15.35 2.702 11.756 22.658 9.328 29.882.899.54 2.376 2.258 2.004 5.31-.689 5.687-3.042 7.127-4.534 7.248-.575 5.305-3.25 10.82-5.873 12.57l-.003.003zM61 120.5C28.14 120.5 1.5 93.86 1.5 61S28.14 1.5 61 1.5s59.5 26.64 59.5 59.5-26.64 59.5-59.5 59.5z"></path>
                    </svg>
                  </span>
                )  
              }
              <span className='headportrait-div-bottom'>
                <svg fill="#d8d8d8" viewBox="0 0 1024 1024">
                  <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path> 
                </svg>
              </span>
            </div>
          </section>
          <Link to='/profile/info/setusername' className='info-router'>
            <section className='headportrait headportraitwo'>
              <h2>用户名</h2>
              <div className='headportrait-div'>
                <p>{username}</p>
                <span className='headportrait-div-bottom'>
                  <svg fill="#d8d8d8" viewBox="0 0 1024 1024">
                    <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path> 
                  </svg>
                </span>
              </div>
            </section>
          </Link>
          <Link to='/profile/info/address' className='info-router'>
            <section className='headportrait headportraitwo headportraithree'>
              <h2>收货地址</h2>
              <div className='headportrait-div'>
                <span className='headportrait-div-bottom'>
                  <svg fill="#d8d8d8" viewBox="0 0 1024 1024">
                    <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path> 
                  </svg>
                </span>
              </div>
            </section>
          </Link>
          <section className='bind-phone'>
            账号绑定
          </section>
          <section className='info-router' onClick={this.changePhone.bind(this)}>
            <section className='headportrait headportraitwo headportraithree'>
              <h2><img src={require('@/assets/images/bindphone.png')} style={{display:'inline-block',marginRight:'.4rem'}} alt=""/>手机</h2>
              <div className='headportrait-div-bottom'>
                <p>{infotel}</p>
                <span className="headportrait-div-bottom">
                  <svg fill="#d8d8d8" viewBox="0 0 1024 1024">
                    <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path> 
                  </svg>
                </span>
              </div>
            </section>
          </section>
          <section className='bind-phone'>安全设置</section>
          <Link to="/forget" className="info-router">
            <section className="headportrait headportraitwo headportraithree">
              <h2>登录密码</h2>
              <div className="headportrait-div">
                  <p>修改</p>
                  <span className="headportrait-div-bottom">
                    <svg fill="#d8d8d8" viewBox="0 0 1024 1024">
                      <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path> 
                    </svg>
                  </span>
              </div>
            </section>
          </Link>
          <section className="exitlogin" onClick={this.exitlogin.bind(this)}>退出登录</section>
        </section>
        {
          show ? (
            <section className='coverpart'>
              <section className='cover-background'></section>
              <section className={`cover-content ${isEnter ? 'cover-animate' : ''} ${isLeave ? 'cover-animate-leave' : ''}`}>
                <div className="sa-icon">
                  <span className="sa-body"></span>
                  <span className="sa-dot"></span>
                </div>
                <h2>是否退出登录</h2>
                <div className="sa-botton">
                  <button className='waiting' onClick={this.waitingThing.bind(this)}>再等等</button>
                  <div style={{display:'inline-block'}}>
                    <button className='quitlogin' onClick={this.outLogin.bind(this)}>退出登录</button>
                  </div>
                </div>
              </section>
            </section>
          ):null
        }
        {showAlert && <AlertTip closeTip={this.closeTip.bind(this)} alertText={alertText} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo || getStore('userInfo') || {},
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginOut: () =>dispatch(loginOut()),
    saveAvander: imgPath =>dispatch(saveAvander(imgPath)),
    saveUserInfo: userInfo=>dispatch(saveUserInfo(userInfo))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProfileInfo)