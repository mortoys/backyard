import axios from 'axios'
import { Msg, Notif } from '@/main'
import fp from 'lodash/fp'

/**
 * 目的在于 将返回的数据 提取出来
 */
export const extract = async promise => {
  try {
    var { data: { ret, retCode, retDesc }, config } = await promise
  } catch (e) {
    throw Object({
      code: e.response.status,
      desc: e.response.statusText,
      message: e.message
    })
  }

  process.env.NODE_ENV === 'development' &&
    Notif({
      title: config.url,
      type: +retCode === 200 ? 'success' : 'error',
      message: config.method === 'get'
             ? JSON.stringify(config.params, null, ' ')
             : JSON.stringify(config.data, null, ' '),
      duration: 10 * 1000
    })

  if (+retCode === 200) return ret
  else throw Object({ ret, code: retCode, desc: retDesc })
}

// 清除 undefined 和 null 的参数
const clear = fp.omitBy(fp.isNil)

// 处理日期变字符串
const dateStringify = item =>
  typeof item.formatBeforeSend === 'function'
  ? item.formatBeforeSend(item)
  : item

// 对发送数据 进行处理
const handler = fp.mapValues(_ =>
  _.join
  ? _.map(dateStringify).join()
  : dateStringify(_))

// axios 文档见: https://www.kancloud.cn/yunye/axios/234845
// axios.get(url[, config])
export const get = (url, params, config) => extract(
  axios.get(url, {
    params: clear(handler(clear(params))),
    ...config
  })
)

// axios.post(url[, data[, config]])
export const post = (url, data, config) => extract(
  axios.post(url, clear(handler(data)), config)
)

export const all = axios.all

/**
 * 对接口消息返回 失败 进行通知
 * , 失败会使用 retDesc 的内容
 * , 和下面的 forNews 的区别是 成功不通知 用于刷新列表之类的地方
 * @param {Promise} promise - 请求
 * @return {Promise}
 */
export const forData = async promise => {
  try {
    return await promise
  } catch (e) {
    Msg.error(e.code ? `网络错误: ${e.code} ${e.desc}` : `解析错误: ${e.message}`)
    throw e
  }
}

/**
 * 对接口消息返回 成功失败 进行通知
 * , 成功会显示 successNews
 * , 失败会使用 retDesc 的内容
 * @param {string | Object} news
 * - 动作执行显示的消息 有两种形式:
 * - {string} 成功消息
 * - {object} {200: '成功',503:'没有权限',...} 这种情景不多 最好让后台配好 retDesc
 * @param {Promise} promise - 请求
 * @return {Promise}
 */
export const forNews = async (news, promise) => {
  try {
    const ret = await promise

    const successNews =
      typeof news === 'string'
      ? news
      : news[200]

    Msg.success(successNews)

    return ret
  } catch (e) {
    const errorNews =
      e.code
      ? typeof news !== 'string' && news[e.code]
        ? news[e.code]
        : `网络错误: ${e.code} ${e.desc}`
      : `解析错误: ${e.message}`

    Msg.error(errorNews)

    throw e
  }
}

/**
 * forData 和 forNews 的区别可以理解为
 * 只查询的是 forData
 * 修改服务器数据的 通常是 forNews
 * 因为 修改服务器数据 在页面上不容易看出来 才需要成功提示
 */
