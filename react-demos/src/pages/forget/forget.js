/*
 * @Author: rh
 * @Date: 2020-08-28 10:55:14
 * @LastEditTime: 2020-08-28 15:55:37
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import HeadTop from '@/components/header/head';
import AlertTip from '@/components/alert_tip/alert_tip';
import './forget.scss'
import { withRouter } from 'react-router-dom';
import API from '@/api/api'

class Forget extends Component {

  state = {
    phoneNumber: null, //电话号码
    oldPassWord: null,
    newPassWord: null, //新密码
    confirmPassWord: null, //确认密码
    captchaCodeImg: null, //验证码地址
    mobileCode: null, //短信验证码
    computedTime: 0, //倒数记时
    showAlert: false, //显示提示组件
    alertText: null, //提示的内容
    accountType: 'mobile',//注册方式
  }

  componentWillMount () {
    this.getCaptchaCode()
  }

  inputChange = (name,event) => {
    const newState = { }
    const value = event.target.value
    newState[name] = value
    this.setState(newState)
  }

  getCaptchaCode =async () => {
    let res = await API.getcaptchas()
    if(res.code){
      this.setState({captchaCodeImg:res.code})
    }
  }

  async resetButton () {
    const {phoneNumber,oldPassWord,newPassWord,confirmPassWord,mobileCode} = this.state
    if(!phoneNumber){
      this.setState({showAlert:true,alertText:'请输入正确得账号'})
      return
    }else if(!oldPassWord) {
      this.setState({showAlert:true,alertText:'请输入旧密码'})
      return
    }else if(!newPassWord){
      this.setState({showAlert:true,alertText:'请输入新密码'})
      return 
    }else if(!confirmPassWord){
      this.setState({showAlert:true,alertText:'请输入确认密码'})
      return 
    }else if(confirmPassWord !== newPassWord){
      this.setState({showAlert:true,alertText:'两次输入得密码不一致'})
      return 
    } else if(!mobileCode) {
      this.setState({showAlert:true,alertText:'请输入验证码'})
      return
    }
    let res = await API.changePassword(phoneNumber,oldPassWord,newPassWord,confirmPassWord,mobileCode)
    if(res.message){
      this.setState({showAlert:true,alertText:res.message})
      this.getCaptchaCode()
    }else{
      this.setState({showAlert:true,alertText:'密码修改成功'})
    }
  }

  closeTip(){
    this.setState({showAlert:false})
  }
  
  render(){
    const {inputChange,getCaptchaCode,resetButton,closeTip} = this
    const { alertText, showAlert, captchaCodeImg} = this.state
    return (
      <div className='restContainer'>
        <HeadTop headTitle='重置密码' goBack={this.props.history.goBack.bind(this)}></HeadTop>
        <form className='restForm'>
          <section className='input_container phone_number'>
            <input type="text" placeholder='账号' name='phone' maxLength='11' onChange={inputChange.bind(this,'phoneNumber')}/>
          </section>
          <section className="input_container">
            <input type="text" placeholder='旧密码' name='oldPassWord' onChange={inputChange.bind(this,'oldPassWord')}/>
          </section>
          <section className="input_container">
            <input type="text" placeholder='请输入新密码' name='newPassWord' onChange={inputChange.bind(this,'newPassWord')}/>
          </section>
          <section className="input_container">
            <input type="text" placeholder='请确认密码' name='confirmPassWord' onChange={inputChange.bind(this,'confirmPassWord')}/>
          </section>
          <section className="input_container captcha_code_container">
            <input type="text" placeholder='验证码' name='mobileCode' maxLength='6' onChange={inputChange.bind(this,'mobileCode')}/>
            <div className="img_change_img">
              {
                captchaCodeImg ? (<img src={captchaCodeImg} alt=''/>) : null
              }
              <div className="change_img" onClick={getCaptchaCode.bind(this)}>
                <p>看不清</p>
                <p>换一张</p>
              </div>
            </div>
          </section>
        </form>
        <div className="login_container" onClick={resetButton.bind(this)}>确认修改</div>
        {showAlert ? (<AlertTip closeTip={closeTip.bind(this)} alertText={alertText} />) : null}
      </div>
    )
  }
}

export default withRouter(Forget)