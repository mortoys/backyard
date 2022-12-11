export const paginationVN = (h, { props, listeners }) => h(
  'el-pagination', {
    style: {
      float: 'right',
      marginTop: '10px'
    },
    props: {
      'current-page': props.currentPage || 1,
      'page-size': props.recordPerPage || 10,
      total: props.totalRecord || 0,
      layout: 'sizes, prev, pager, next, total'
    },
    on: {
      'current-change': number => listeners.mergeQueryAndRefresh({ pageNum: number }),
      'size-change': size => listeners.mergeQueryAndRefresh({ recordPerPage: size })
    }
  }
)
