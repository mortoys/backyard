import FormItemVN from './form-item'

export const formVN = (h, { props, listeners }) => h(
  'el-form', {
    props: {
      inline: props.inline,
      'label-width': props.inline ? '' : '120px',
      model: props.model
    }
  },

  props.config &&
  props.config.map(item => h(
    'el-form-item', {
      props: {
        label: item.label,
        prop: item.name,
        rules: item.rules
      }
    },

    FormItemVN[item.type]
    ? [FormItemVN[item.type](h, {
      config: item,
      value: props.query[item.name],
      listeners,
      scheme: props.scheme
    })]
    : []
  ))
)

export default {
  functional: true,
  render: formVN
}
