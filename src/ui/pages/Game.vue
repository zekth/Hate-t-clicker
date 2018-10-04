<template>
  <section class="section">
    <notificationBar></notificationBar>
    <div class="container" ref="container">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-half has-text-centered">
          <h1 class="title is-1">Hate T Clicker</h1>
        </div>
        <div class="column"></div>
      </div>
      <div class="columns">
        <div class="column"></div>
        <div class="column is-half has-text-centered">
          <clickButton></clickButton>
        </div>
        <div class="column"></div>
      </div>
      <GlobalStatus></GlobalStatus>
      <bulkStatus></bulkStatus>
      <stageContainer></stageContainer>
    </div>
    <devBar></devBar>
  </section>
</template>

<script>
import devBar from './dev/devbar'
import GlobalStatus from './game/global-status'
import clickButton from './game/click-button'
import bulkStatus from './common/bulkstatus'
import stageContainer from './game/stages/container'
import notificationBar from './game/notifications/bar'
export default {
  components: { GlobalStatus, clickButton, devBar, bulkStatus, stageContainer, notificationBar },
  methods: {}
}
</script>
