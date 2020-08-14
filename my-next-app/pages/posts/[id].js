/*
 * @Author: rh
 * @Date: 2020-08-14 09:29:44
 * @LastEditTime: 2020-08-14 10:16:21
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post ({postData}) {
  return (<Layout>
          <Head>
            <title>{postData.title}</title>
          </Head>
            {/* {postData.title}
            <br/>
            {postData.id}
            <br/>
            <Date dateString={postData.date} />
            <br/>
            <br/>
            <br/> */}
            <h1 className={utilStyles.headingX1}>{postData.title}</h1>
            <div className={utilStyles.lightText}>
              <Date dateString={postData.date} />
            </div>
            <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}></div>
          </Layout>)
}

export async function getStaticPaths () {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps ({params}) {
  const postData = await getPostData(params.id)
  return {
    props:{
      postData
    }
  }
}