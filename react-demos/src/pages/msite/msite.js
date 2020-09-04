/*
 * @Author: rh
 * @Date: 2020-08-28 17:18:21
 * @LastEditTime: 2020-08-31 19:54:36
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React,{Component} from 'react'
import { withRouter, Link } from 'react-router-dom'
import HeadTop from '@/components/header/head'
import './msite.scss'
import { connect } from 'react-redux'
import { saveUserGeohash, saveUserAddress } from '@/store/action'
import API from '@/api/api'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import Footer  from '@/components/footer/footer';
import ShopList from '@/components/shoplist/shoplist'

class Msite extends Component{

  state = {
    msiteTitle:'请选择地址',
    foodTypes:[], //食品分类列表
    hasGetData:false, // 是否已经获取地理位置数据，成功之后再获取商铺列表信息
    imgBaseUrl:'https://fuss10.elemecdn.com'
  }

  async componentWillMount () {
    const urlParams = new URLSearchParams(this.props.location.search)
    let geohash = urlParams.get('geohash')
    if(!geohash){
      const address = await API.cityGuess()
      geohash = address.latitude+','+address.longitude
    }
    this.setState({geohash})
    // 保存到 redux 中
    this.props.save_user_geohash(geohash)
    // 获取位置信息
    let res = await API.msiteAddress(geohash)
    this.setState({msiteTitle:res.name})
    // 记录当前经纬度
    this.props.save_user_address(res)

    this.setState({hasGetData:true})
  }

  componentDidMount = async () => {
    await this.msiteFoodTypes()
    new Swiper('.swiper-container',{
      loop:true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      observer: true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,//修改swiper的父元素时，自动初始化swiper
    })
  }

  // 解码url地址，求去restaurant_category_id值
  getCategoryId = (url) => {
    let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''))
    if (/restaurant_category_id/gi.test(urlData)) {
      return JSON.parse(urlData).restaurant_category_id.id
    }else{
      return ''
    }
  }

  msiteFoodTypes = async () => {
    const res = await API.msiteFoodTypes(this.state.geohash)
    let resLen = res.length
    let resArr = [...res]
    let foodArr = []
    for(let i=0,j=0;i<resLen;i+=8,j++){
      foodArr[j] = resArr.splice(0,8)
    }
    this.setState({foodTypes:foodArr})
  }

  render(){
    const {msiteTitle,foodTypes,hasGetData,imgBaseUrl} = this.state
    const {geohash} = this.props
    const {getCategoryId} = this
    return (
      <div>
        <HeadTop signinUp='msite' search={
          <Link to='/search/geohash' className='link_search'>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
              <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" strokeWidth="1" fill="none"/>
              <line x1="14" y1="14" x2="20" y2="20" style={{stroke:'rgb(255,255,255)',strokeWidth:2}}/>
            </svg>
          </Link>
        } msiteTitle={
          <Link to='/home' className='msite_title'>
            <span className='title_text ellipsis'>{msiteTitle}</span>
          </Link>
        }></HeadTop>
        <nav className='msite_nav'>
          {
            foodTypes.length ? (<div className='swiper-container'>
              <div className='swiper-wrapper'>
                {
                  foodTypes.map((v,i)=>(
                    <div className='swiper-slide food_types_container' key={i}>
                      {
                        v.map(foodItems=>(
                          <Link to={`/food?geohash=${geohash}&title=${foodItems.title}&restaurant_category_id=${getCategoryId(foodItems.link)}`} key={foodItems.id} className='link_to_food'>
                            <figure>
                              <img src={imgBaseUrl + foodItems.image_url} alt=""/>
                              <figcaption>{foodItems.title}</figcaption>
                            </figure>
                          </Link>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
              <div className='swiper-pagination'></div>
            </div>):(<img src={require('@/assets/images/fl.svg')} className='fl_back animation_opactiy' alt=""/>)
          }
        </nav>
        <div className="shop_list_container">
          <header className='shop_header'>
            <svg className='shop_icon' viewBox="0 0 32 31">
            <g fillRule="evenodd">
                <path d="M28.232 1.822C27.905.728 26.97.152 25.759.152H5.588c-1.252 0-1.867.411-2.397 1.415l-.101.243-.443 1.434-.975 3.154-.002.007C.837 9.101.294 10.854.26 10.956l-.059.259c-.231 1.787.337 3.349 1.59 4.448 1.159 1.017 2.545 1.384 3.865 1.384.07 0 .07 0 .132-.002-.01.001-.01.001.061.002 1.32 0 2.706-.367 3.865-1.384a4.96 4.96 0 0 0 .413-.407l-1.043-.946-1.056.931c1.033 1.171 2.51 1.792 4.21 1.801.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384.148-.13.287-.267.418-.411l-1.044-.944-1.057.93c1.033 1.174 2.511 1.796 4.213 1.806.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384.15-.131.29-.27.422-.416l-1.046-.943-1.058.929c1.033 1.177 2.513 1.801 4.218 1.811.04.002.088.004.173.004 1.32 0 2.706-.367 3.865-1.384 1.206-1.058 1.858-2.812 1.676-4.426-.069-.61-.535-2.207-1.354-4.785l-.109-.342a327.554 327.554 0 0 0-1.295-3.966l-.122-.366.014.043h.004zm-2.684.85l.12.361.318.962c.329.999.658 2.011.965 2.973l.108.338c.719 2.262 1.203 3.92 1.24 4.249.08.711-.233 1.553-.735 1.993-.553.485-1.308.685-2.008.685l-.098-.002c-.987-.007-1.695-.306-2.177-.854l-1.044-1.189-1.06 1.175a2.192 2.192 0 0 1-.188.185c-.553.485-1.308.685-2.008.685l-.098-.002c-.985-.007-1.693-.305-2.174-.852l-1.043-1.185-1.059 1.171c-.058.064-.12.125-.186.183-.553.485-1.308.685-2.008.685l-.098-.002c-.984-.007-1.692-.304-2.173-.85L9.101 12.2l-1.058 1.166a2.248 2.248 0 0 1-.184.181c-.553.485-1.307.685-2.008.685l-.061-.001-.131.001c-.701 0-1.455-.2-2.008-.685-.538-.472-.767-1.102-.654-1.971l-1.396-.18 1.338.44c.043-.13.552-1.775 1.425-4.599l.002-.007.975-3.155.443-1.434-1.345-.415 1.245.658c.054-.102.042-.085-.083-.001-.122.082-.143.086-.009.086H25.763c.053 0-.164-.133-.225-.339l.014.043-.004-.001zM5.528 19.48c.778 0 1.408.63 1.408 1.408v7.424a1.408 1.408 0 1 1-2.816 0v-7.424c0-.778.63-1.408 1.408-1.408z">
                </path>
                <path d="M.28 29.72c0-.707.58-1.28 1.277-1.28h28.155a1.28 1.28 0 0 1 .007 2.56H1.561A1.278 1.278 0 0 1 .28 29.72z">
                </path>
                <path d="M26.008 19.48c.778 0 1.408.63 1.408 1.408v7.424a1.408 1.408 0 1 1-2.816 0v-7.424c0-.778.63-1.408 1.408-1.408z">
                </path>
              </g>
            </svg>
            <span className="shop_header_title">附近商家</span>
          </header>
          {
            hasGetData ? (
              <ShopList geohash={geohash}></ShopList>
            ):null
          }
        </div>
        <Footer key='s3'/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    geohash: state.user.geohash
  }
}

const mapDispatchToProps = dispatch => {
  return {
    save_user_geohash: geohash=>dispatch(saveUserGeohash(geohash)),
    save_user_address: address => dispatch(saveUserAddress(address))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Msite))