/*
 * @Author: rh
 * @Date: 2020-09-01 09:22:42
 * @LastEditTime: 2020-09-04 15:11:35
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import RatingStar from '@/components/ratingStar/ratingStar'
import { getImgPath } from '@/utils/commons'
import BuyCart from '@/components/buycart/buycart'
import { connect } from 'react-redux'
import API from '@/api/api'
import { saveUserAddress, clearCart } from '@/store/action'
import './shop.scss'
import BScroll from 'better-scroll'

class Shop extends Component {

  cartContainerRef = React.createRef()

  menuFoodListRef = React.createRef()

  wrapperMenuRef = React.createRef()

  constructor(props) {
    super(props)
    const { location } = props
    const { query = {} } = location
    this.foodScroll = null
    this.state = {
      showLoading: false, //显示加载动画
      changeShowType: 'food',//切换显示商品或者评价
      shopDetailData: {}, //商铺详情
      showActivities: false, //是否显示活动详情
      menuList: [], //食品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
      shopListTop: [], //商品列表的高度集合
      TitleDetailIndex: null, //点击展示列表头部详情
      categoryNum: [], //商品类型右上角已加入购物车的数量
      totalPrice: 0, //总共价格
      cartFoodList: [], //购物车商品列表
      showCartList: false,//显示购物车列表
      receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
      ratingList: null, //评价列表
      ratingOffset: 0, //评价获取数据offset值
      ratingScoresData: {}, //评价总体分数
      ratingTagsList: null, //评价分类列表
      ratingTageIndex: 0, //评价分类索引
      preventRepeatRequest: false,// 防止多次触发数据请求
      ratingTagName: '',//评论的类型
      loadRatings: false, //加载更多评论是显示加载组件
      foodScroll: null,  //食品列表scroll
      showSpecs: false,//控制显示食品规格
      specsIndex: 0, //当前选中的规格索引值
      choosedFoods: null, //当前选中视频数据
      showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
      showMoveDot: [], //控制下落的小圆点显示隐藏
      windowHeight: null, //屏幕的高度
      elLeft: 0, //当前点击加按钮在网页中的绝对top值
      elBottom: 0, //当前点击加按钮在网页中的绝对left值
      ratingScroll: null, //评论页Scroll
      imgBaseUrl: 'https://elm.cangdu.org/img/',
      promotionInfo: '欢迎光临，用餐高峰期请提前下单，谢谢',
      totalNum: 0,
      shopCart: null,
      minimumOrderAmount: null,
      deliveryFee: null,
      geohash: query.geohash,
      shopId: query.id
    }
  }

  componentDidMount () {
    this.initData()

  }

  initData = async () => {
    if (!this.props.latitude) {
      // 获取位置信息
      let res = await API.msiteAddress(this.props.geohash)
      this.props.save_user_address(res)
      console.log('Shop -> initData -> res', res)
      // 记录当前经度维度 进入 redux
    }
    // 获取商铺信息
    const shopDetailData = await API.shopDetails(this.state.shopId, this.props.latitude, this.props.longitude)
    this.setState({ shopDetailData: shopDetailData })
    // 获取商铺食品列表
    const menuList = await API.foodMenu(this.state.shopId)
    this.setState({ menuList: menuList },()=>{
      this.getFoodListHeight()
    })
    // 获取评论列表
    const ratingList = await API.getRatingList(this.state.shopId, this.state.ratingOffset)
    this.setState({ ratingList: ratingList })
    // 获取商铺评论详情
    const ratingScoreData = await API.ratingScores(this.state.shopId)
    this.setState({ ratingScoresData: ratingScoreData })
    // 获取评论 tag 列表
    const ratingTagsList = await API.ratingTags(this.state.shopId)
    this.setState({ ratingTagsList: ratingTagsList })
  }

  goback = () => {
    this.props.history.goBack()
  }

  showActivitiesFun = () => {
    this.setState({ showActivities: !this.state.showActivities })
  }

  toggleCartList = () => {
    this.setState({ showCartList: this.state.cartFoodList.length ? !this.state.showCartList : true })
  }

  clearCart = () => {
    this.toggleCartList()
    this.props.clearCart(this.state.shopId)
  }

  chooseMenu = (index) => {
    this.setState({ menuIndex: index, menuIndexChange: false })
    this.foodScroll.scrollTo(0, -this.state.shopListTop[index], 400)
    this.foodScroll.on('scrollEnd', () => {
      this.setState({menuIndexChange:true})
    })
  }

  showTitleDetail = (index) => {
    const { TitleDetailIndex } = this.state
    if (TitleDetailIndex === index) {
      this.setState({ TitleDetailIndex: null })
    } else {
      this.setState({ TitleDetailIndex: index })
    }
  }

  cartContainerHandler = () => {
    this.setState({ receiveInCart: false })
  }

  // 监听原点是否进入购物车
  listenInCart = () => {
    const { receiveInCart } = this.state
    if (!receiveInCart) {
      this.setState({ receiveInCart: true })
      this.cartContainerRef.current.addEventListener('animationend', this.cartContainerHandler)
      this.cartContainerRef.current.addEventListener('webkitAnimationEnd', this.cartContainerHandler)
    }
  }

  changeTgeIndex = async (index, name) => {
    this.setState({ ratingTageIndex: index, ratingTagName: name, ratingOffset: 0 })
    let res = await API.getRatingList(this.state.shopId, this.state.ratingOffset, name)
    this.setState({ ratingList: [...res] })
  }

  getImgPath = (path) => {
    let suffix
    if (!path) {
      return 'https://elm.cangdu.org/img/default.jpg'
    }
    if (path.indexOf('jpeg') !== -1) {
      suffix = '.jpeg'
    } else {
      suffix = '.png'
    }
    let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix
    return 'https://fuss10.elemecdn.com' + url
  }

   //获取食品列表的高度，存入shopListTop
   getFoodListHeight(){
    const listContainer = this.menuFoodListRef.current
    const shopListTop  = []
    if (listContainer) {
      const listArr = Array.from(listContainer.children[0].children);
      listArr.forEach((item, index) => {
          shopListTop[index] = item.offsetTop;
      })
      this.setState({shopListTop:shopListTop})
      this.listenScroll(listContainer)
    }
  }

  //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
  listenScroll = (element) => {
    this.foodScroll = new BScroll(element,{
      probeType: 3,
      deceleration: 0.001,
      bounce: false,
      swipeTime: 2000,
      click: true,
    })

    const wrapperMenu = new BScroll('#wrapper_menu', {
      click: true,
    })

    const wrapMenuHeight = this.wrapperMenuRef.current.clientHeight
    this.foodScroll.on('scroll',(pos)=>{
      if(!this.wrapperMenuRef){
        return
      }

      this.state.shopListTop.forEach((item,index)=>{
        if(this.state.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
          this.setState({menuIndex: index})
          const menuList = this.wrapperMenuRef.current.querySelectorAll('.activity_menu')
          const el = menuList[0]
          wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
        }
      })
    })


  }

  componentWillUnmount () {
    this.cartContainerRef.current.removeEventListener('animationend', this.cartContainerHandler)
    this.cartContainerRef.current.removeEventListener('webkitAnimationEnd', this.cartContainerHandler)
  }

  render () {
    const { showLoading, changeShowType, shopDetailData, showActivities, menuList, menuIndex, promotionInfo, ratingTageIndex, TitleDetailIndex, categoryNum, totalPrice, cartFoodList, showCartList, receiveInCart, ratingList, minimumOrderAmount, ratingScoresData, ratingTagsList, imgBaseUrl, totalNum, deliveryFee, geohash, shopId } = this.state
    const { showActivitiesFun, changeTgeIndex, goback, getImgPath, chooseMenu, showTitleDetail, listenInCart, showChooseList, showReduceTip, showMoveDotFun, toggleCartList, clearCart, removeOutCart, addToCart } = this
    return (
      <div>
        {
          !showLoading && (<section className='shop_container'>
            <nav className='goback' onClick={goback.bind(this)}>
              <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style={{ fill: 'none', stroke: 'rgb(255,255,255)', strokeWidth: 3 }} />
              </svg>
            </nav>
            <header className='shop_detail_header' style={{ zIndex: showActivities ? '14' : '10' }}>
              <div className="header_cover_img_con">
                <img src={imgBaseUrl + shopDetailData.image_path} className='header_cover_img' alt="" />
              </div>
              <section className='description_header'>
                <Link to='/shop/shopDetail' className='description_top'>
                  <section className='description_left'>
                    <img src={imgBaseUrl + shopDetailData.image_path} alt="" />
                  </section>
                  <section className="description_right">
                    <h4 className="description_title ellipsis">{shopDetailData.name}</h4>
                    <p className="description_text">商家配送／{shopDetailData.order_lead_time}分钟送达／配送费¥{shopDetailData.float_delivery_fee}</p>
                    <p className="description_promotion ellipsis">公告：{promotionInfo}</p>
                  </section>
                  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" className="description_arrow" >
                    <path d="M0 0 L8 7 L0 14" stroke="#fff" strokeWidth="1" fill="none" />
                  </svg>
                </Link>
                {
                  shopDetailData.activities && shopDetailData.activities.length && (
                    <footer className="description_footer" onClick={showActivitiesFun.bind(this)}>
                      <p className="ellipsis">
                        <span className="tip_icon" style={{ backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color }}>{shopDetailData.activities[0].icon_name}</span>
                        <span>{shopDetailData.activities[0].description}（APP专享）</span>
                      </p>
                      <p>{shopDetailData.activities.length}个活动</p>
                      <svg className="footer_arrow" viewBox="0 0 14 14">
                        <path d="M0 0 L8 7 L0 14" stroke="#fff" strokeWidth="1" fill="none" />
                      </svg>
                    </footer>
                  )
                }
              </section>
            </header>
            <CSSTransition className='fade' timeout={300} in={showActivities} unmountOnExit>
              <section className='activities_details'>
                <h2 className="activities_shoptitle">{shopDetailData.name}</h2>
                <h3 className="activities_ratingstar">
                  <RatingStar rating={shopDetailData.rating} />
                </h3>
                <section className="activities_list">
                  <header className="activities_title_style"><span>优惠信息</span></header>
                  <ul>
                    {
                      shopDetailData.activities && shopDetailData.activities.map(item => (
                        <li key={item.id}>
                          <span className="activities_icon" style={{ backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color }}>{item.icon_name}</span>
                          <span>{item.description}（APP专享）</span>
                        </li>
                      ))
                    }
                  </ul>
                </section>
                <section className="activities_shopinfo">
                  <header className="activities_title_style"><span>商家公告</span></header>
                  <p>{promotionInfo}</p>
                </section>
                <svg width="60" height="60" className="close_activities" onClick={showActivitiesFun.bind(this)}>
                  <circle cx="30" cy="30" r="25" stroke="#555" strokeWidth="1" fill="none" />
                  <line x1="22" y1="38" x2="38" y2="22" style={{ stroke: '#999', strokeWidth: 2 }} />
                  <line x1="22" y1="22" x2="38" y2="38" style={{ stroke: '#999', strokeWidth: 2 }} />
                </svg>
              </section>
            </CSSTransition>
            <section className="change_show_type">
              <div>
                <span className={`${changeShowType === 'food' ? 'activity_show' : ''}`} onClick={() => this.setState({ changeShowType: 'food' })}>商品</span>
              </div>
              <div>
                <span className={`${changeShowType === 'rating' ? 'activity_show' : ''}`} onClick={() => this.setState({ changeShowType: 'rating' })}>评价</span>
              </div>
            </section>
            <CSSTransition className='fade-choose' timeout={300} in={Boolean(changeShowType)} unmountOnExit>
              {
                changeShowType === 'rating' ? (
                  <section className="rating_container" id="ratingContainer">
                    <section type="2">
                      <section>
                        <header className="rating_header">
                          <section className="rating_header_left">
                            <p>{shopDetailData.rating}</p>
                            <p>综合评价</p>
                            <p>高于周边商家{(ratingScoresData.compare_rating * 100).toFixed(1)}%</p>
                          </section>
                          <section className="rating_header_right">
                            <div>
                              <span>服务态度</span>
                              <RatingStar rating={ratingScoresData.service_score} />
                              <span className="rating_num">{ratingScoresData.service_score && ratingScoresData.service_score.toFixed(1)}</span>
                            </div>
                            <div>
                              <span>菜品评价</span>
                              <RatingStar rating={ratingScoresData.food_score} />
                              <span className="rating_num">{ratingScoresData.food_score && ratingScoresData.food_score.toFixed(1)}</span>
                            </div>
                            <p>
                              <span>送达时间</span>
                              <span className="delivery_time">{shopDetailData.order_lead_time}分钟</span>
                            </p>
                          </section>
                        </header>
                        <ul className="tag_list_ul">
                          {
                            ratingTagsList && ratingTagsList.map((item, index) => (
                              <li key={index} className={`${item.unsatisfied ? 'unsatisfied' : ''} ${ratingTageIndex === index ? 'tagActivity' : ''}`} onClick={changeTgeIndex.bind(this, index, item.name)}>{item.name}({item.count})</li>
                            ))
                          }
                        </ul>
                        <ul className="rating_list_ul">
                          {
                            ratingList.map((item, index) => (
                              <li key={index} className="rating_list_li">
                                <img src={getImgPath(item.avatar)} className="user_avatar" />
                                <section className="rating_list_details">
                                  <header>
                                    <section className="username_star">
                                      <p className="username">{item.username}</p>
                                      <div className="star_desc">
                                        <RatingStar rating={item.rating_star} />
                                        <span className="time_spent_desc">{item.time_spent_desc}</span>
                                      </div>
                                    </section>
                                    <time className="rated_at">{item.rated_at}</time>
                                  </header>
                                  <ul className="food_img_ul">
                                    {
                                      item.item_ratings.map((item, index) => (
                                        <li key={'image_hash_' + index}>
                                          {item.image_hash && <img src={getImgPath(item.image_hash)} />}
                                        </li>
                                      ))
                                    }
                                  </ul>
                                  <ul className="food_name_ul">
                                    {
                                      item.item_ratings.map((item, index) => (
                                        <li key={'food_name' + index} className="ellipsis">
                                          {item.food_name}
                                        </li>
                                      ))
                                    }
                                  </ul>
                                </section>
                              </li>
                            ))
                          }
                        </ul>
                      </section>
                    </section>
                  </section>
                ) : (
                    <section v-show="changeShowType =='food'" className="food_container">
                      <section className="menu_container">
                        <section className="menu_left" id="wrapper_menu" ref={this.wrapperMenuRef}>
                          <ul>
                            {
                              menuList && menuList.map((item, index) => (
                                <li key={'menu_left_li_' + index} className={`menu_left_li ${index === menuIndex ? 'activity_menu' : ''}`} onClick={chooseMenu.bind(this, index)}>
                                  {
                                    item.icon_url && <img src={getImgPath(item.icon_url)} />
                                  }
                                  <span>{item.name}</span>
                                  {categoryNum[index] && item.type == 1 && <span className="category_num">{categoryNum[index]}</span>}

                                </li>
                              ))
                            }
                          </ul>
                        </section>
                        <section className="menu_right" ref={this.menuFoodListRef}>
                          <ul>
                            {
                              menuList.map((item, index) => (
                                <li key={'menuList_' + index}>
                                  <header className="menu_detail_header">
                                    <section className="menu_detail_header_left">
                                      <strong className="menu_item_title">{item.name}</strong>
                                      <span className="menu_item_description">{item.description}</span>
                                    </section>
                                    <span className="menu_detail_header_right" onClick={showTitleDetail.bind(this, index)}></span>
                                    {
                                      index === TitleDetailIndex && (<p className="description_tip">
                                        <span>{item.name}</span>
                                        {item.description}
                                      </p>)
                                    }
                                  </header>
                                  {
                                    item.foods.map((foodItem, foodindex) => (
                                      <section key={'menu_detail_list_' + foodindex} className="menu_detail_list">
                                        <Link to={{ pathname: 'shop/foodDetail', query: { image_path: foodItem.image_path, description: foodItem.description, month_sales: foodItem.month_sales, name: foodItem.name, rating: foodItem.rating, rating_count: foodItem.rating_count, satisfy_rate: foodItem.satisfy_rate, foods: foodItem, shopId } }} className="menu_detail_link">
                                          <section className="menu_food_img">
                                            <img src={imgBaseUrl + foodItem.image_path} />
                                          </section>
                                          <section className="menu_food_description">
                                            <h3 className="food_description_head">
                                              <strong className="description_foodname">{foodItem.name}</strong>
                                              {
                                                foodItem.attributes.length && (
                                                  <ul className="attributes_ul">
                                                    {
                                                      foodItem.attributes.map((attribute, foodindex) => (
                                                        attribute ? (
                                                          <li key={'foodindex_' + foodindex} style={{ color: '#' + attribute.icon_color, borderColor: '#' + attribute.icon_color }} className={`${attribute.icon_name == '新' ? 'attribute_new' : ''}`}>
                                                            <p style={{ color: attribute.icon_name == '新' ? '#fff' : '#' + attribute.icon_color }}>{attribute.icon_name == '新' ? '新品' : attribute.icon_name}</p>
                                                          </li>
                                                        ) : null
                                                      ))
                                                    }
                                                  </ul>
                                                )
                                              }
                                            </h3>
                                            <p className="food_description_content">{foodItem.description}</p>
                                            <p className="food_description_sale_rating">
                                              <span>月售{foodItem.month_sales}份</span>
                                              <span>好评率{foodItem.satisfy_rate}%</span>
                                            </p>
                                            {foodItem.activity && <p className="food_activity">
                                              <span style={{ color: '#' + foodItem.activity.image_text_color, borderColor: '#' + foodItem.activity.icon_color }}>{foodItem.activity.image_text}</span>
                                            </p>
                                            }
                                          </section>
                                        </Link>
                                        <footer className="menu_detail_footer">
                                          <section className="food_price">
                                            <span>¥</span>
                                            <span>{foodItem.specfoods[0].price}</span>
                                            <span v-if="foodItem.specifications.length">起</span>
                                          </section>
                                          {/* <BuyCart shopId={shopId} foods={foodItem} moveInCart={listenInCart.bind(this)} showChooseList={showChooseList.bind(this)} showReduceTip={showReduceTip.bind(this)} showMoveDot={showMoveDotFun.bind(this)} /> */}
                                        </footer>
                                      </section>
                                    ))
                                  }
                                </li>
                              ))
                            }
                          </ul>
                        </section>
                      </section>
                      <section className="buy_cart_container">
                        <section onClick={toggleCartList} className="cart_icon_num">
                          <div className="" ref={this.cartContainerRef} className={`cart_icon_container ${totalPrice > 0 ? 'cart_icon_activity' : ''} ${receiveInCart ? 'move_in_cart' : ''}`} >
                            {
                              totalNum && <span v-if="totalNum" className="cart_list_length">{totalNum}</span>
                            }
                            <svg className="cart_icon" viewBox="0 0 58 58">
                              <defs>
                                <filter id="a" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox"><feOffset in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" in="shadowBlurOuter1" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter><path id="b" d="M7.614 4.051c-1.066.086-1.452-.398-1.752-1.584C5.562 1.28.33 5.88.33 5.88l3.71 19.476c0 .148-1.56 7.515-1.56 7.515-.489 2.19.292 4.27 3.56 4.32 0 0 36.917.017 36.92.047 1.979-.012 2.981-.995 3.013-3.039.03-2.043-1.045-2.978-2.987-2.993L8.83 31.192s.86-3.865 1.077-3.865c0 0-5.788.122 32.065-1.956.606-.033 2.018-.764 2.298-1.848 1.113-4.317 4.008-13.26 4.458-15.64.932-4.925 2.061-8.558-4.28-7.405 0 0-35.768 3.487-36.833 3.573z" />
                              </defs>
                              <g fill="none" fillRule="evenodd" filter="url(#a)" transform="translate(3 2)">
                                <g transform="translate(5.038 7.808)"><mask id="c" fill="#fff"><use xlinkHref="#b" /></mask><use fill="#FFF" xlinkHref="#b" /><path fill="#2073C1" d="M53.962 7.774l-5.701 19.305-40.78 1.574z" opacity=".1" mask="url(#c)" /></g><path stroke="#FFF" strokeWidth="6" d="M9.374 18.722S7.868 11.283 7.323 8.71C6.778 6.136 5.86 5.33 3.978 4.52 2.096 3.713.367 2.286.367 2.286" strokeLinecap="round" /><circle cx="46" cy="51" r="4" fill="#FFF" /><circle cx="12" cy="51" r="4" fill="#FFF" />
                              </g>
                            </svg>
                          </div>
                          <div className="cart_num">
                            <div>¥ {totalPrice}</div>
                            <div>配送费¥{deliveryFee}</div>
                          </div>
                        </section>
                        <section className="gotopay" className={`gotopay ${minimumOrderAmount <= 0 ? 'gotopay_acitvity' : ''}`}>
                          {minimumOrderAmount > 0 ? <span className="gotopay_button_style">还差¥{minimumOrderAmount}起送</span>
                            : <Link to={{ pathname: '/confirmOrder', query: { geohash, shopId } }} className="gotopay_button_style">去结算</Link>
                          }
                        </section>
                      </section>
                      <CSSTransition className='toggle-cart' timeout={300} in={showCartList && cartFoodList.length} unmountOnExit>
                        <section className="cart_food_list" >
                          <header>
                            <h4>购物车</h4>
                            <div onClick={clearCart.bind(this)}>
                              <svg viewBox="0 0 24 32">
                                <path fill="#bbb" fillRule="evenodd" d="M21.5 10h-19c-1.1 0-1.918.896-1.819 1.992l1.638 18.016C2.419 31.104 3.4 32 4.5 32h15c1.1 0 2.081-.896 2.182-1.992l1.637-18.016A1.798 1.798 0 0 0 21.5 10zM8 28H5L4 14h4v14zm6 0h-4V14h4v14zm5 0h-3V14h4l-1 14zm2-24h-2.941l-.353-2.514C17.592.669 16.823 0 15.998 0H8c-.825 0-1.593.668-1.708 1.486L5.94 4H3a3 3 0 0 0-3 3v1h24V7a3 3 0 0 0-3-3zM8.24 2h7.52l.279 2H7.96l.28-2z"></path>
                              </svg>
                              <span className="clear_cart">清空</span>
                            </div>
                          </header>
                          <section className="cart_food_details" id="cartFood">
                            <ul>
                              {
                                cartFoodList.map((cartFood, index) => (
                                  <li key={'cartFoodList_' + index} className="cart_food_li">
                                    <div className="cart_list_num">
                                      <p className="ellipsis">{cartFood.name}</p>
                                      <p className="ellipsis">{cartFood.specs}</p>
                                    </div>
                                    <div className="cart_list_price">
                                      <span>¥</span>
                                      <span>{cartFood.price}</span>
                                    </div>
                                    <section className="cart_list_control">
                                      <span onClick={removeOutCart.bind(this, cartFood.category_id, cartFood.item_id, cartFood.food_id, cartFood.name, cartFood.price, cartFood.specs)}>
                                        <svg viewBox="0 0 50 50">
                                          <path fillRule="evenodd" strokeWidth="4" d="M22 0C9.8 0 0 9.8 0 22s9.8 22 22 22 22-9.8 22-22S34.2 0 22 0zm0 42C11 42 2 33 2 22S11 2 22 2s20 9 20 20-9 20-20 20z" clipRule="evenodd"></path>
                                          <path fillRule="evenodd" d="M32 20c1.1 0 2 .9 2 2s-.9 2-2 2H12c-1.1 0-2-.9-2-2s.9-2 2-2h20z" clipRule="evenodd"></path>
                                        </svg>
                                      </span>
                                      <span className="cart_num">{cartFood.num}</span>
                                      <svg className="cart_add" viewBox="0 0 50 50" onClick={addToCart.bind(this, cartFood.category_id, cartFood.item_id, cartFood.food_id, cartFood.name, cartFood.price, cartFood.specs)}>
                                        <path fill="none" d="M0 0h44v44H0z"></path>
                                        <path fillRule="evenodd" d="M22 0C9.8 0 0 9.8 0 22s9.8 22 22 22 22-9.8 22-22S34.2 0 22 0zm10 24h-8v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8h-8c-1.1 0-2-.9-2-2s.9-2 2-2h8v-8c0-1.1.9-2 2-2s2 .9 2 2v8h8c1.1 0 2 .9 2 2s-.9 2-2 2z" clipRule="evenodd"></path>
                                      </svg>
                                    </section>
                                  </li>
                                ))
                              }
                            </ul>
                          </section>
                        </section>
                      </CSSTransition>
                      <CSSTransition className='fade' timeout={300} in={showCartList && cartFoodList.length} unmountOnExit>
                        <div className="screen_cover" onClick={toggleCartList.bind(this)}></div>
                      </CSSTransition>
                    </section>
                  )
              }
            </CSSTransition>
          </section>)
        }
      </div>
    )
  }
}


const mapDispatchToProps = dispatch => {
  return {
    save_user_address: address => dispatch(saveUserAddress(address)),
    clearCart: shopId => dispatch(clearCart(shopId))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Shop))
