/*
 * @Author: rh
 * @Date: 2020-08-13 14:54:10
 * @LastEditTime: 2020-08-13 14:56:29
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import styles from './alert.module.css'
import cn from 'classnames'

export default function Alert({ children, type }) {
  return (
    <div className={cn({
      [styles.success]: type === 'success',
      [styles.error]: type === 'error'
    })}>
      {children}
    </div>
  )
}