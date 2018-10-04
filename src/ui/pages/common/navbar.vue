<template>
  <nav class="navbar is-transparent">
  <div class="navbar-brand">
    <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu">
    <div class="navbar-start">
      <router-link tag="a" class="navbar-item" to="/">
        Home
      </router-link>
      <router-link tag="a" class="navbar-item" to="/game">
        Game
      </router-link>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>
