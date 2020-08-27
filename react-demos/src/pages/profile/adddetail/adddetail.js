/*
 * @Author: rh
 * @Date: 2020-08-26 09:22:35
 * @LastEditTime: 2020-08-26 14:38:02
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import HeadTop from '@/components/header/head';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import './adddetail.scss'
import { saveAddDetail } from '@/store/action'
import  API  from '@/api/api';

class AddDetail extends Component {

  state = {
    warning:true,
    inputAddress:'',
    addressList: [],  // 地址列表
  }

  inputChange = (name,event) => {
    const newState = {}
    const value = event.target.value
    newState[name] = value
    this.setState(newState)
  }

  inputThing = async () => {
    const { inputAddress } = this.state
    let addressList =[], warning = true
    const res = await API.searchNearby(inputAddress)
    addressList = res
    if(res.length > 0) {
      warning = false
      if(inputAddress===''){
        warning = true
        addressList = []
      }
    }
    this.setState({addressList:addressList, warning:warning})
  }

  listClick = (index)=>{
    const {addressList} = this.state
    this.props.saveAddDetail(addressList[index].name)
    this.props.history.go(-1)
  }
  
  render(){
    const { inputChange,inputThing,listClick } = this
    const { warning, inputAddress, addressList } = this.state
    return (
      <div className='rating_page'>
        <HeadTop headTitle='搜索地址' goBack={this.props.history.goBack.bind(this)}></HeadTop>
        <section>
          <div className='add-detail'>
            <input type="text" placeholder='请输入小区/写字楼/学校等'  value={inputAddress} onChange={inputChange.bind(this,'inputAddress')}/>
            <button onClick={inputThing.bind(this)}>确认</button>
          </div>
          <div className='warnpart'>为了满足商家得送餐要求，建议您从列表中选择地址</div>
          <div className='point' style={{display:warning?'block':'none'}}>
            <p>找不到地址？</p>
            <p>请尝试输入小区、写字楼或学校名</p>
            <p>详细地址（如门牌号）可稍后输入哦。</p>
          </div>
        </section>
        <section className='poisearch-container' style={{display:addressList?'block':'none'}}>
          <ul>
            {
              addressList&&addressList.map((v,i)=>(
                <li onClick={listClick.bind(this,i)} key={i}>
                  <p>{v.name}</p>
                  <p>{v.address}</p>
                </li>
              ))
            }
          </ul>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    addAddress: state.user.addAddress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveAddDetail: addDetail => dispatch(saveAddDetail(addDetail))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddDetail))