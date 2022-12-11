import { get, forData, forNews } from './network/helpers'
import fp from 'lodash/fp'
forNews
// 用来对进来的config 进行处理
// 主要是 拉取 select 选项

export const prepare = async function (formConfig) {
  const listeners = []

  const getEnum = (network, param = {}) => {
    return async (query = {}) => {
      const range = await forData(get(network.url, { ... query, ... param }))
      const uniq = fp.uniqBy('value')
      return uniq(network.preRender(range))
    }
  }

  const makeListener = filter => {
    filter.enum.watch.forEach(watchedKey => {
      listeners.push({
        watch: watchedKey,
        name: filter.name,
        getEnum: getEnum(filter.enum)
      })
    })
  }

  const updater = async (key, query = {}) => {
    const toUpdate = listeners.filter(_ => _.watch === key)
    for (const listener of toUpdate) {
      const select = formConfig.filter(_ => _.name === listener.name)[0]
      select.enum = await listener.getEnum(query)
    }
    return formConfig
  }

  // 遍历 提供的 模板, 找到select里面包含 url 的项
  if (!formConfig) return
  for (const filter of formConfig) {
    if (!filter.enum || !filter.enum.url) continue
    // 如果 包含 watch 字段, 注册监听函数
    if (filter.enum.watch) {
      console.log('注册监听函数', filter)
      makeListener(filter)
      filter.enum = []
    } else {
      console.log('预拉取', filter)
      // 如果不包含 直接 替换为 Array<{value, label}>
      filter.enum = await getEnum(filter.enum)()
    }
  }

  return {
    scheme: formConfig,
    listeners,
    updater
  }
}
