export function createRoute(record, location) {
  let route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: location.path || '/',
    // 拿到当前 path 关联的所有路由配置对象
    matched: record && formatMatch(record)
  }

  /**
   * Object.freeze 可以冻结一个对象
   * 一个冻结对象再也不能被修改
   */
  return Object.freeze(route)
}

// 初始状态的起始路由
export const START = createRoute(null, {
  path: '/'
})


// 关联所有路由记录
function formatMatch(record) {
  const res = []
  while (record) {
    /**
     * 队列头部添加 所以父record永远在前面 当前 record 永远在最后
     * 在 route-view 组件中获取匹配的 route record 时会用到
     * 精准匹配到路由记录是数组最后一个
     */
    res.unshift(record)
    record = record.parent
  }
  return res
}