/*
 * @Author: rh
 * @Date: 2020-08-13 11:27:56
 * @LastEditTime: 2020-08-13 14:11:04
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import styles from './layout.module.css'
import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

function Layout ({ children, home }) {
  return (<div className={styles.container}>
            <Head>
              <link ref="icon" href="/favicon.ico" />
              <meta name="description" content="Learn how to build a personal website using Next.js"></meta>
              <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}/>
              <meta name="og:title" content={siteTitle}/>
              <meta name="twitter:card" content="summary_large_image"/>
            </Head>
            <header className={styles.header}>
              {
                home?(
                  <>
                    <img src="/images/profile.jpg" className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`} alt={name} />
                    <h1 className={utilStyles.heading2X1}>{name}</h1>
                  </>
                ) : (
                  <>
                    <Link href="/">
                      <a>
                        <img src="/images/profile.jpg" className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`} alt={name}/>
                      </a>
                    </Link>
                    <h2 className={utilStyles.headingLg}>
                      <Link href="/">
                        <a className={utilStyles.colorInherit}>{name}</a>
                      </Link>
                    </h2>
                  </>
                )
              }
            </header>
            <main>{children}</main>
            {
              !home && (
                <div className={styles.backToHome}>
                  <Link href="/">
                    <a> ← Back to home</a>
                  </Link>
                </div>
              )
            }
          </div>)
}


export default Layout