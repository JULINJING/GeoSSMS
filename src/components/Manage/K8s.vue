<template>
  <div style="width: 100%;height: 100%">
    <iframe :src='src' frameborder="0" style="width: 100%;height: 100%"></iframe>
  </div>
</template>

<script>

export default {
  name: "K8S",
  data() {
    return {
      src:'http://125.220.153.23:31885'

    }
  }

}
</script>

<style scoped>

</style>
