/*
 * @Author: rh
 * @Date: 2020_08_18 11:39:22
 * @LastEditTime: 2020-08-27 14:31:18
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: _ 小驼峰式命名法（前缀应当是名词）
 * @常量: _ 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  _ 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import HeadTop from '@/components/header/head'
import Footer from '@/components/footer/footer'
import AlertTip from '@/components/alert_tip/alert_tip'
import QueueAnim from 'rc-queue-anim'
import { saveUserInfo } from '@/store/action'
import { getStore, getImgPath } from '@/utils/commons'
import API from '@/api/api'
import './profile.scss'

class Profile extends Component {
  static propTypes = {
    userInfo: propTypes.object.isRequired,
    saveUserInfo: propTypes.func.isRequired
  }

  headRef = React.createRef()

  state = {
    username:'登录/注册',
    mobile:' 暂无绑定手机',
    imgpath:'', // 图片路径
    balance: 0, // 我的余额
    count: 0, // 优惠券个数
    pointNumber: 0, // 积分数
    hasAlert: '', // tip 是否显示
    alertText:'请在手机APP中打开',
    imageUrl: 'https://elm.cangdu.org/img/'
  }

  // 初始化数据
  initData = () => {
    let newState = {}
    if (this.props.userInfo && this.props.userInfo.user_id) {
      newState.mobile = this.props.userInfo.mobile || ' 暂无手机绑定'
      newState.username = this.props.userInfo.username
      newState.balance = this.props.userInfo.balance
      newState.count = this.props.userInfo.gift_amount
      newState.pointNumber = this.props.userInfo.point
    } else {
      newState.mobile = ' 暂无手机绑定'
      newState.username = '登录/注册'
    }
    this.setState(newState)
  }

  handleClick = (type) => {
    let alertText
    switch (type) {
      case 'download':
        alertText = '请到官方网站下载'
        break
      case 'unfinished':
        alertText = '功能尚未开发'
        break
      default:
        break
    }
    this.setState({
      hasAlert: !this.state.hasAlert,
      alertText
    })
  }

  // 获取用户信息
  getUserInfo = async () => {
    const {imageUrl} = this.state
    let userInfo = await API.getUser({user_id: getStore('user_id')})
    userInfo.imgpath = userInfo.avatar ? imageUrl + userInfo.avatar : getImgPath()
    this.props.saveUserInfo(userInfo)
    this.initData()
  }

  goBack = () => {
    this.props.history.goBack()
  }

  componentDidMount () {
    if (!this.props.userInfo||!this.props.userInfo.user_id) {
      this.getUserInfo()
    } else {
      this.initData()
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (!is(fromJS(state.proData),fromJS(props.proData))) {
      this.initData()
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props),fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  }

  render () {
    const {userInfo} = this.props
    const {imageUrl} = this.state
    return (
      <div className='profile_page'>
          <HeadTop headTitle='我的' goBack={this.goBack.bind(this)} key='s1'></HeadTop>
          <section key='s2'>
            <section className='profile-number'>
              <Link to={userInfo && userInfo.user_id ? '/profile/info' : '/login'} className='profile-link'>
                {
                  userInfo && userInfo.user_id ?
                  (<img src={userInfo.avatar ? imageUrl + userInfo.avatar : getImgPath()} alt='img is wrong' className='privateImage' />)
                  :
                  (<span className='privateImage'>
                    <svg className="privateImage-svg" viewBox="0 0 122 122">
                      <path fill="#DCDCDC" fillRule="evenodd" d="M61 121.5c33.413 0 60.5-27.087 60.5-60.5S94.413.5 61 .5.5 27.587.5 61s27.087 60.5 60.5 60.5zm12.526-45.806c-.019 3.316-.108 6.052.237 9.825 3.286 8.749 18.816 9.407 28.468 17.891-1.833 1.998-6.768 6.788-15 10.848-7.02 3.463-16.838 6.416-24.831 6.416-17.366 0-32.764-7.149-42.919-17.264 9.713-8.407 25.49-9.173 28.769-17.891.345-3.773.258-6.509.24-9.825l-.004-.002c-1.903-.985-5.438-7.268-6.01-12.571-1.492-.12-3.843-1.561-4.534-7.247-.37-3.053 1.107-4.77 2.004-5.31-5.046-19.212 1.507-33.16 20.749-34.406 5.753 0 10.18 1.52 11.909 4.523 15.35 2.702 11.756 22.658 9.328 29.882.899.54 2.376 2.258 2.004 5.31-.689 5.687-3.042 7.127-4.534 7.248-.575 5.305-3.25 10.82-5.873 12.57l-.003.003zM61 120.5C28.14 120.5 1.5 93.86 1.5 61S28.14 1.5 61 1.5s59.5 26.64 59.5 59.5-26.64 59.5-59.5 59.5z"></path>
                    </svg>
                  </span>)
                }
                <div className='user-info'>
                  <p>{this.state.username}</p>
                  <p>
                    <span className='user-icon'>
                      <svg className="icon-mobile" fill="#fff" viewBox="0 0 655 1024">
                      <path d="M0 122.501v778.998C0 968.946 55.189 1024 123.268 1024h408.824c68.52 0 123.268-54.846 123.268-122.501V122.501C655.36 55.054 600.171 0 532.092 0H123.268C54.748 0 0 54.846 0 122.501zM327.68 942.08c-22.622 0-40.96-18.338-40.96-40.96s18.338-40.96 40.96-40.96 40.96 18.338 40.96 40.96-18.338 40.96-40.96 40.96zM81.92 163.84h491.52V819.2H81.92V163.84z"></path>
                      </svg>
                    </span>
                    <span className='icon-mobile-number'> {this.state.mobile}</span>
                  </p>
                </div>
                <span className='arrow'>
                <svg className="arrow-svg" fill="#fff" viewBox="0 0 1024 1024">
                  <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                </svg>
                </span>
              </Link>
            </section>
            <section className='info-data' key='i1'>
              <ul className='clear'>
                <Link to='/balance' className='info-data-link'>
                  <span className='info-data-top'><b>{parseInt(this.state.balance).toFixed(2)}</b>元</span>
                  <span className='info-data-bottom'>我的余额</span>
                </Link>
                <Link to='/balance' className='info-data-link'>
                  <span className='info-data-top'><b>{this.state.count}</b>个</span>
                  <span className='info-data-bottom'>我的优惠</span>
                </Link>
                <Link to='/balance' className='info-data-link'>
                  <span className='info-data-top'><b>{this.state.pointNumber}</b>分</span>
                  <span className='info-data-bottom'>我的积分</span>
                </Link>
              </ul>
            </section>
            <section className='profile-1reTe'>
              <QueueAnim deley='0.4'>
                <Link to='/order' className='myorder'>
                  <aside>
                    <svg fill="#4aa5f0" viewBox="0 0 40 40">
                      <path d="M31.5 3h-23C6 3 4 5.1 4 7.7v24.7C4 34.9 6 37 8.5 37h23c2.5 0 4.5-2.1 4.5-4.7V7.7C36 5.1 34 3 31.5 3zM11.8 28.2c-1.1 0-2-.9-2-2.1 0-1.1.9-2.1 2-2.1s2 .9 2 2.1c0 1.2-.9 2.1-2 2.1zm0-6.1c-1.1 0-2-.9-2-2.1 0-1.1.9-2.1 2-2.1s2 .9 2 2.1c0 1.1-.9 2.1-2 2.1zm0-6.2c-1.1 0-2-.9-2-2.1 0-1.1.9-2.1 2-2.1s2 .9 2 2.1c0 1.2-.9 2.1-2 2.1zm5.1 11.9h13.5v-2.6H16.9v2.6zm0-6.5h13.5v-2.6H16.9v2.6zm0-6.6h13.5v-2.6H16.9v2.6z"></path>
                    </svg>
                  </aside>
                  <div className='myorder-div'>
                    <span>我的订单</span>
                    <span className='myorder-divsvg'>
                      <svg fill="#bbb" viewBox="0 0 1024 1024">
                        <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
                <Link to='https://home.m.duiba.com.cn/#/chome/index' className='myorder'>
                  <aside>
                    <svg fill="#fc7b53" viewBox="0 0 40 40">
                      <path d="M34.6 7.1c0-1.1-1-2.1-2.1-2.1h-24c-1.1 0-2 1-2.1 2.1l-1.6 25C4.6 34.3 6.3 36 8.5 36h24c2.2 0 3.9-1.7 3.7-3.9l-1.6-25zm-5.9 6.1c-.2 4.6-3.7 8.2-8.3 8.2-4.6 0-8.2-3.7-8.4-8.3-.3-.2-.5-.6-.5-1 0-.7.6-1.2 1.3-1.2s1.3.6 1.3 1.2c0 .5-.3.9-.7 1.1.2 3.8 3.2 6.8 7.1 6.8 3.9 0 6.8-3.1 7-6.9-.4-.2-.6-.6-.6-1.1 0-.7.6-1.2 1.3-1.2s1.3.6 1.3 1.2c-.2.6-.4 1-.8 1.2z"></path>
                    </svg>
                  </aside>
                  <div className='myorder-div'>
                    <span>积分商城</span>
                    <span className='myorder-divsvg'>
                      <svg fill="#bbb" viewBox="0 0 1024 1024">
                        <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
                <Link to='/vipcard' className='myorder'>
                  <aside>
                    <svg fill="#ffc636" viewBox="0 0 40 40">
                      <path d="M7 33.4c0 1.1.9 1.6 2 1.6h22c1.1 0 2-.5 2-1.6V31H7v2.4z"></path><path d="M32.1 14.3c-.6 2.3-2.6 4-5.1 4-2.9 0-5.3-2.3-5.3-5.2v-.2c-.5.2-1 .3-1.6.3-.6 0-1.1-.1-1.7-.3v.2c0 2.9-2.4 5.2-5.3 5.2-2.5 0-4.6-1.7-5.1-4.1-.5.4-1.2.6-1.8.6-.3 0-.5.1-.8 0L7.2 29h26l1.7-14.2c-.3.1-.5.1-.8.1-.8 0-1.5-.2-2-.6z" className="st0"></path><ellipse cx="20.1" cy="8.2" rx="3.2" ry="3.2"></ellipse><ellipse cx="6.4" cy="10.5" rx="2.4" ry="2.4"></ellipse><ellipse cx="33.8" cy="10.5" rx="2.4" ry="2.4"></ellipse>
                    </svg>
                  </aside>
                  <div className='myorder-div'>
                    <span>饿了么会员卡</span>
                    <span className='myorder-divsvg'>
                      <svg fill="#bbb" viewBox="0 0 1024 1024">
                        <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </QueueAnim>
            </section>
            <section className='profile-1reTe'>
              <Link to='/service' className='myorder'>
                <aside>
                  <svg fill="#4aa5f0" viewBox="0 0 40 40">
                    <g id="service_XMLID_1_"><path id="service_XMLID_6_" d="M32.2 9.5c-.2-.7-.1-.7-.4-.9-1.7-1.2-5.3.2-6.7 1.9-.8-3.8-3.8-6.1-4.7-5.9-.9-.2-4 2.1-4.8 5.9-1.3-1.7-5-3.1-6.7-1.9-.1.1-.5.6-.5.7C5.4 20.7 15 24.6 19 25.7v8.7c0 .7.3 1.2 1 1.2s1-.5 1-1.2v-8.6c4-1 14.2-4.8 11.2-16.3z"></path><path id="service_XMLID_7_" d="M6 25c-.9 0-1.6.7-1.6 1.5.1.8.7 1.5 1.6 1.5 3.1 0 6.5 1.5 8.5 3.7.3.3.7.6 1.1.6.4 0 .7-.1 1-.4.6-.6.6-1.6.1-2.3C14.1 26.8 10 25 6 25z"></path><path id="service_XMLID_8_" d="M34.6 25c-4 0-8.1 1.9-10.7 4.6-.6.6-.5 1.6.1 2.2.3.3.7.4 1 .4.4 0 .8-.3 1.1-.6 2-2.1 5.3-3.7 8.4-3.7h.1c.8 0 1.5-.7 1.5-1.5 0-.7-.7-1.4-1.5-1.4z"></path></g><path d="M0 0h40v40H0z" className="st1"></path>
                  </svg>
                </aside>
                <div className='myorder-div'>
                  <span>服务中心</span>
                  <span className='myorder-divsvg'>
                    <svg fill="#bbb" viewBox="0 0 1024 1024">
                      <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                    </svg>
                  </span>
                </div>
              </Link>
              <Link to='/download' className='myorder'>
                <aside>
                  <svg fill="#3cabff" viewBox="0 0 40 40">
                    <path d="M30 5H10c-2.8 0-5 2.2-5 5v20c0 2.8 2.2 5 5 5h20c2.8 0 5-2.2 5-5V10c0-2.8-2.2-5-5-5zm-3.9 22.7c-.1.2-.3.4-.6.5-4.3 2.8-10.1 1.6-13-2.8-2.8-4.3-1.6-10.2 2.8-13 4.3-2.8 10.2-1.6 13 2.8.2.2.3.5.4.8.1.2 0 .5-.2.7l-8.8 5.7c-.2.2-.6.1-.7-.2l-.5-.7c-.4-.6-.2-1.5.4-1.9l5.6-3.6c.2-.2.3-.5.2-.7l-.1-.1c-2.2-1.8-5.4-2.1-7.9-.4-3.1 2-4 6.1-2 9.2 2 3.1 6.1 4 9.2 2 .6-.4 1.3-.2 1.7.4l.3.7c.1.2.4.5.2.6zm3.1-4.4l-.9.6c-.2.2-.6.1-.7-.2L26.5 22c-.2-.2-.1-.6.2-.7l1.8-1.1c.2-.2.6-.1.7.2l.6.9c.3.6.1 1.5-.6 2z"></path>
                  </svg>
                </aside>
                <div className='myorder-div'>
                  <span>下载饿了么APP</span>
                  <span className='myorder-divsvg'>
                    <svg fill="#bbb" viewBox="0 0 1024 1024">
                      <path d="M716.298 417.341l-.01.01L307.702 7.23l-94.295 94.649 408.591 410.117-408.591 410.137 94.295 94.639 502.891-504.76z" className="selected"></path>
                    </svg>
                  </span>
                </div>
              </Link>
            </section>
          </section>
          <Footer key='s3' />
        {/* </QueueAnim> */}
        {this.state.hasAlert && <AlertTip logout={()=>{return false}} closeTip={this.handleClick} alertText={this.state.alertText} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo||{}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: userInfo => dispatch(saveUserInfo(userInfo))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile)
