/*
 * @Author: rh
 * @Date: 2020-08-20 17:05:14
 * @LastEditTime: 2020-08-21 16:09:49
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React ,{ Component } from 'react'
import HeadTop from '@/components/header/head'
import './login.scss'
import { Link } from 'react-router-dom'
import AlertTip from '@/components/alert_tip/alert_tip'
import  API from '@/api/api';
import { connect } from 'react-redux';
import { saveUserInfo } from '@/store/action';

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginWay: false, //登录方式，默认短信登录
      showPassword: false, // 是否显示密码
      phoneNumber: '', //电话号码
      mobileCode: '', //短信验证码
      validate_token: '', //获取短信时返回的验证值，登录时需要
      computedTime: 0, //倒数记时
      userInfo: null, //获取到的用户信息
      userAccount: '', //用户名
      passWord: '', //密码
      captchaCodeImg: null, //验证码地址
      codeNumber: '', //验证码
      showAlert: false, //显示提示组件
      alertText: null, //提示的内容
    }
    this.getCaptchaCode()
  }

  get rightPhoneNumber () {
    return /^1\d{10}$/gi.test(this.state.phoneNumber)
  }

  inpChange = (name,event) => {
    const newState = {}
    newState[name] = event.target.value
    this.setState(newState)
  }

  getVerifyCode = async () =>{
    if(this.rightPhoneNumber){
      // 30秒倒计时
      let computedTime = 30
      this.setState({computedTime:computedTime})
      setTimeout(function countDown(){
        computedTime--
        this.setState({computedTime:30})
        if(computedTime>=0){
          setTimeout(countDown, 500)
        } 
      },500)

      // 判断用户是否存在
      let res = await API.checkExist(this.state.phoneNumber,'mobile')
      if(res.message){
        this.setState({showAlert:true,alertText:res.message})
        return 
      }else if(res.is_exists){
        this.setState({showAlert:true,alertText:'您输入的手机号尚未绑定'})
        return
      }

      // 发送短信验证码
      let result = await API.mobileCode(this.state.phoneNumber)
      if(result.message){
        this.setState({showAlert: true,alertText: result.message})
        return
      }
      this.setState({validate_token:result.validate_token})
    }
  }

  changePassWordType(){
    const { showPassword } = this.state
    this.setState({showPassword:!showPassword})
  }

  getCaptchaCode = async () =>{
    const res = await API.getcaptchas()
    this.setState({captchaCodeImg:res.code})
  }

  closeTip = () => {
    this.setState({showAlert:false})
  }

  mobileLogin = async () => {
    let userInfo = null
    if(this.state.loginWay){

      if(!this.rightPhoneNumber){
        this.setState({showAlert:true,alertText:'手机号码不正确'})
        return 
      }else if(!(/^\d{6}$/gi.test(this.state.mobileCode))){
        this.setState({showAlert:true,alertText:'短信验证码不正确'})
      }

      // 手机号登录
      userInfo = await API.sendLogin(this.state.mobileCode,this.state.phoneNumber,this.state.validate_token)
      this.setState({userInfo:userInfo})

    }else{
      
      if (!this.state.userAccount) {
        this.setState({showAlert:true, alertText: '请输入手机号/邮箱/用户名'})
        return
      } else if (!this.state.passWord) {
        this.setState({showAlert:true, alertText: '请输入密码'})
        return 
      } else if (!this.state.codeNumber) {
        this.setState({showAlert:true, alertText: '请输入验证码'})
        return
      }

      // 用户名登录
      userInfo = await API.accountLogin(this.state.userAccount,this.state.passWord,this.state.codeNumber)
      this.setState({userInfo:userInfo})
    }

    // 如果返回得值不正确，则弹出提示框，返回的值正确则返回上一页
    if(!userInfo.user_id) {
      this.setState({showAlert:true, alertText:userInfo.message})
      if(!this.state.loginWay) this.getCaptchaCode()
    }else{
      this.props.saveUserInfo(userInfo)
      this.props.history.go(-1)
    }
  }

  render(){
    const { loginWay, phoneNumber, mobileCode, userAccount, passWord, showPassword, computedTime, codeNumber, captchaCodeImg, showAlert, alertText } = this.state
    const {changePassWordType,  getVerifyCode, inpChange, getCaptchaCode, closeTip, mobileLogin} = this
    return (
      <div className='loginContainer'>
        <HeadTop headTitle={loginWay? '登录':'密码登录'} goBack={true} />
        {
          loginWay ? (
            <form className='loginForm'>
              <section className='input_container phone_number'>
                <input type='text' placeholder='账户密码随便输入' name='phone' maxLength='11' value={phoneNumber} onChange={inpChange.bind(this,'phone')}/>
                <button onClick={getVerifyCode} className={{right_phone_number:this.rightPhoneNumber}}>{!computedTime?'获取验证码':'已发送'}</button>
              </section>
              <section className='input_container'>
                <input type='text' placeholder='验证码' name='mobileCode' maxLength='6' value={mobileCode} onChange={inpChange.bind(this,'mobileCode')} />
              </section>
            </form>
          ) : (
            <form className='loginForm'>
              <section className='input_container'>
                <input type='text' placeholder='账号' value={userAccount} autoComplete='new-password' name='userAccount' onChange={inpChange.bind(this,'userAccount')}/>
              </section>
              <section className='input_container'>
                <input type={showPassword?'text':'password'} name='password' autoComplete='new-password'  placeholder='密码' value={passWord} onChange={inpChange.bind(this,'passWord')}/>
                <div className={`button_switch ${showPassword?'change_to_text':''}`} onClick={changePassWordType.bind(this)}>
                    <div className={`circle_button ${showPassword?'trans_to_right':''}`}></div>
                    <span>abc</span>
                    <span>...</span>
                </div>
              </section>
              <section className='input_container captcha_code_container'>
                <input type="text" placeholder='验证码' maxLength='4' value={codeNumber} onChange={inpChange.bind(this,'codeNumber')}/>
                <div className='img_change_img'>
                  <img src={captchaCodeImg} style={{display:captchaCodeImg}} alt=''/>
                  <div className='change_img' onClick={getCaptchaCode}>
                    <p>看不清</p>
                    <p>换一张</p>
                  </div>
                </div>
              </section>
            </form>
          )
        }
        <p className='login_tips'>温馨提示：未注册过得账号，登录时将自动注册</p>
        <p className='login_tips'>注册过的用户可凭账号密码登录</p>
        <div className="login_container" onClick={mobileLogin.bind(this)}>登录</div>
        {
          !loginWay?
          <Link to='/forget' className='to_forget'>重置密码?</Link>:null
        }
        {showAlert && <AlertTip showHide={showAlert} closeTip={closeTip.bind(this)} alertText={alertText} />}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: userInfo => dispatch(saveUserInfo(userInfo))
  }
}

export default connect(null,mapDispatchToProps)(Login)