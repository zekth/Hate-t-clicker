<template>
  <article class="message is-small">
    <div class="message-header">
      <p>{{ notification.id }}</p>
      <button v-on:click="deleteMe()" class="delete" aria-label="delete"></button>
    </div>
    <div class="message-body">
      Unlocked Achievement {{ notification.id }}
    </div>
  </article>
</template>

<script>
export default {
  props: ['notification'],
  methods: {
    deleteMe: function() {
      this.$emit('delete', this.notification.id)
    }
  }
}
</script>
