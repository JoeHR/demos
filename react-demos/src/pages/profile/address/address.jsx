/*
 * @Author: rh
 * @Date: 2020-08-25 14:34:08
 * @LastEditTime: 2020-08-27 13:52:20
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, { Component } from 'react'
import HeadTop from '@/components/header/head';
import { Link } from 'react-router-dom';
import API from '@/api/api'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getStore } from '@/utils/commons'
import { saveRemoveAddress } from '@/store/action'
import './address.scss'

class Address extends Component {

  state={
    deletesite:false, // 是否编辑状态
    editText:'编辑',
  }

  editThing = () => {
    const { editText } = this.state
    if(editText === '编辑') {
      this.setState({editText:'完成',deletesite:true})
    }else{
      this.setState({editText:'编辑',deletesite:false})
    }
  }

  deleteSite = async (index,item) => {
    const {userInfo,removeAddress} = this.props
    if(userInfo && userInfo.user_id){
      await API.deleteAddress(userInfo.user_id,item.id)
      removeAddress.splice(index,1)
      this.props.saveRemoveAddress(removeAddress)
    }
  }

  render(){
    const { editThing } = this
    const { editText,deletesite} = this.state
    const { removeAddress } = this.props
    return (
      <div className='rating_page'> 
        <HeadTop headTitle='编辑地址' goBack={this.props.history.goBack.bind(this)} edit={
          <span className='edit' onClick={editThing.bind(this)}>{editText}</span>
        }></HeadTop>
        <section className='address'>
          <ul className='addresslist'>
            {
              removeAddress.map((v,i)=>(
                <li kye={i}>
                  <div>
                    <p>{v.address}</p>
                    <p><span>{v.phone}</span>{v.phonepk?<span>、{v.phonepk}</span>:null}</p>
                  </div>
                  {
                    deletesite?(
                      <div className='deletesite'>
                        <span onClick={()=>this.deleteSite(i,v)}>x</span>
                      </div>
                    ):null
                  }
                </li>
              ))
            }
          </ul>
          <Link to='/profile/info/address/add'>
            <div className='addsite'>
              <span>新增地址</span>
              <span className='addsvg'>
                <svg fill='#d8d8d8' viewBox="0 0 1024 1024">
                  <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                </svg>
              </span>
            </div>
          </Link>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo || getStore('userInfo') || {},
    removeAddress: state.user.removeAddress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveRemoveAddress: (removeAddress) => dispatch(saveRemoveAddress(removeAddress))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Address))