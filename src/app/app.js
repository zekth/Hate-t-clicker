'use strict'
import Logger from './utils/logger'
// import saveState from './models/saveState'
import sumBy from 'lodash/sumBy'
import find from 'lodash/find'
import Achievements from 'app/achievements'
import ClickStage from 'app/models/stages/clickStage'
import AutoStage from 'app/models/stages/autoStage'
import EventStack from 'app/models/eventStack'
import ClickerEvent from 'app/models/event'
import stages from 'app/stages'
import clickStageData from 'app/stages/click'
import consts from 'app/const'
import aesjs from 'aes-js'
let k1 = [1, 7, 3, 4, 1, 6]
let p2 = [7, 8, 4, 2, 1, 7]
let q3 = [13, 6, 6, 6]
/**
 * @class
 */
class Runner {
  constructor(framerate = 30) {
    this.log = new Logger()
    this.log.debug('New runner')
    this.framerate = framerate
    this.timeOutloop = 1000 / this.framerate
    this.money = 0
    this.linesCount = 0
    this.clickCount = 0
    this.currentTimer = 0
    this.LoopCount = 0
    this.lastLoopTS = null
    this.lastSaveTime = 0
    this.happinness = 100
    this.productivity = 1
    this.bulkStatus = 1

    this.eventStack = new EventStack(this)
    this.clickStage = new ClickStage(this, clickStageData)
    this.autoStages = []
    stages.forEach(s => {
      this.autoStages.push(new AutoStage(this, s))
    })
    this.achievements = new Achievements(this)

    this._initProcess()
  }
  _initProcess() {
    this._chkLocalStorage()
    this._chkAchievements()
    this.log.debug('initialization complete')
  }
  /**
   * Checking the achievements unlocked
   * @param {boolean} eventPush Pushing to the EventStack or not
   * @param {string} type type of achievement
   */
  _chkAchievements(eventPush = true, type = 'ALL') {
    this.achievements.buy.achievements.forEach(a => {
      if (a.condition()) {
        this.eventStack.setEvent(new ClickerEvent(consts.eventTypes.achievementUnlocked, a.achievementId))
      }
    })
  }
  _getMoneyGenerated() {
    let sumMoney = sumBy(this.autoStages, s => {
      return s.moneyGenerated
    })
    sumMoney += this.clickStage.moneyGenerated
    return sumMoney
  }
  get moneyGenerated() {
    return this._getMoneyGenerated()
  }
  get moneyGeneratedStr() {
    return this._getMoneyGenerated().toFixed(2)
  }
  /**
   * Set the bulk value for next buy
   * @param {Number|String} value
   */
  setBulk(value) {
    this.log.debug('setBulk', value)
    this.bulkStatus = Number(value)
  }
  /**
   * Do a click event on clickstage
   */
  click() {
    let r = this.clickStage.click()
    this.clickCount++
    this.money += r.money
    this.linesCount += r.count
  }
  /**
   * Buy an element
   * @param {string} type Type of the element to buy
   * @param {Number} id Id of the element to buy
   * @returns {boolean} returns if the element has been bought or not
   */
  buy(type, id) {
    let objectToBuy = this.getStage(id)
    if (!objectToBuy) {
      this.log.debug('objectToBuy not defined')
      return false
    }
    let amount = Math.trunc(objectToBuy.price)
    if (this._chkBuy(amount)) {
      this.money -= amount
      objectToBuy.add(this.bulkStatus)
      this._updateSaveState(true)
      return true
    } else {
      this.log.debug('Buy not allowed')
      return false
    }
  }
  canBuy(type, id) {
    let objectToBuy = this.getStage(id)
    if (!objectToBuy) {
      this.log.warn('objectToBuy not defined')
      return false
    }
    let amount = Math.trunc(objectToBuy.price)
    return this._chkBuy(amount)
  }
  /**
   * Check if the buy action is possible with the current money
   * and the amount of the buy
   * @param {Number} amount
   * @returns {Boolean}
   */
  _chkBuy(amount) {
    return amount <= Math.trunc(this.money)
  }
  /**
   * collect the generated money and lines
   * within a loopTime.
   * Also update the save state
   * @param {Number} loopCount Number of loop to collect. Handling the lost focus
   */
  collect(loopCount = 1) {
    let sumMoney = sumBy(this.autoStages, s => {
      return s.collect(loopCount).money
    })
    let sumCount = sumBy(this.autoStages, s => {
      return s.collect(loopCount).count
    })
    this.money += sumMoney + this.clickStage.collect(loopCount).money
    this.linesCount += sumCount + this.clickStage.collect(loopCount).count
    this._updateSaveState()
  }
  /**
   * Loop event to be run in a setInterval
   * Collecting stuffs updating display
   */
  doLoop() {
    let currentLoopTS = new Date()
    let loopDelayCount = 1
    if (this.lastLoopTS) {
      loopDelayCount = (currentLoopTS - new Date(this.lastLoopTS)) / this.timeOutloop
    }
    this.lastLoopTS = currentLoopTS
    this.collect(loopDelayCount)
    this.currentTimer += (this.timeOutloop * loopDelayCount) / 1000
    this.LoopCount += loopDelayCount
  }
  _updateSaveState(force = false) {
    if (force || this.currentTimer - this.lastSaveTime > 60) {
      this.log.debug('updating SaveState')
      let saveState = {
        lastLoopTS: this.lastLoopTS,
        money: this.money,
        linesCount: this.linesCount,
        currentTimer: this.currentTimer,
        loopCount: this.loopCount,
        clickCount: this.clickCount,
        autoStages: [],
        clickStage: this.clickStage.saveState
      }
      this.autoStages.forEach(s => {
        saveState.autoStages.push(s.saveState)
      })
      this.lastSaveTime = this.currentTimer
      this._setLocalStorage(this._encrypt(saveState))
    }
  }
  _setLocalStorage(value) {
    window.localStorage.setItem(consts.localStorageId, value)
  }
  _shift() {
    return [].concat(...k1, ...p2, ...q3)
  }
  _encrypt(save) {
    let key = this._shift()
    let textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(save))
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5)) // eslint-disable-line
    let encryptedBytes = aesCtr.encrypt(textBytes)
    let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex.toString()
  }
  _decrypt(encryptedHex) {
    let key = this._shift()
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5)) // eslint-disable-line
    var decryptedBytes = aesCtr.decrypt(encryptedBytes)
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return JSON.parse(decryptedText)
  }
  /**
   * Check if the local storage have a saveState
   * If saveState is found, load it.
   */
  _chkLocalStorage() {
    window.localStorage.setItem(consts.localStorageSave, Buffer.from('LOL U NOOB').toString('base64'))
    let currentStorage = window.localStorage.getItem(consts.localStorageId)
    if (currentStorage) {
      if (currentStorage.startsWith('{')) {
        this._loadSaveState(JSON.parse(currentStorage))
      } else {
        this._loadSaveState(this._decrypt(currentStorage))
      }
    }
  }
  /**
   * Load the save state
   * @param {saveState} save
   */
  _loadSaveState(save) {
    this.log.debug('Loading Save State')
    this.log.debug(save)
    this.currentTimer = save.currentTimer
    this.log.debug(this.currentTimer.toFixed(0), save.currentTimer)
    this.money = save.money
    this.linesCount = save.linesCount
    this.lastLoopTS = save.lastLoopTS
    this.loopCount = save.loopCount
    this.clickCount = save.clickCount
    this.clickStage.number = save.clickStage.number
    this.clickStage.isUnlocked = save.clickStage.isUnlocked
    save.autoStages.forEach(s => {
      let cStage = this.getStage(s.id)
      cStage.number = s.number
      cStage.isUnlocked = s.isUnlocked
    })
    // TODO Load achievements
  }
  /**
   * Stringify the runner for debugging
   * @returns {string} Stringified status
   */
  toString() {
    return `happiness:${this.happinness} framerate:${this.framerate} productivityMulitplier:${this.productivity}`
  }
  getStage(id) {
    if (id === 0) {
      return this.clickStage
    }
    let objectToBuy = find(this.autoStages, e => {
      return e.id === id
    })
    return objectToBuy
  }
}
export default Runner
