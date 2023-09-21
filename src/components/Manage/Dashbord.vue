<template>
  <div style="width: 100%;height: 100%">
    <iframe :src='src' frameborder="0" style="width: 100%;height: 100%"></iframe>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Dashbord",
  data() {
    return {
      src:'http://125.220.153.23:8888/instances/bd43e6c6b245/details'

    }
  }

}
</script>

<style scoped>

</style>
