<template>
  <div>
    <label for="bulkstatus">Bulk buy</label>
    <div class="select is-rounded">
      <select v-on:change="bulkChange" v-model="bulkValue">
        <option>1</option>
        <option>10</option>
        <option>100</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    bulkChange: function(e) {
      this.$store.dispatch('bulkChange', e.target.value)
      this.bulkValue = e.target.value
    }
  },
  beforeMount() {
    this.bulkValue = this.$store.getters.bulkValue
  }
}
</script>
