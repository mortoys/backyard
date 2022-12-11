const inputNumberVN = (h, { config, value, listeners }) => h(
  'el-input-number', {
    props: {
      ... config,
      value: value
    },
    on: {
      input: newValue => listeners.mergeQuery({ [config.name]: newValue })
    }
  }
)

const selectVN = (h, { config, value, listeners }) => h(
  'el-select', {
    props: {
      ... config,
      value: value
    },
    on: {
      input: newValue => listeners.mergeQuery({ [config.name]: newValue })
    }
  },

  config.enum.map &&
  config.enum.map(item => h(
    'el-option', {
      props: {
        label: item.label,
        value: item.value
      }
    }
  ))
)

const inputVN = (h, { config, value, listeners }) => h(
  'el-input', {
    props: {
      ... config,
      value: value
    },
    on: {
      input: newValue => listeners.mergeQuery({ [config.name]: newValue })
    }
  }
)

const datepickerVN = (h, { config, value, listeners }) => h(
  'el-date-picker', {
    props: {
      ... config,
      value
    },
    on: {
      input: newValues => {
        const formatBeforeSend = date =>
          config.type === 'datetimerange'
          ? date.toLocaleDateString().replace(/\//g, '-') + ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          : date.toLocaleDateString().replace(/\//g, '-')

        if (newValues) {
          newValues instanceof Array
            ? newValues.forEach(value => (value.formatBeforeSend = formatBeforeSend))
            : newValues.formatBeforeSend = formatBeforeSend
        }

        listeners.mergeQuery({ [config.name]: newValues })
      }
    }
  }
)

const buttonVN = (h, { config, value, listeners, scheme }) => h(
  'el-button', {
    props: {
      ... config,
      type: config.action.news ? 'primary' : 'default'
    },
    on: {
      click: async () => {
        if (config.action.news) await listeners.btnAction(config.action.news, config.action.url, config.action.params)
        if (config.action.search) {
          await listeners.selectTableScheme(
            scheme.tables ? scheme.tables[config.action.search] : scheme.table, {
              ...config.action.params
            })
        }
        if (config.action.editor) listeners.showModal(config.action.editor, { ...config.action.params })
      }
    }
  },
  config.text
)

const colorPickerVN = (h, { config, value, listeners }) => h(
  'el-color-picker', {
    props: {
      ... config,
      value
    },
    on: {
      input: newValues => listeners.mergeQuery({ [config.name]: newValues })
    }
  }
)

const timeSelectVN = (h, { config, value, listeners }) => h(
  'el-time-picker', {
    props: {
      ... config,
      value
    },
    on: {
      input: newValues => {
        const formatBeforeSend = date => `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        if (newValues) {
          newValues instanceof Array
            ? newValues.forEach(value => (value.formatBeforeSend = formatBeforeSend))
            : newValues.formatBeforeSend = formatBeforeSend
        }

        listeners.mergeQuery({ [config.name]: newValues })
      }
    }
  }
)

export default {
  'select': selectVN,
  'input': inputVN,
  'input-number': inputNumberVN,
  'date': datepickerVN,
  'daterange': datepickerVN,
  'datetimerange': datepickerVN,
  'time-select': timeSelectVN,
  'button': buttonVN,
  'color-picker': colorPickerVN
}
