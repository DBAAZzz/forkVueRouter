import { createRouteMap } from './create-route-map'
import { createRoute } from './utils/route'
// 路由匹配器
export function createMatcher(routes) {
  
  // 生成路由映射对象 pathMap
  const pathMap = createRouteMap(routes)

  /**
   * 动态添加路由（添加一条路由规则）
   * 
   * 在 vueRouter 中的使用方式
   * 1、添加一条路由规则。如果该路由规则有 name ，并且已经存在一个与之相同的名字，则会覆盖它
   * 2、添加一条新路由规则记录作为现有路由的子路由。如果该路由规则有 name ，并且存在一个与之相同的名字，
   * 则会覆盖它
   */
  function addRoute(parentOrRoute, route) {
    const parent = (typeof parentOrRoute !== 'object') ? pathMap[parentOrRoute] : undefined
    createRouteMap([route || parentOrRoute], pathMap, parent)
  }

  // 动态添加路由（参数必须是一个符合routes选项的数组）
  function addRoutes(routes) {
    createRouteMap(routes, pathMap, null)
  }

  // 获取所有活跃的路有记录
  function getRoutes() {
    return pathMap
  }

  /**
   * 路由匹配
   * 用法：match('/home') || match({path: '/home'})
   * @param {*} location 
   * @returns 
   */
  function match(location) {
    // 当传入的参数为 string 类型时，将其转化成 record 的格式
    location = typeof location === 'string' ? { path: location } : location
    return createRoute(pathMap[location.path], location)
  }

  return {
    addRoute,
    addRoutes,
    getRoutes,
    match
  }
}
