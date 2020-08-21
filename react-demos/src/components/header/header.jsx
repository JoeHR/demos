/*
 * @Author: rh
 * @Date: 2020-08-18 20:42:41
 * @LastEditTime: 2020-08-20 10:04:43
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import './header.scss'
import  PropTypes  from 'prop-types'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'

class Header extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    singUp: PropTypes.bool,
    goBack: PropTypes.func,
    goHome: PropTypes.func,
    edit: PropTypes.func,
    userInfo: PropTypes.object.isRequired
  }


  state = {
    headTitle: '首页'
  }

  handleBack = () => {
    this.props.goBack()
  }

  handleEdit = () => {
    this.props.edit()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(this.props),fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  } 

  render(){
    return (
      <header className='header-container'>
        {this.props.goBack && <div className='icon-back header-back' onClick={this.handleBack}></div>}
        <div className='header-title'>{this.props.title}</div>
        {
          this.props.singUp ? (this.props.userInfo ? <span className='icon-account user-avatar' onClick={this.props.goHome}></span>
          : <span>登录|注册</span>) : ''
        }
        {this.props.edit && <div className='user-avatar' onClick={this.handleEdit}></div>}
        {this.props.userInfo.operate === 'edit' ? '编辑':'完成'}
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProps,{})(Header)
