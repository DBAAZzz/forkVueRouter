import { History } from './base'

export class HashHistory extends History {
  constructor(router) {
    // 继承父类
    super(router)
  }

  // 启动路由监听
  setupListeners() {
    const handleRoutingEvent = () => {
      let location = getHash()
      this.transitionTo(location, () => {
        console.log('hash路由监听跳转成功！')
      })
    }

    window.addEventListener('hashchange', handleRoutingEvent)

    this.listeners.push(() => {
      window.removeEventListener('hashchange', handleRoutingEvent);
    })
  }

  // 更新URL
  ensureURL() {
    window.location.hash = this.current.fullPath
  }

  // 路由跳转方法
  push(location, onComplete) {
    this.transitionTo(location, onComplete)
  }

  // 路由前进后退
  go(n) {
    window.history.go(n)
  }

  // 跳转到指定 URL ，替换 history 栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, (route) => {
      window.location.replace(getUrl(route.pullPath))
      onComplete && onComplete(route)
    })
  }

  // 获取当前路由
  getCurrentLocation() {
    return getHash()
  }
}

// 获取URL
function getUrl(path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

// 获取 location hash 路由
export function getHash() {
  let href = window.location.href
  const index = href.indexOf('#')
  if (index < 0) return '/'

  href = href.slice(index + 1)
  return href
}