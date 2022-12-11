
const rowButton = (h, { config, scope, listeners }) => h(
  'el-button', {
    props: {
      size: 'small',
      type: config.type,
      plain: config.plain
    },
    on: {
      click: () => {
        config.action.url && listeners.rowAction(config.action.news, config.action.url, {
          ... scope.row,
          ... config.action.params
        })
        config.action.editor && listeners.showModal(config.action.editor, {
          ... scope.row,
          ... config.action.params
        })
      }
    }
  },
  config.text
)

export const tableVN = (h, { props, listeners }) => h(
  'el-table', {
    props: {
      data: ((data, preRender, preRenderRow) => {
        const temp = preRender ? preRender(data) : data
        return preRenderRow ? temp.map(row => preRenderRow(row)) : temp
      })(props.data, props.scheme.preRender, props.scheme.preRenderRow)
    }
  },
  props.scheme.columns &&
  props.scheme.columns.map(col =>
    h('el-table-column', {
      props: col,
      scopedSlots: col.buttons
      ? {
        default: scope =>
          col.buttons
            .filter(btn => btn.isShow ? btn.isShow(scope.row) : true)
            .map(btn => rowButton(h, { config: btn, scope, listeners }))
      }
      : null
    })
  )
)
