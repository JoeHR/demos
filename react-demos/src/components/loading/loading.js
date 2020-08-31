/*
 * @Author: rh
 * @Date: 2020-08-31 15:15:23
 * @LastEditTime: 2020-08-31 15:57:59
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React from 'react'
import './loading.scss'

class Loading extends React.Component{

  state = {
    positionY:0,
    timer: null
  }

  componentDidMount(){
    let timer = setInterval(()=>{
      let {positionY} = this.state 
      this.setState({positionY:positionY++})
    },600)
    this.setState({timer:timer})
  }

  componentWillUnmount(){
    let {timer} = this.state
    clearInterval(timer)
    timer = null
    this.setState({timer})
  }

  render(){
    const {positionY} = this.state
    return (
      <div className='loading_container'>
        <div className="load_img" style={{backgroundPositionY: -(positionY%7)*2.5 + 'rem'}}></div>
        <svg className='load_ellipse' xmlns="http://www.w3.org/2000/svg" version="1.1">
          <ellipse cx="26" cy="10" rx="26" ry="10" style={{fill:'#ddd',stroke:'none'}}></ellipse>
        </svg>
      </div>
    )
  }
}

export default Loading