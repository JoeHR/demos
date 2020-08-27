/*
 * @Author: rh
 * @Date: 2020-08-25 15:40:00
 * @LastEditTime: 2020-08-27 13:53:11
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import HeadTop from '@/components/header/head';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import AlertTip from '@/components/alert_tip/alert_tip';
import { connect } from 'react-redux'
import { saveAddAddress,saveAddressPage } from '@/store/action'
import { getStore } from '@/utils/commons'
import API from '@/api/api'
import './addaddress.scss'

class AddAddress extends Component{
  constructor(props){
    super(props)
    this.state = {
      verify:false,			//姓名
      verifythree:false,		//地址
      verifyfour:false,		//电话
      verifyfive:false,		//备用电话
      butpart: false,			//新增地址按钮的透明度
      sendaddress:'',  //地址
      message:'', //信息
      mesthree:'', //送餐地址
      telenum:'', //手机号
      telephone:'', //手机号提示
      standbytele:'', //备用手机号提示 
      standbytelenum:'', //备用手机号
  
      addSearch:false, //添加搜索地址
      newAddress:{},			//增加数组的元素
      showAlert: false, //弹出框
      alertText: null, //弹出信息
    }
  }

  componentWillUnmount () {
    this.props.saveAddressPage({
      butpart:this.state.butpart,			//新增地址按钮的透明度        
      sendaddress:this.state.sendaddress,  //地址
      message:this.state.message, //姓名
      mesthree:this.state.mesthree, //送餐地址
      telenum:this.state.telenum, //手机号
      telephone:this.state.telephone, //手机号提示
      standbytele:this.standbytele, //备用手机号提示 
      standbytelenum:this.standbytelenum, //备用手机号
    })
  }

  inputChange = (name,event) => {
    const {message,mesthree,verifyfour} = this.state
    const newState = {}
    const value = event.target.value
    newState[name] = value
    if(name==='message'){
      newState['verify'] = value ? true : false
    }else if(name === 'mesthree') {
      if(value.length===0){
        newState['verifythree'] = true
        newState['sendaddress'] = '请详细填写送餐地址'
      }else if(value.length> 0 && value.length <= 2) {
        newState['verifythree'] = true
        newState['sendaddress'] = '送餐地址太短了，不能辨识'
      }else{
        newState['verifythree'] = false
        newState['sendaddress'] = ''
      }
    }else if(name === 'telenum'){
      if(/^[1][358][0-9]{9}$/.test(value)){
        newState['verifyfour'] = false
        newState['telephone'] = ''
      }else if(value.length===0){
        newState['verifyfour'] = true
        newState['telephone'] = '手机号不能为空'
      }else{
        newState['verifyfour'] = true
        newState['telephone'] = '请输入正确的手机号'
      }
    }else if(name === 'standbytelenum') {
      if(/^[1][358][0-9]{9}$/.test(value)){
        newState['verifyfive'] = false
        newState['standbytele'] = ''
      }else{
        newState['verifyfive'] = true
        newState['standbytele'] = '请输入正确的手机号'
      }
    }
    if(message&&mesthree&&!verifyfour){
      newState['butpart'] = true
    }else{
      newState['butpart'] = false
    }
    this.setState(newState)
  }

  submitThing = async () => {
    const {userInfo,addAddress,geohash} = this.props
    const {mesthree,message,telenum,standbytelenum,butpart} = this.state
    const res = await API.postAddAddress(userInfo.user_id,mesthree,addAddress,geohash,message,telenum,standbytelenum,0,1,'公司',4)
    if(res.message){
      this.setState({showAlert:true,alertText:res.message})
    }else if(butpart){
      this.props.saveAddAddress({
        name: message,
        address: mesthree,
        address_detail: addAddress,
        geohash:'wtw37r7cxep4',
        phone: telenum,
        phone_bk: standbytelenum,
        poi: addAddress,
        poi_type: 0,
      })
      this.props.history.go(-1)
    }
  }


  render(){
    const {inputChange,submitThing,} = this
    const { addAddress } = this.props
    const {verfify,verifythree,
          verifyfour,verifyfive,
          telephone,sendaddress,alertText,
          showAlert,butpart,standbytele} = this.state
    return (
      <div className='rating_page'>
        <HeadTop headTitle='新增地址' goBack={this.props.history.goBack.bind(this)}></HeadTop>
        <section className='adddetail'>
          <form>
            <section className='ui-padding-block'>
              <div className='input-new'>
                <input type="text" placeholder='请填写你的姓名' defaultValue={this.props.address.message} className={verfify?'verifies':''}  onChange={inputChange.bind(this,'message')}/>
                {
                  verfify ? (<p>请填写您的姓名</p>) :null
                }
              </div>
                <Link to='/profile/info/address/add/addDetail' className='add-detail'>
                  <div className='input-new'>
                    <input type="text" placeholder='小区/写字楼/学校等' readOnly='readonly' value={addAddress}/>
                  </div>
                </Link>
                <div className='input-new'>
                  <input type="text" placeholder='请填写详细送餐地址' defaultValue={this.props.address.mesthree} className={verifythree?'verifies':''} onChange={inputChange.bind(this,'mesthree')}/>
                  {
                    verifythree ? (<p>{sendaddress}</p>) :null
                  }
                </div>
                <div className='input-new'>
                  <input type="text" placeholder='请填写能够联系到您的手机号' defaultValue={this.props.address.telenum} className={verifyfour?'verifies':''} onChange={inputChange.bind(this,'telenum')}/>
                  {
                    verifyfour ? (<p>{telephone}</p>) :null
                  }
                </div>
                <div className='input-new'>
                  <input type="text" placeholder='备用联系电话（选填）'  defaultValue={this.props.address.standbytelenum} onChange={inputChange.bind(this,'standbytelenum')}/>
                  {
                    verifyfive ? (<p>{standbytele}</p>) :null
                  }
                </div>
            </section>
          </form>
            <section className='addbutton'>
              <button className={butpart?'butopacity':''} onClick={submitThing.bind(this)}>新增地址</button>
            </section>
        </section>
        {showAlert && <AlertTip closeTip={()=>this.setState({showAlert:false})} alertText={alertText} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo:state.userInfo || getStore('userInfo') || {},
    addAddress:state.user.addAddress,
    removeAddress:state.user.removeAddress,
    newAddress: state.user.newAddress,
    geohash: state.user.geohash,
    address: state.address
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveAddAddress: addAddress => dispatch(saveAddAddress(addAddress)),
    saveAddressPage: address => dispatch(saveAddressPage(address))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddAddress))
