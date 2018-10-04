<template>
  <div>
    <nav class="navbar dev-navbar is-fixed-bottom" style="z-index:200">
      <!-- <button class="button is-primary" id="clickerStart">Start Clicker Loop</button>
      <button class="button is-danger" id="clickerStop">Stop Clicker Loop</button> -->
      <button class="button is-warning" v-on:click="saveGame" id="saveLocalStorage">Save Game</button>
      <button class="button is-warning" v-on:click="openLoadModal" id="saveLocalStorage">Load Game</button>
      <button class="button is-warning" v-on:click="emptyLocalStorage" id="emptyLocalStorage">Erase Saved Game</button>
    </nav>
    <div class="modal" v-bind:class="{'is-active':isModalactive}">
      <div v-on:click="closeLoadModal" class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Load SaveGame</p>
          <button v-on:click="closeLoadModal" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="control">
              <textarea style="resize: none;" v-model="savePaste" class="textarea is-small" type="text" placeholder="Paste SaveState" rows="10"></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button v-on:click="loadGame" class="button is-success">Load</button>
          <button v-on:click="closeLoadModal" class="button">Cancel</button>
        </footer>
      </div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isModalactive: false,
      savePaste: ''
    }
  },
  methods: {
    openLoadModal: function() {
      this.isModalactive = true
    },
    closeLoadModal: function() {
      this.isModalactive = false
      this.savePaste = ''
    },
    loadGame: function() {
      this.$store.state.runner._setLocalStorage(this.savePaste)
      this.savePaste = ''
      this.isModalactive = false
      this.$store.state.runner._initProcess()
    },
    saveGame: function() {
      this.$store.state.runner._updateSaveState(true)
    },
    emptyLocalStorage: function() {
      window.localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
