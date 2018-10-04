import Vue from 'vue'
import Vuex from 'vuex'
import findIndex from 'lodash/findIndex'
import Runner from 'app/app.js'
const RATE = 30
let runner = new Runner(RATE)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    runner: runner
  },
  getters: {
    canBuyStage: state => id => {
      return state.runner.canBuy('stage', id)
    },
    stages: state => {
      return [].concat(state.runner.clickStage, ...state.runner.autoStages)
    },
    bulkValue: state => {
      return state.runner.bulkStatus
    },
    clickCount: state => {
      return state.runner.clickCount
    },
    moneyCount: state => {
      return state.runner.money
    },
    moneyCountPerSec: state => {
      return state.runner.moneyGeneratedStr
    },
    codeCount: state => {
      return state.runner.linesCount
    },
    time: state => {
      return state.runner.currentTimer
    },
    notifications: state => {
      return state.runner.eventStack.stack
    }
  },
  mutations: {
    click(state) {
      state.runner.click()
    },
    bulkChange(state, value) {
      state.runner.setBulk(value)
    },
    buyStage(state, value) {
      state.runner.buy('stage', value)
    },
    deleteNotification(state, id) {
      let l = findIndex(state.runner.eventStack.stack, n => {
        return n.id === id
      })
      if (l !== -1) {
        state.runner.eventStack.stack.splice(l, 1)
      }
    }
  },
  actions: {
    click(context) {
      context.commit('click')
    },
    bulkChange(context, value) {
      context.commit('bulkChange', value)
    },
    buyStage(context, value) {
      context.commit('buyStage', value)
    },
    deleteNotification(context, value) {
      context.commit('deleteNotification', value)
    }
  }
})
