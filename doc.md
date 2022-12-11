目的
  将后台页面反复使用的模式以配置的形式展现
  简化 dojo 繁琐的写法
功能
  表格数据 增 删 改 查
  表单联动
安装
  安装 node
  git clone https://git.ms.netease.com/pj/backyard.git
  npm install
  安装依赖
  npm run build
  生成 目标文件
  生成 dist 文件夹
配置
  filters
    name 字段名
    label 左侧标签名
    type 可以是 select input input-number date daterange button
    select 下拉框
      enum
        数组 Array<{value, label}>
          确定的下拉列表选项
        对象 Map<{url param preRender preSend news}>
          以网络请求拉取
          preRender 将取到的数据处理为 Map<{value, label}>
        watch 监听其他字段的变化 重新拉取网络请求
      multiple 多选
        在发送网络请求时 会表现为逗号分隔的字段
      clearable 清除按钮
    input 文本框
    input-number 专门用来输入数字
      min 最小值
      max 最大值
      step 步长
    date 日期选择框
      daterange 日期范围 选择框
      time-select 时间选择框
      'is-range': true 表示选择时间范围
    datetimerange 时间日期范围 选择框
    color-picker 颜色选择器
      show-alpha 是否支持透明度选择 true | false
      color-format 颜色的格式 hsl | hsv | hex | rgb
    button
      action
      search 刷新某个表格 字段定义在tables对象中
        按钮显示为白色
      url news 执行某个动作
        按钮显示为蓝色​
        可以同时存在 动作会先执行 成功之后 再刷新表格
      editor 浮层表单 通常用于新建
  table 和 tables 相同 打开页面就会刷新这个表格
  tables
    url 接口地址
    columns 表格 scheme
      prop 字段
      label 列标题
      buttons 操作列按钮配置
        isShow 根据行数据 分辨按钮可用不可用
        action 和 上面完全相同
          除了 editor 在这里表现为编辑 默认会灌入这一行的数据
    pagination true 需要分页可以用这个字段
      需要 配置 返回分页类型的接口
    preRender 在渲染表格之前 调整数据结构
    preRenderRow 在渲染表格某一行之前 调整数据结构
    editors
      和 filters 表单完全一样
      preSend 发送之前 处理数据
      每个表单项 可以有一个 rules 选项
        详情可见 https://github.com/yiminghe/async-validator
  todo
    feature ~~默认刷新表格~~(已完成) 见 table 字段
    bug ~~watch 被观察的值变化时 删除观察者旧的值~~ (已完成)
    feature filters 校验 disable-input datepicker
