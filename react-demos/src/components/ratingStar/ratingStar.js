/*
 * @Author: rh
 * @Date: 2020-08-31 19:26:32
 * @LastEditTime: 2020-08-31 19:35:12
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import React from 'react'
import './ratingStar.scss'

function RatingStar(props){
  return (
    <div className='rating_container'>
      <section className='star_container'>
        {
          Array.from({length:5},v=>v).map((m,i)=>(
          <svg className='grey_fill' key={'grey_'  + i } viewBox="0 0 32 32">
              <path className="path1" d="M16 26.382l-8.16 4.992c-1.5 0.918-2.382 0.264-1.975-1.435l2.226-9.303-7.269-6.218c-1.337-1.143-0.987-2.184 0.755-2.322l9.536-0.758 3.667-8.835c0.674-1.624 1.772-1.613 2.442 0l3.667 8.835 9.536 0.758c1.753 0.139 2.082 1.187 0.755 2.322l-7.269 6.218 2.226 9.303c0.409 1.71-0.485 2.347-1.975 1.435l-8.16-4.992z">
              </path>
          </svg>
          ))
        }
      </section>
      <div className='star_overflow' style={{width: + props.rating*2/5 + 'rem'}}>
      <section className='star_container'>
        {
          Array.from({length:5},v=>v).map((m,i)=>(
          <svg className='orange_fill' key={'orange_'  + i } viewBox="0 0 32 32">
              <path className="path1" d="M16 26.382l-8.16 4.992c-1.5 0.918-2.382 0.264-1.975-1.435l2.226-9.303-7.269-6.218c-1.337-1.143-0.987-2.184 0.755-2.322l9.536-0.758 3.667-8.835c0.674-1.624 1.772-1.613 2.442 0l3.667 8.835 9.536 0.758c1.753 0.139 2.082 1.187 0.755 2.322l-7.269 6.218 2.226 9.303c0.409 1.71-0.485 2.347-1.975 1.435l-8.16-4.992z">
              </path>
          </svg>
          ))
        }
      </section>
      </div>
    </div>
  )
}

export default RatingStar