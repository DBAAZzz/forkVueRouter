import { install } from './install'
import { createMatcher } from './create-match'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'

const inBrowser = typeof window !== 'undefined'

/**
 * VueRouter的用法
 * const router = new VueRouter({
 *  mode: 'history',
 *  routes
 * })
 */

export default class VueRouter {

  constructor(options) {
    // options为传入的路由配置
    this.options = options

    // 创建路由 matcher 对象，传入 routes 路由配置列表及 vueRouter 实例，主要负责url匹配
    this.matcher = createMatcher(options.routes)

    // 默认为 hash 模式
    let mode = options.mode || 'hash'


    // 不是浏览器环境，VueRouter 是支持服务端 SSR 渲染 
    if (!inBrowser) {
      mode = 'abstract'
    }

    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this)
        break
      case 'hash':
        this.history = new HashHistory(this)
        break
      case 'abstract':
        this.history = new AbstractHistory(this)
        break
      default:
        throw Error(`invlid mode:${mode}`)
    }
  }


  /**
   * app 参数为 Vue 根实例
   * @param {*} app 
   * @returns 
   */
  init(app) {
    app.$once('hook:destoryed', () => {
      this.app = null

      if (!this.app) this.history.teardown()
    })

    if (this.app) return

    this.app = app

    // 启动监听
    this.history.setupListeners()

    // 跳转当前路由path匹配渲染 用于页面初始化
    this.history.transitionTo(
      // 获取当前页面 path
      this.history.getCurrentLocation(),
      () => {
        // 启动监听放在跳转后回调中即可
        this.history.setupListeners();
      }
    )


    this.history.listen((route) => {
      app._route = route
    })
  }

  match(location) {
    return this.matcher.match(location);
  }

  // 获取所有活跃的路由记录列表
  getRoutes() {
    return this.matcher.getRoutes()
  }

  // 动态添加路由（添加一条新路由规则）
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route)
  }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  addRoutes(routes) {
    this.matcher.addRoutes(routes)
  }

  push(location) {
    this.history.push(location)
  }

  go(n) {
    this.history.go(n)
  }

  replace(location, onComplete) {
    this.history.replace(location, onComplete)
  }

  // 导航回退一步
  back() {
    this.history.go(-1)
  }


  afterEach() {

  }

}

VueRouter.install = install



