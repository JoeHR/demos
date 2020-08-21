/*
 * @Author: rh
 * @Date: 2020-08-20 09:50:03
 * @LastEditTime: 2020-08-21 11:07:13
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React, {Component} from 'react'
import HeadTop from '@/components/header/head'
import { Logo } from '@/components/header/component'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import API from '@/api/api'

import './home.scss'

class Home extends Component {

  constructor(props){
    super(props)
    this.state = {
      guessCity: '', // 当前城市
      guessCityid: '', // 当前城市id
      hotcity: [],  //热门城市列表
      groupcity: {},  // 所有城市列表
    }
    this.cityGuess()
    this.hotcity()
    this.groupcity()
  }

  async cityGuess () {
    const res = await API.cityGuess()
    const {name,id} = res
    this.setState({
      guessCity: name,
      guessCityid: id
    })
  }

  async hotcity () {
    const res = await API.hotcity()
    this.setState({
      hotcity: res
    })
  }

  async groupcity () {
    const res = await API.groupcity()
    this.setState({
      groupcity: res
    })
  }
  

  /**
   * 将 groupcity 按照A-Z字母开头排序
   * @param {*} groupcity 
   */
  getSortgroupcity = groupcity => {
    let sortobj = {}
    for(let i = 65; i<= 90; i++) {
      if(groupcity[String.fromCharCode(i)]){
        sortobj[String.fromCharCode(i)] = groupcity[String.fromCharCode(i)]
      }
    }
    return sortobj
  }
  
  render(){
    const { guessCity, guessCityid , hotcity, groupcity } = this.state
    const sortgroupcity = this.getSortgroupcity(groupcity)
    return (
      <>
        <HeadTop signinUp='home' logo={<Logo />}></HeadTop>
        <nav className='city_nav'>
          <div className="city_tip">
            <span>当前定位城市：</span>
            <span>定位不准时，请在城市列表中选择</span>
          </div>
          <Link to={'/city/' + guessCityid} className='guess_city'>
            <span>{guessCity}</span>
            <svg className='arrow_right' dangerouslySetInnerHTML={{__html:'<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>'}}></svg>
          </Link>
        </nav>
        <section className='hot_city_container'>
          <h4 className='city_title'>热门城市</h4>
          
            <ul className='citylistul clear'>
            <QueueAnim>
              {
                hotcity.map(item => (
                  <li key={item.id}>
                    <Link to={'/city/' + item.id}>{item.name}</Link>
                  </li>
                ))
              }
              </QueueAnim>
            </ul>
        </section>
        <section className='group_city_container'>
          <ul className='lette_classify'>
          <QueueAnim>
            {
              Object.keys(sortgroupcity).map((key,index)=>(
                
                  <li className='letter_classify_li' key={key}>
                    <h4 className='city_title'>{key} {index===0? (<span>(按字母排序)</span>):null}</h4>
                    
                    <ul className='groupcity_name_conatainer citylistul clear'>
                      {
                        sortgroupcity[key].map(item => (
                          <li className='ellipsis' key={item.id}>
                            <Link to={'/city/' + item.id}  >{item.name}</Link>
                          </li>
                        ))
                      }
                    </ul>
                  </li>
              ))
            }
            </QueueAnim>
          </ul>
        </section>
      </>
    )
  }
}


export default Home