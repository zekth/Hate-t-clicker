<template>
  <nav class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Time</p>
        <p class="title" id="time">{{time}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Money</p>
        <p class="title" id="moneyCount">{{moneyCount}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Money Per sec</p>
        <p class="title" id="moneyCountPerSec">{{moneyCountPerSec}} $/s</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Clicks</p>
        <p class="title" id="clickCount">{{clickCount}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Code Lines</p>
        <p class="title" id="codeCount">{{codeCount}}</p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    formatTime(seconds) {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = seconds % 60
      return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(a => a).join(':')
    }
  },
  computed: {
    clickCount() {
      return this.$store.getters.clickCount
    },
    moneyCount() {
      return this.$store.getters.moneyCount.toFixed(2)
    },
    moneyCountPerSec() {
      return this.$store.getters.moneyCountPerSec
    },
    codeCount() {
      return this.$store.getters.codeCount.toFixed(0)
    },
    time() {
      return this.formatTime(this.$store.getters.time.toFixed(0))
    }
  }
}
</script>
