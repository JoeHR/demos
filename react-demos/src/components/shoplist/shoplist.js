/*
 * @Author: rh
 * @Date: 2020-08-31 13:48:49
 * @LastEditTime: 2020-08-31 19:38:38
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import './shoplist.scss'
import {withRouter, Link } from 'react-router-dom';
import Loading from '@/components/loading/loading'
import { CSSTransition } from 'react-transition-group';
import API from '@/api/api'
import {showBack, animate} from '@/utils/commons'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable';
import RatingStar from '@/components/ratingStar/ratingStar'

class ShopList extends Component {

  scrollRef = React.createRef()

  startx = 0
  starty = 0
  
  state = {
    offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
    shopListArr:[], // 店铺列表数据
    preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
    showBackStatus: false, //显示返回顶部按钮
    showLoading: true, //显示加载动画
    touchend: false, //没有更多数据
    imageBaseUrl: 'https://elm.cangdu.org/img/'
  }

  componentDidMount () {
    this.initData()
  }

  initData = async () => {
    const {longitude,latitude,restaurantCategoryId} = this.props
    const {offset} = this.state
    let res = await API.shopList(latitude,longitude,offset,restaurantCategoryId)
    this.setState({shopListArr:res})
    if(res.length<20){
      this.touchend = true
    }
    this.hideLoading()
    // 开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
    showBack(status=>{
      this.setState({showBackStatus:status})
    })
  }

  //到达底部加载更多数据
  loaderMore = async () => {
    const {touchend,preventRepeatReuqest} = this.state
    if(touchend){
      return 
    }
    // 防止重复请求
    if(preventRepeatReuqest){
      return
    }
    this.setState({showLoading:true,preventRepeatReuqest:true})

    // 数据的定位加20位
    this.setState({offset:this.state.offset + 20})
    const {longitude,latitude,restaurantCategoryId} = this.props
    let res = await API.shopList(latitude,longitude,this.state.offset,restaurantCategoryId)
    
    this.hideLoading()
    this.setState({shopListArr:[...this.state.shopListArr,...res]})

    // 当获取数据小于20，说明没有更多数据，不需要再次请求数据
    if(res.length<20){
      this.setState({touchend:true})
      return
    }
    this.setState({preventRepeatReuqest:false})
  }

  // 监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
  listenPropChange = async () => {
    const {longitude,latitude,restaurantCategoryIds,sortByType,deliveryMode,supportIds} = this.props
    this.setState({showLoading:true,offset:0})
    let res = await API.shopList(latitude,longitude,this.state.offset,'',restaurantCategoryIds,sortByType,deliveryMode,supportIds)
    this.hideLoading()
    // 考虑到本地模拟数据时引用类型，所以返回一个新的数据
    this.setState({shopListArr:[...res]})
  }

  //开发环境育编译环境loading隐藏方式不同
  hideLoading = () => {
    this.setState({showLoading:false})
  }

  zhunshi(supports){
    let zhunStatus;
    if ((supports instanceof Array) && supports.length) {
      supports.forEach(item => {
        if (item.icon_name === '准') {
          zhunStatus = true;
        }
      })
    }else{
      zhunStatus = false;
    }
    return zhunStatus
  }

  //返回顶部
  backTop(){
    animate(document.body, {scrollTop: '0'}, 400,'ease-out');
  }

  // 接触屏幕
  touchStart = (e) => {
    const {pageX,pageY} = e.touches[0]
    this.startx = pageX
    this.starty = pageY
  }

  // 离开屏幕
  touchEnd = (e)=>{
    const {pageX,pageY} = e.changedTouches[0]
    let endx,endy
    endx = pageX
    endy = pageY
    let direction = this.getDirection(this.startx,this.starty,endx,endy)
    switch(direction){
      case 0:
        console.log('未滑动')
        break;
      case 1:
        console.log('向上')
        this.loaderMore()
        break;
      case 3:
        console.log('向左')
        break;
      case 4:
        console.log('向右')
        break;
      default:
        break
    }
  }

  getDirection = (startx,starty,endx,endy) => {
    let angx = endx - startx
    let angy = endy - starty
    let result = 0

    // 如果滑动距离太短
    if(Math.abs(angx)<2 && Math.abs(angy) < 2) {
      return result
    }
    let angle = Math.atan2(angy,angx) * 180 /Math.PI
    if(angle >=-135 && angle <= -45){
      result = 1
    }else if(angle > 45 && angle < 135){
      result = 2
    }else if((angle >= 135 && angle <= 180) || (angle>=-180 && angle < -135)){
      result = 3
    }else if(angle >= -45 && angle <= 45 ){
      result = 4 
    }
    return result
    
  }

  getSnapshotBeforeUpdate(prevProps, prevState){
    const {restaurantCategoryIds,sortByType,confirmSelect} = this.props
    if(!is(fromJS(restaurantCategoryIds),fromJS(prevProps.restaurantCategoryIds))||!is(fromJS(sortByType),fromJS(prevProps.sortByType))||!is(fromJS(confirmSelect),fromJS(prevProps.confirmSelect))){
      this.listenPropChange()
    }
    return null;
  }

  render(){
    const {geohash} = this.props
    const {shopListArr,showBackStatus,showLoading,touchend,imageBaseUrl} = this.state
    const {zhunshi,backTop,touchStart,touchEnd} = this
    return (
      <div className='shoplist_container'>
        {
          shopListArr.length ? (
            <ul type='1' ref={this.scrollRef} onTouchStart={touchStart.bind(this)} onTouchEnd={touchEnd.bind(this)}>
              {
                shopListArr.map((item,index)=>(
                  <Link to={{pathname:'shop',query:{geohash,id:item.id}}} key={'shop_' + item.id + '_' +index} className='shop_li'>
                    <section>
                      <img src={imageBaseUrl + item.image_path} className='shop_img' alt=""/>
                    </section>
                    <hgroup className='shop_right'>
                      <header className='shop_detail_header'>
                        <h4 className={`shop_title ellipsis ${item.is_premium?'premium':''}`}>{item.name}</h4>
                        <ul className='shop_detail_ul'>
                          { 
                            item.supports.map(v=>(
                              <li key={'supports_' + v.id} className='supports'>{v.icon_name}</li>
                            ))
                          }
                        </ul>
                      </header>
                      <h5 className='rating_order_num'>
                        <section className='rating_order_num_left'>
                          <section className='rating_section'>
                            <RatingStar rating={item.rating} />
                            <span className='rating_num'>{item.rating}</span>
                          </section>
                          <section className='order_section'>
                            月售{item.recent_order_num}
                          </section>
                        </section>
                        <section className='rating_order_num_right'>
                          {
                            item.delivery_mode ? (
                            <span className='delivery_style delivery_left'>{item.delivery_mode.text}</span>
                            ):(
                              zhunshi(item.supports) ? (
                                <span className='delivery_style delivery_right'>准时达</span>
                              ):null
                            )
                          }
                        </section>
                      </h5>
                      <h5 className='fee_distance'>
                        <p className='fee'>
                          ￥{item.float_minimum_order_amount}起送
                          <span className='segmentation'>/</span>
                          {item.piecewise_agent_fee.tips}
                        </p>
                        <p className='distance_time'>
                          {
                            Number(item.distance) ? (
                              <span>{item.distance>1000?(item.distance/1000).toFixed(2) + 'km':item.distance + 'm'}
                                <span className='segmentation'></span>
                              </span>
                            ):(
                              <span>{item.distance}</span>
                            )
                          }
                          <span className='segmentation'>/</span>
                          <span className='order_time'>{item.order_lead_time}</span>
                        </p>
                      </h5>
                    </hgroup>
                  </Link>
                ))
              }
            </ul>
          ):(
            <ul className='animation_opactiy'>
              {
                Array.from({length:10},v=>v).map(
                  (m,ind)=>(
                    <li className='list_back_li' key={'pl_' + ind}>
                      <img src={require('@/assets/images/shopback.svg')} alt=""/>
                    </li>
                  )
                )
              }
            </ul>
          )
        }
        {
          touchend?(
            <p className='empty_data'>没有更多了</p>
          ):null
        }
        {
          showBackStatus ? (
            <aside className='return_top' onClick={backTop.bind(this)}>
              <svg className='back_top_svg' viewBox="0 0 32 32">
                <g fillRule="evenodd">
                  <circle cx="16" cy="16" r="15" stroke="#999" strokeWidth="0.6" fill="none"/>
                  <line x1="16" y1="10" x2="16" y2="21" style={{stroke:'#999',strokeWidth:0.8}}/>
                  <line x1="10" y1="10" x2="22" y2="10" style={{stroke:'#999',strokeWidth:0.8}}/>
                  <path d="M9.5 18 L16 10 L22.5 18" style={{stroke:'#999',strokeWidth:0.8,fill:'none'}}/>
                  <text x="10" y="27"  style={{fontSize:'6px',fill:'#999',fontWeight:700}}>顶部</text>
                </g>
              </svg>
            </aside>
          ):null
        }
        <div ref='abc' style={{backgroundColor:'red'}}></div>
        <CSSTransition className='loading' timeout={300} in={showLoading} unmountOnExit>
          <Loading></Loading>
        </CSSTransition>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    latitude: state.user.latitude,
    longitude: state.user.longitude
  }
}

export default withRouter(connect(mapStateToProps,null)(ShopList))
