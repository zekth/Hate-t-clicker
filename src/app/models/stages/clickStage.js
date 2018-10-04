'use strict'
import consts from 'app/const'
import AutoStage from './autoStage'
class clickStage extends AutoStage {
  constructor(runner, baseState, saveState) {
    super(runner, baseState, saveState)
    this.type = consts.stageType.click
    this.baseClickMoney = 1
    this.baseClickCount = 1
  }
  get clickMoney() {
    return this.baseClickMoney
  }
  click() {
    return { count: this.baseClickCount, money: this.clickMoney }
  }
}
export default clickStage
