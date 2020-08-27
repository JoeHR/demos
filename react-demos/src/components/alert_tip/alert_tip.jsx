/*
 * @Author: rh
 * @Date: 2020-08-18 20:57:11
 * @LastEditTime: 2020-08-24 11:19:02
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
  
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './alert_tip.scss'

class AlertTip extends Component {
  static propTypes = {
    alertText: PropTypes.string.isRequired,  // 提示内容
    closeTip: PropTypes.func.isRequired,   // 关闭
  }
  
  render () {
    return (
      <div className='alert-container'>
        <section className='tip-text-container'>
          <div className='tip-icon'>
            <span></span>
            <span></span>
          </div>
          <div className='tip-text'>{this.props.alertText}</div>
          <div className='confirm' onClick={this.props.closeTip}>确认</div>
        </section>
      </div>
    )
  }
}

export default AlertTip