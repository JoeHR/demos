/*
 * @Author: rh
 * @Date: 2020-08-13 15:26:36
 * @LastEditTime: 2020-08-14 10:03:34
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postDirectory = path.join(process.cwd(),'posts')

export function getSortedPostsData () {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name  to get id
    const id = fileName.replace(/\.md$/,'')

    // Read markdown file as string
    const fullPath = path.join(postDirectory,fileName)
    const fileContents = fs.readFileSync(fullPath,'utf-8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    
    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })

  // Sort posts by date
  return allPostsData.sort((a,b) => {
    if(a.date < b.date){
      return 1
    } else {
      return -1
    }
  })

}

export function getAllPostIds () {
  const fileNames = fs.readdirSync(postDirectory)
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/,'')
      }
    }
  })
}

export async function getPostData(id){
  const fullPath = path.join(postDirectory,`${id}.md`)
  const fileContents = fs.readFileSync(fullPath,'utf-8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()
  console.log('getPostData -> contentHtml', contentHtml)

  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
    contentHtml
  }
}