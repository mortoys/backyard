<template>
  <div id="page">

    <ui-table
      :scheme="scheme"
      :query="query"
      :data="table.data" :pagi="table.pagi"

      @mergeQuery="mergeQuery"
      @mergeQueryAndRefresh="mergeQueryAndRefresh"
      @selectTableScheme="selectTableScheme"
      @btnAction="btnAction"
      @rowAction="rowAction"

      @showModal="showModal"
    ></ui-table>

    <ui-dialog
      :visible="modal.visible"
      :scheme="modal.scheme"
      :data="modal.data"

      @closeModal="closeModal"
      @submitModal="submitModal"/>
  </div>
</template>

<script>
import uiTable from '@/components/index'
import uiDialog from '@/components/dialog'
import { get, forData, forNews } from './network/helpers'

export default {
  name: 'app',
  props: ['scheme', 'listeners', 'updater'],
  data () {
    return {
      query: {},

      table: {
        data: [],
        pagi: {}
      },

      modal: {
        visible: false,
        scheme: { form: [] },
        data: {}
      }
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    async refresh () {
      if (!this.scheme.table) return

      const ret = await forData(get(this.scheme.table.url, this.query))

      if (this.scheme.table.pagination) {
        this.table.data = ret.result
        this.table.pagi = ret.paginationInfo
      } else {
        this.table.data = ret
      }
    },

    mergeQueryAndRefresh (query) {
      query && this.mergeQuery(query)
      this.refresh()
    },

    selectTableScheme (scheme, query) {
      this.scheme.table = {}
      this.table = { data: [], pagi: {}}
      this.$nextTick(() => {
        this.scheme.table = scheme
        this.mergeQueryAndRefresh(query)
      })
    },

    async mergeQuery (query) {
      this.query = {
        ... this.query,
        ... query
      }

      // 处理 watch 标签 在link标签制定的数据变动时 重新拉取接口
      for (const q in query) {
        if (!query[q] || !query[q].length) return
        console.log(q, '键发生了变化', query)

        // 被观察的值变化时 删除观察者旧的值
        const props = this.listeners.filter(_ => _.watch === q).map(_ => _.name)
        props.forEach(prop => {
          if (this.query[prop] instanceof Array) this.query[prop] = []
          else this.query[prop] = null
        })

        this.scheme.filters = await this.updater(q, this.query)
      }
    },

    async rowAction (message, url, params) {
      await this.btnAction(message, url, params)
      await this.refresh()
    },

    async btnAction (message, url, params) {
      return await forNews(message, get(url, {
        ... this.query,
        ... params
      }))
    },

    showModal (config, data) {
      this.modal = {
        visible: true,
        data: data,
        scheme: config
      }
    },

    closeModal () {
      this.modal.visible = false
    },

    async submitModal (data, scheme) {
      this.modal.visible = false
      await forNews(scheme.news || '提交成功', get(scheme.url, data))
      this.refresh()
    }
  },
  components: {
    uiTable,
    uiDialog
  }
}
</script>


