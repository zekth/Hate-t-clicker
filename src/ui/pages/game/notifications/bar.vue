<template>
  <div class="notification-bar" v-bind:class="{ 'toggled': toggled }">
      <div class="notification-center">
        <notification @delete="deleteNotif" v-for="notif in notifications" :notification="notif" :key="notif.id"></notification>
      </div>
      <div class="notification-toggle">
        <button v-on:click="toggle">Toggle</button>
      </div>
    </div>
</template>

<script>
import notification from './notification'
export default {
  data() {
    return {
      toggled: true
    }
  },
  components: { notification },
  methods: {
    deleteNotif: function(id) {
      this.$store.dispatch('deleteNotification', id)
      this.$forceUpdate()
    },
    toggle: function() {
      console.log('method toggle')
      this.toggled = !this.toggled
    }
  },
  beforeMount() {
    this.notifications = this.$store.getters.notifications
  }
}
</script>
