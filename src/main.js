import Vue from 'vue'
import 'element-ui/lib/theme-default/index.css'

import {
  Icon, Tag,
  Table, TableColumn, Pagination,
  Collapse, CollapseItem,
  Tabs, TabPane,
  Dialog, Message, Notification, Popover, Tooltip, Loading,
  Form, FormItem,
  Button,
  Input, InputNumber,
  Select, Option,
  datePicker, colorPicker, timePicker
} from 'element-ui'

[
  Icon, Tag,
  Table, TableColumn, Pagination,
  Collapse, CollapseItem,
  Tabs, TabPane,
  Dialog, Message, Notification, Popover, Tooltip,
  Form, FormItem,
  Button,
  Input, InputNumber,
  Select, Option,
  datePicker, colorPicker, timePicker
]
.forEach(Compo => Vue.component(Compo.name, Compo))

Vue.use(Loading)

Vue.prototype.$message = Message

Vue.prototype.$notify = Notification

export const Msg = Message

export const Notif = Notification

Vue.config.productionTip = false

import Page from './Page'
import originConfig from './config'
import { prepare } from './prepare'

async function main () {
  const { scheme, listeners, updater } = await prepare(originConfig.filters)
  originConfig.filters = scheme

  /* eslint-disable no-new */
  new (Vue.extend(Page))({
    el: '#app',
    // render: h => h(Page),
    propsData: {
      scheme: originConfig,
      listeners,
      updater
    }
  })
}

main()
