/**
 * RouterView的使用，用来渲染路由
 * <RouterView />
 */
export default {
  name: 'RouterView',
  functional: true, // 函数式组件
  /**
   * parent：对父组件的引用
   * data：传递给组件的整个数据对象，作为 crateElement 的第二个参数传入组件
   * 相关文档可以看：https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6
   */
  render(h, { parent, data }) {
    // 标识当前渲染组件为 router-view，通过这个属性判断是不是由 router-view 组件渲染出来的
    data.routerView = true

    console.log('重新渲染了')

    let depth = 0;
    // 逐级向上查找组件，当parent指向Vue根实例结束循环
    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      // routerView属性存在即路由组件深度+1，depth+1
      if (vnodeData.routerView) {
        depth++
      }

      parent = parent.$parent
    }


    let route = parent.$route

    if (!route.matched) return h();

    /**
     * route.matched还是当前path全部关联的路由配置数组
     * 渲染的哪个组件，走上面逻辑时就会找到depth个RouterView组件
     * 由于逐级向上时是从父级组件开始找，所以depth数量并没有包含当前路由组件
     * 假如depth=2，则route.matched数组前两项都是父级，第三项则是当前组件，所以depth=索引
     */
    // debugger
    let matched = route.matched[depth]
    console.log('matched', matched)
    if (!matched) return h();

    console.log('h(matched.components, data)}', h(matched.components, data))
    return h(matched.components, data)
  }
}