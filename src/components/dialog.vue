<template>
  <el-dialog
    :visible="visible"
    @update:visible="vis => !vis && $emit('closeModal')"
    title='编辑'
    size='tiny'
  >
    <ui-form
      :config="scheme.form"
      :query="formData"
      @mergeQuery="mergeQuery"
      :inline='false'
      :model="scheme.preSend ? scheme.preSend(formData) : formData"
    ></ui-form>
    <span slot="footer" class='dialog-footer'>
      <el-button @click="$emit('closeModal')">取 消</el-button>
      <el-button @click="submitModal" type='primary'>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>

import uiForm from './form'
import { prepare } from '../prepare'

export default {
  props: ['visible', 'scheme', 'data'],
  data () {
    return {
      formData: {}
    }
  },
  watch: {
    async visible (vis) {
      if (vis) {
        this.formData = JSON.parse(JSON.stringify(this.data))
        // const { scheme, listeners, updater } = await prepare(this.scheme.form)
        const { scheme } = await prepare(this.scheme.form)
        this.scheme.form = scheme
      }
    }
  },
  methods: {
    mergeQuery (query) {
      this.formData = {
        ... this.formData,
        ... query
      }
    },
    submitModal () {
      // 函数式组件 不能设定ref 出此下策
      const $form = this.$children[0].$children[2]

      $form.validate(valid => {
        if (valid) this.$emit('submitModal', this.formData, this.scheme)
        else return false
      })
    }
  },
  components: {
    uiForm
  }
}
</script>
