<template>
  <div>
    <component v-for="row in rows" :key="row.id" :is="getComponentName(row)" :row="row"></component>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'cmp-list-view',
  data () {
    return {
      rows: []
    }
  },
  created () {
    let rows = [
      { id: Math.ceil(Math.random() * 10000), name: '小明', template: '<div style="color:#409EFF">{{row.name}}</div>' },
      { id: Math.ceil(Math.random() * 10000), name: '小红', template: '<div style="color:#67C23A">{{row.name}}</div>' }
    ]

    for (let row of rows) {
      Vue.component(`cmp-${row.id}`, {
        props: ['row'],
        template: row.template
      })
    }

    this.rows = rows
  },
  methods: {
    getComponentName (row) {
      return `cmp-${row.id}`
    }
  }
}
</script>