'use strict'
import consts from 'app/const'
/**
 * @class
 */
class autoStage {
  constructor(runner, baseState) {
    this.runner = runner
    this.type = consts.stageType.auto
    this.id = baseState.id
    this.isUnlocked = false
    this.number = 0
    this.title = baseState.title
    this.description = baseState.description
    this.lps = baseState.lps
    this.basePrice = baseState.basePrice
    this.baseMoneyGenerated = baseState.baseMoneyGenerated
  }
  get saveState() {
    return {
      id: this.id,
      number: this.number,
      isUnlocked: this.isUnlocked
    }
  }
  _getMoneyGenerated() {
    return this.number * this.baseMoneyGenerated * this.lps
  }
  get moneyGenerated() {
    return this._getMoneyGenerated()
  }
  get moneyGeneratedStr() {
    return this._getMoneyGenerated().toFixed(2)
  }
  get codeGenerated() {
    return this.number * this.lps
  }
  get price() {
    let sum = 0
    for (let i = 1; i < this.runner.bulkStatus + 1; i++) {
      sum += this.basePrice * Math.pow(consts.coefPrice, Math.max(0, this.number + i - 1))
    }
    return Math.round(sum)
  }
  /**
   * Add the number of element for the stage.
   * Unlock it if not unlocked
   * @param {Number} count
   */
  add(count = 1) {
    if (!this.isUnlocked) {
      this.isUnlocked = true
    }
    this.number += count
  }
  /**
   * Collect the number of line and money
   * generated per rate of loop
   * @param {Number} rate
   * @param {Number} loopCount Number of loop to collect. Handling the lost focus
   */
  collect(loopCount = 1) {
    return {
      count: this.number * (this.lps / this.runner.timeOutloop) * loopCount,
      money: this.number * (this.lps / this.runner.timeOutloop) * this.baseMoneyGenerated * loopCount
    }
  }
  /**
   * Stringify the stage for debugging
   * @returns {string} Stringified status
   */
  toString() {
    return `id:${this.id} type:${this.type} Name:${this.title} number:${this.number} lps:${this.lps} basePrice:${
      this.basePrice
    } price:${this.price} moneyGenerated:${this.moneyGeneratedStr}`
  }
}
export default autoStage
