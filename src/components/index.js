import { formVN } from './form'
import { tableVN } from './table'
import { paginationVN } from './pagination'

export default {
  functional: true,
  render: (h, ctx) => h('div', [

    ctx.props.scheme.filters &&
    formVN(h, {
      props: {
        config: ctx.props.scheme.filters,
        query: ctx.props.query,
        scheme: ctx.props.scheme,
        inline: true
      },
      listeners: ctx.listeners
    }),

    // barVN(h, ctx),

    ctx.props.scheme.table &&
    tableVN(h, {
      ... ctx,
      props: {
        scheme: ctx.props.scheme.table,
        data: ctx.props.data
      }
    }),

    ctx.props.scheme.table &&
    ctx.props.scheme.table.pagination &&
    paginationVN(h, {
      ... ctx,
      props: ctx.props.pagi
    })
  ])
}

