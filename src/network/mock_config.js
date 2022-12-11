import Mock from 'mockjs'
// Mockjs 文档见 https://github.com/nuysoft/Mock/wiki

Mock.setup({
  timeout: '300-1000'
})

const roleNames = ['投顾', '组长', '管理员', '超级管理员', '质检员', '回访', '运营策划', '经理', '录音调听']
const groupNames = ['微信后端2组', '前端2组', '前端3组', '前端15组', '前端12组', '前端1组', '后端2组', '后端3组', '前端9组', '前端10组', '前端11组', '前端8组', '测试组', '培训', '外推直销', '前端4组', '前端14组', '后端资源回收', '临时资源存放', '黑名单用户存放', '微信后端1组', '微信前端1组', '微信前端2组', '微信前端3组', '兆维投顾小组', '前端7组', '前端5组', '后端4组', '微信前端4组']

Mock.Random.extend({
  /** 生成一个n位的ID 默认为4位 */
  id: function (number = 4) {
    return this.natural(
      Math.pow(10, number - 1),
      Math.pow(10, number) - 1)
  },

  /** 生成一个ID列表 ID默认为4位 逗号分隔 */
  ids: function (number = 4, split = ',') {
    return Array.from({ length: this.natural(5, 10) })
                .map(_ => this.id(number))
                .join(',')
  },

  /** 为了语义 声明一个枚举参数 */
  enum: (...list) => Mock.Random.pick(list),

  mail: function () {
    return this.word(10, 15) + '@corp.netease.com'
  },

  groupName: () => Mock.Random.pick(groupNames),

  roleName: () => Mock.Random.pick(roleNames),

  empId: function () {
    return 'C' + this.natural(1001, 9999)
  }
})

const findRe = key => '' + key + '=([^&?]*)'
const findValue = (url, key) => (url.match(new RegExp(findRe(key))) || [])[1]

/**
 * 生成可以响应请求的 table mock
 * @param {Object} mockTemplate mock 模板
 * @param {number} fixedSize 固定列表的长度
 * @param {string} result 数据列表的键 有的接口这个键不是固定的
 */
Mock.table = (mockTemplate, fixedSize, key = 'result') => ({ url }) => {
  const recordPerPage = +findValue(url, 'recordPerPage') || fixedSize || 20
  const pageNum = +findValue(url, 'pageNum') || 1

  const totalPage = Math.floor(Math.random() * 3) + 1 // 0 1 2

  const ret = {
    retCode: 200,
    retDesc: 'ok',
    ret: {
      paginationInfo: {
        currentPage: pageNum,
        recordPerPage,
        totalPage,
        totalRecord: totalPage * recordPerPage
      }
    }
  }

  ret.ret[key] = totalPage
      ? Array.from({ length: recordPerPage })
          .map(_ => Mock.Handler.gen(mockTemplate))
      : []
    // Mock.Handler.gen: 用 template 生成数据

  return ret
}
