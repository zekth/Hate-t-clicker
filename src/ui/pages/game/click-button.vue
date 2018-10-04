<template>
  <button v-on:click="click()" class="button is-black is-large is-fullwidth glitch" id="clicker">CODE MOTHERF***ER</button>
</template>

<script>
export default {
  methods: {
    click: function() {
      this.$store.dispatch('click')
    }
  }
}
</script>
