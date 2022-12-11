
// 声明 编辑表单的设置
const autoSwitchEditor = {
  url: '/cacheConf/admin/common/notify.do',
  preSend: data => {
    // data.ip = data.ip ? +data.ip : data.ip
    return data
  },
  form: [{
    name: 'serverName',
    type: 'select',
    label: 'serverName',
    clearable: true,
    enum: {
      url: '/cacheConf/admin/common/ipList.do',
      preRender: ret => ret.map(_ => ({
        value: _.serverName,
        label: _.serverName
      }))
    }
  }, {
    name: 'ip',
    type: 'input',
    label: 'ip',
    rules: [
      { required: true, message: 'IP不能为空' },
      { pattern: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/, message: '不是合法的IP' }
    ]
  }, {
    name: 'open',
    type: 'select',
    label: 'open',
    enum: [{
      value: 'true',
      label: '打开'
    }, {
      value: 'false',
      label: '关闭'
    }]
  }]
}

// 声明上部的过滤条件
const filters = [{
  name: 'aaa',
  type: 'input-number',
  label: 'number',
  min: 10,
  max: 200,
  step: 10
}, {
  name: 'date',
  type: 'date',
  label: 'date',
  format: 'yyyy-MM-dd'
}, {
  name: 'daterange',
  type: 'daterange',
  label: 'daterange',
  format: 'yyyy-MM-dd'
}, {
  name: 'datetimerange',
  type: 'datetimerange',
  label: 'datetimerange',
  format: 'yyyy-MM-dd'
}, {
  name: 'color-picker',
  type: 'color-picker',
  label: 'color-picker'
  // show-alpha
  // color-format
}, {
  name: 'time-select',
  type: 'time-select',
  label: '时间',
  'is-range': true
}, {
  name: 'groupId',
  // type 可以是 select input input-number date daterange button
  type: 'select',
  label: 'groupId',
  // clearable 有清除按钮的单选
  clearable: true,
  enum: {
    // enum 可以是 一个包含 value 和 label 属性的数组
    // 在需要网络请求的时候 也可以是 一个包含 url preRender 的对象
    // preRender 产生了 value 和 label 数组
    url: '/cacheConf/admin/common/allGroup.do',
    preRender: ret => ret.map(_ => ({
      value: _,
      label: _
    }))
    // 凡是网络请求都有 url param preRender preSend news 这几个字段
  }
}, {
  name: 'serverName',
  type: 'select',
  label: 'serverName',
  // clearable 有清除按钮的多选
  clearable: true,
  // 多选 会表现为逗号分隔的 values
  multiple: true,
  enum: {
    url: '/cacheConf/admin/common/ipList.do',
    // watch 代表监听 数据变化 然后重新拉取待选项
    // 也代表刚打开页面时 不会拉取请求
    watch: ['groupId'],
    preRender: ret => ret.map(_ => ({
      value: _.serverName,
      label: _.serverName
    }))
  }
}, {
  name: 'ipList',
  type: 'select',
  label: 'ipList',
  clearable: true,
  // multiple: true,
  enum: {
    url: '/cacheConf/admin/common/ipList.do',
    watch: ['groupId', 'serverName'],
    preRender: ret => ret.map(_ => ({
      value: _.ip,
      label: _.ip
    }))
  }
}, {
  name: 'category',
  type: 'input',
  label: 'category'
}, {
  name: 'iniName',
  type: 'input',
  label: 'iniName'
}, {
  type: 'button',
  text: '查询IP及应用',
  action: {
    search: 'autoSwitch'
  }
}, {
  type: 'button',
  text: '查询redis配置列表',
  action: {
    search: 'iniList'
  }
}, {
  type: 'button',
  text: '刷新结果',
  action: {
    search: 'refreshResult'
  }
  // 这里也可以 包含 params 参数, 作为过滤参数
}, {
  type: 'button',
  text: '刷新',
  action: {
    // 点击按钮发出一个动作的 需要 news 和 url 两个字段
    url: '/cacheConf/admin/common/notify.do',
    news: '刷新成功',
    // 这里也可以 包含 params 参数, 发送至指令地址
    // search 指定了 对应的 table scheme
    search: 'refreshResult'
  }
}, {
  type: 'button',
  text: '新建配置',
  action: {
    editor: autoSwitchEditor
  }
}]

// 声明三个 table
const autoSwitch = {
  // pagination: true 需要分页可以用这个字段
  url: '/cacheConf/admin/common/getAutoRefreshSwitch.do',
  columns: [{
    prop: 'serverName',
    label: 'serverName'
  }, {
    prop: 'ip',
    label: 'ip'
  }, {
    prop: 'open',
    label: 'open',
    formatter: row => ({ 'true': '打开', 'false': '关闭' })[row.open]
  }, {
    label: '操作',
    buttons: [{
      text: '打开自动刷新',
      // row 代表了 当前行的数据
      isShow: row => row.open === 'false',
      type: 'success', // 可以是 primary,success,warning,danger,info,text 默认 白的
      plain: true,

      action: {
        url: '/cacheConf/admin/common/setAutoRefreshSwitch.do',
        // params 覆盖顺序 params 参数 > row 数据 > 过滤选项
        params: {
          open: 'true'
        },
        news: '自动刷新已打开'
      }
    }, {
      text: '关闭自动刷新',
      isShow: row => row.open === 'true',
      type: 'danger',
      plain: true,

      action: {
        url: '/cacheConf/admin/common/setAutoRefreshSwitch.do',
        params: {
          open: 'false'
        },
        news: '自动刷新已关闭'
      }
    }, {
      text: '编辑',
      action: {
        editor: autoSwitchEditor
      }
    }]
  }]
}

const iniList = {
  url: '/cacheConf/admin/common/iniList.do',
  preRenderRow: row => ({
    ini: row
  }),
  columns: [{
    prop: 'ini',
    label: 'ini'
  }]
}

const refreshResult = {
  url: '/cacheConf/admin/common/getRefreshResult.do',
  columns: [{
    prop: 'serverName',
    label: 'serverName'
  }, {
    prop: 'ip',
    label: 'ip'
  }, {
    prop: 'refreshTime',
    label: 'refreshTime'
  }, {
    prop: 'result',
    label: 'result'
  }, {
    prop: 'size',
    label: 'size'
  }]
}

export default {
  name: '配置页面',
  filters,
  // 用table 打开的时候便会默认刷新
  table: autoSwitch,
  tables: {
    autoSwitch,
    iniList,
    refreshResult
  }
}
