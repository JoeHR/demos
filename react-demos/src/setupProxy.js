/*
 * @Author: rh
 * @Date: 2020-08-19 21:08:09
 * @LastEditTime: 2020-08-20 09:32:08
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */
// const proxy = require('http-proxy-middleware')

// module.exports = function (app) {
//   app.use(proxy('/api',{target:'https://elm.cangdu.org'}))
// }

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const proxyOptions = {
    target: 'https://elm.cangdu.org',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }
  const proxy = createProxyMiddleware(proxyOptions);
  app.use('/api', proxy)
}
