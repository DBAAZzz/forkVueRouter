import RouterView from './components/RouterView'
import RouterLink from './components/RouterLink'

export let _Vue

// install 方法 提供给 Vue.use() 方法使用，传入的是 Vue 实例
export function install(Vue) {

  // 
  if (install.installed && _Vue === Vue) return
  install.installed = true


  // 保留 Vue 引用
  _Vue = Vue

  /**
   * 我们在使用 VueRouter 的时候，会发现在所有页面和组件中
   * 都可以使用 this.$router 和 this.$route 实例
   * 实际上就是使用了 Vue 的 Mixins 全局混入了这些实例
   */
  Vue.mixin({
    beforeCreate() {
      // 这里的 this.$options.router 就是 new VueRouter 的实例，this 即为 Vue 根实例
      if (this.$options.router) {
        this._routerRoot = this
        this._router = this.$options.router

        this._router.init(this)

        this._route = this._router.history.current
        
        /**
         * 实现当路由发生变化时，router-view 渲染相应的组件
         * 使用 Vue.util.defineReactive 方法实现响应式处理
         */
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    }
  })

  // 挂载 $router 和 router
  Object.defineProperty(Vue.prototype, '$router', {
    get: function () {
      return this._routerRoot._router
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get: function () {
      return this._routerRoot._route
    }
  })


  // 注册 RouterView 和 RouterLink 组件
  Vue.component('RouterView', RouterView)
  Vue.component('RouterLink', RouterLink)

}