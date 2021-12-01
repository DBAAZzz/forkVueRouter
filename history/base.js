import { START } from '../utils/route'
/**
 * History 类 constructor 中主要做了3件事
 * 1、保存传入的路由实例 router
 * 2、声明一个当前路由对象 current
 * 3、声明一个路由监听器数组，存放路由监听销毁方法
 */
export class History {

  // 这里的 route 是 index.js 文件中的 VueRouter 实例
  constructor(router) {
    this.router = router

    /**
     * 当前路由 route 对象，每当我们监听到路由 path 改变时，就要同步去修改这个路由对象
     * 每当路由对象改变，route-view 组件需要渲染的试图也要改变，可以说
     * 这个路由对象就是整个 vueRouter 的中枢
     */
    this.current = START

    // 路由监听数组，存在路由监听销毁方法
    this.listeners = []
  }

  // 保存赋值回调
  listen(cb) {
    this.cb = cb
  }

  // 启动路由监听
  setupListeners() { }

  // 路由跳转
  transitionTo(location, onComplete) {
    // 路由匹配，解析location 匹配到其路由对应的数据对象
    let route = this.router.match(location);
    // 调用赋值回调，传出新路由对象，用于更新 _route
    this.cb && this.cb(route)

    // 更新current
    this.current = route;
    // 跳转成功抛出回调
    onComplete && onComplete(route)
    // 更新URL
    this.ensureURL()
  }

  // 卸载
  teardown() {
    this.listeners.forEach((cleanupListener) => {
      cleanupListener()
    })
    this.listeners = [];
    this.current = '';
  }
}