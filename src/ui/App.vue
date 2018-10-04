
<template>
  <div id="app">
  <NavBar></NavBar>
    <router-view/>
  </div>
</template>

<script>
import NavBar from './pages/common/navbar'
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>
