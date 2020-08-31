/*
import { clearStore } from '@/utils/commons';
import { showBack } from '@/utils/commons';
import { showBack } from '@/utils/commons';
 * @Author: rh
 * @Date: 2020-08-19 17:55:49
 * @LastEditTime: 2020-08-31 16:10:26
 * @LastEditors: rh
 * @Description: 命名规范
 * @变量: - 小驼峰式命名法（前缀应当是名词）
 * @常量: - 全大写（使用大写字母和下划线来组合命名，下划线用以分割单词）
 * @函数:  - 小驼峰式命名法（前缀应当为动词）
 * @这不是一个 bug，这只是一个未列出来的特性
 */

/**
 * 用于get方法后面参数的拼接，传入data是对象
 * @param {*} data 
 */
export const getUrlConcat  = data =>{
  let dataStr = ''
  let url = ''
  Object.keys(data).forEach(key=>{
    dataStr += `&key=${data[key]}`
  })
  if (dataStr) {
    dataStr = dataStr.substr(1,dataStr.length-1)
    url = url + '?' + dataStr
  }
  return url
}

/**
 * 存储localStoage
 * @param {*} name 
 * @param {*} content 
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 * @param {*} name 
 */
export const getStore = name => {
  if(!name) return 
  const nameStr = window.sessionStorage.getItem(name)
  if(nameStr && nameStr !== 'undefined'){
    return JSON.parse(nameStr)
  }else{
    return null
  }
}

/**
 * 删除sessionStorage
 * @param {*} name 
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 * 清空sessionStorage
 * @param {*} name 
 */
export const clearStore = () => {
  window.sessionStorage.clear()
}

/**
 * 处理图片路径
 */
export const getImgPath = (path) => {
  //传递过来的图片地址需要处理后才能正常使用(path) {
    let suffix;
    if (!path) {
      return 'https://elm.cangdu.org/img/default.jpg'
    }
    if (path.indexOf('jpeg') !== -1) {
      suffix = '.jpeg'
    } else {
      suffix = '.png'
    }
    let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
    return 'https://fuss10.elemecdn.com' + url
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') { 
      target = element.scrollTop;
  }else if(element.currentStyle){
      target = element.currentStyle[attr]; 
  }else{ 
      target = document.defaultView.getComputedStyle(element,null)[attr]; 
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return  NumberMode === 'float'? parseFloat(target) : parseInt(target);
} 

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 * @param {*} callback 
 */
export const showBack = callback => {
  let requestFram;
  let oldScrollTop;

  document.addEventListener('scroll',()=>{
    showBackFunc()
  },false)

  document.addEventListener('touchstart',()=>{
    showBackFunc()
  },{passive:true})

  document.addEventListener('touchmove',()=>{
    showBackFunc()
  },{passive:true})

  document.addEventListener('touchend',()=>{
    oldScrollTop = document.body.scrollTop
    moveEnd()
  },{passive:true})

  const moveEnd = () => {
    requestFram = requestAnimationFrame(()=>{
      if(document.body.scrollTop !== oldScrollTop) {
        oldScrollTop = document.body.scrollTop
        moveEnd()
      }else{
        cancelAnimationFrame(requestFram)
      }
      showBackFunc()
    })
  }

  // 判断是否道道目标点
  const showBackFunc = () => {
    if(document.body.scrollTop > 500){
      callback(true)
    }else{
      callback(false)
    }
  }
}

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
  clearInterval(element.timer);

  //判断不同参数的情况
  if (duration instanceof Function) {
      callback = duration;
      duration = 400;
  }else if(duration instanceof String){
      mode = duration;
      duration = 400;
  }

  //判断不同参数的情况
  if (mode instanceof Function) {
      callback = mode;
      mode = 'ease-out';
  }

  //获取dom样式
  const attrStyle = attr => {
      if (attr === "opacity") { 
          return Math.round(getStyle(element, attr, 'float') * 100);
      } else {
          return getStyle(element, attr);
      }
  }
  //根字体大小，需要从此将 rem 改成 px 进行运算
  const rootSize = parseFloat(document.documentElement.style.fontSize);

  const unit = {};
  const initState = {};

  //获取目标属性单位和初始样式值
  Object.keys(target).forEach(attr => {
      if (/[^\d^.]+/gi.test(target[attr])) {
          unit[attr] = target[attr].match(/[^\d^.]+/gi)[0] || 'px';
      }else{
          unit[attr] = 'px';
      }
      initState[attr] = attrStyle(attr);
  });

  //去掉传入的后缀单位
  Object.keys(target).forEach(attr => {
      if (unit[attr] === 'rem') {
          target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
      }else{
          target[attr] = parseInt(target[attr]);
      }
  });


  let flag = true; //假设所有运动到达终点
  const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
  element.timer = setInterval(() => {
      Object.keys(target).forEach(attr => {
          let iSpeed = 0;  //步长
          let status = false; //是否仍需运动
          let iCurrent = attrStyle(attr) || 0; //当前元素属性址
          let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
          let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
          switch(mode){
              case 'ease-out': 
                  speedBase = iCurrent;
                  intervalTime = duration*5/400;
                  break;
              case 'linear':
                  speedBase = initState[attr];
                  intervalTime = duration*20/400;
                  break;
              case 'ease-in':
                  let oldspeed = remberSpeed[attr] || 0;
                  iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
                  remberSpeed[attr] = iSpeed
                  break;
              default:
                  speedBase = iCurrent;
                  intervalTime = duration*5/400; 
          }
          if (mode !== 'ease-in') {
              iSpeed = (target[attr] - speedBase) / intervalTime;
              iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
          }
          //判断是否达步长之内的误差距离，如果到达说明到达目标点
          switch(mode){
              case 'ease-out': 
                  status = iCurrent !== target[attr]; 
                  break;
              case 'linear':
                  status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                  break;
              case 'ease-in':
                  status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                  break;
              default:
                  status = iCurrent !== target[attr]; 
          }

          if (status) {
              flag = false; 
              //opacity 和 scrollTop 需要特殊处理
              if (attr === "opacity") {
                  element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                  element.style.opacity = (iCurrent + iSpeed) / 100;
              } else if (attr === 'scrollTop') {
                  element.scrollTop = iCurrent + iSpeed;
              }else{
                  element.style[attr] = iCurrent + iSpeed + 'px';
              }
          } else {
              flag = true;
          }

          if (flag) {
              clearInterval(element.timer);
              if (callback) {
                  callback();
              }
          }
      })
  }, 20);
}