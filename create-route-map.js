/**
 * 生成路由映射，生成的 pathMap 对象是 [{path: record}...] 格式的
 * oldPathMap 参数是为了动态添加路由 addRoutes ，生成新的 pathMap 
 * @param {*} routes 
 * @param {route} oldPathMap
 * @returns 
 */
export function createRouteMap(routes, oldPathMap, parentRoute) {
  /* old: const pathMap = Object.create(null) */
  const pathMap = oldPathMap || Object.create(null)
  routes.forEach(route => {
    addRouteRecord(pathMap, route, parentRoute)
  })
  return pathMap
}


/**
 * 添加路由记录
 * @param {string} pathMap 
 * @param {*} route 
 * @param {*} parent 
 */
function addRouteRecord(pathMap, route, parent) {
  const { path, name } = route

  // 生成格式化后的path（子路由会拼接上父路由的path）
  const normalizedPath = normalizePath(path, parent)

  // 生成一条路由记录
  const record = {
    path: normalizedPath,
    regex: '',
    components: route.component,
    name,
    parent,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    mata: route.meta || {},
    props: route.props === null ? {} : route.props
  }

  // 处理有子路由的情况，递归处理
  if (route.children) {
    // 新生成的路由记录就是 child 的父级路由了
    route.children.forEach(child => {
      addRouteRecord(pathMap, child, record)
    })
  }

  /**
   * 若 pathMap 中不存在当前路径， 则添加 pathList 和 pathMap
   */
  if (!pathMap[record.path]) {
    pathMap[record.path] = record
  }

}

// 规格化路径
function normalizePath(path, parent) {
  // 下标0为 / ，则是最外层path
  if (path[0] === '/') return path
  // 没有父级，则是最外层path
  if (!parent) return path
  // 清除 path 双斜杠中的一个
  return `${parent.path}/${path}`.replace(/\/\//g, '/')
}