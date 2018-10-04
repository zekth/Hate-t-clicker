<template>
  <table id="stageStatus" class="table is-fullwidth is-striped is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>Type</th>
        <th>Name</th>
        <th>Number</th>
        <th>LPS</th>
        <th>BasePrice</th>
        <th>Price</th>
        <th>baseMoneyGenerated</th>
        <th>MoneyGenerated $/s</th>
        <!-- <th>Percent $</th> -->
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stage in stages" :key="stage.id">
        <td>{{stage.id}}</td>
        <td>{{stage.type}}</td>
        <td>{{stage.title}}</td>
        <td class="stg-number">{{stage.number}}</td>
        <td>{{stage.lps}}</td>
        <td>{{stage.basePrice}}</td>
        <td class="price">{{stage.price}}</td>
        <td>{{stage.baseMoneyGenerated}}</td>
        <td class="money">{{stage.moneyGeneratedStr}}</td>
        <!-- <td class="percent">0</td> -->
        <td><button v-on:click="buy(stage.id)" class="button buy-stage" :disabled="!canBuy(stage.id)">Buy</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  computed: {},
  methods: {
    buy: function(id) {
      return this.$store.dispatch('buyStage', id)
    },
    canBuy: function(id) {
      return this.$store.getters.canBuyStage(id)
    }
  },
  beforeMount() {
    this.stages = this.$store.getters.stages
  }
}
</script>

<style>
</style>
