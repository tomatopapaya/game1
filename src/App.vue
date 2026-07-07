<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<script lang="js">
import { RouterView } from 'vue-router'

export default {
  components: { RouterView }
}
</script>


<style scoped>
.app-wrapper {
  width: 820px;
  height: 485px;
  position: relative;
  overflow: hidden;
  background-image: url('/大楓樹.png'), url('/背景.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
}
</style>