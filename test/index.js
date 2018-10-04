import Runner from 'app/app'
import assert from 'assert'
import sinon from 'sinon'
import _ from 'lodash'
import Logger from 'app/utils/logger'
import Autostage from 'app/models/stages/autoStage'
import eventStack from 'app/models/eventStack'
import Event from 'app/models/event'
import stages from 'app/stages'
import htmlStage from 'app/stages/html'
import Clickstage from 'app/models/stages/clickStage'
import { beforeEach } from 'mocha'
process.env.TZ = 'Europe/Amsterdam'

let ressourceSaveState = {
  lastLoopTS: '2018-08-21T11:45:54.401Z',
  money: 500,
  linesCount: 250,
  currentTimer: 12679.785333333464,
  clickCount: 35,
  autoStages: [
    { id: 1, number: 10, isUnlocked: true },
    { id: 2, number: 0, isUnlocked: false },
    { id: 3, number: 0, isUnlocked: false },
    { id: 4, number: 0, isUnlocked: false },
    { id: 5, number: 0, isUnlocked: false },
    { id: 6, number: 0, isUnlocked: false },
    { id: 7, number: 0, isUnlocked: false },
    { id: 8, number: 0, isUnlocked: false },
    { id: 9, number: 0, isUnlocked: false }
  ],
  clickStage: { id: 0, number: 10, isUnlocked: true }
}
let encryptedSaveState = "b57b2466344d90f5c76f3f076dc5405813088539d08f1a29366dd69ebcbaab40f1eacad1c7acb4f4d9a28ca3d4361f5965145f4c314ad2393365952c19efe92fc32a67cfd85f4b54d90affb6b9638fc23be9acd220fdb0e80bcb7a0fb97ef064fb57140aeb53202cdf2bc3dd7fc101a49f870b94456142687c756123a4b29a7fd6c3838df6fac2bbd4594bc00976e483c563819a0dad6c36c0b30be3f5dde6a525024490aab497c39f5780a04ead6e04390d6dd9c5e58e3eec03ef12f087cb373d021f081b788e107b38cc405f99402b5c06749a866c5f9c7362a4750a42e37a90aab4cf88d5bde3caa26a0eaa65135331363c351eed489fccfbda2a405e982444e3667f6a77e56c5dbef3d690c9d5cfdad6ff33ca4461d9341bfe3742f485528725b68fe9d69f6beaf267b265123e9b04feb86c960ef00280666516f99b53bd077f42c50e275172daade0534d181891368723fc3b671b20c37250db1595592a916c78497a7070ea509958efecea09ce78440daeda080e0e299cbb613cf1d811bdc5400e77731241ba64b2ac6e3bd48924542c1aabcc00f83a62b9b83700f7e4a5299720dbe4d3d3bd91d6d135707d577f9fcbfd8ef69a1b4e7a048ba18b23876ce2058502dc3f78558e8afdc081a6f8135d180538953474aac5c7d55fbeb02d5f0825909c94f6cf17ee8466636f1ed77d2ca02264e95ed0301035c0fa470c8d6622783853fd342ddc36bc7ae9dbd12e0db12ad4d6b057fc5e20"
let sandbox
let loggerDoAction
describe('Test Suite', function() {
  beforeEach(function() {
    sandbox = sinon.createSandbox()
    loggerDoAction = sandbox.stub(Logger.prototype, '_doAction')
    global.window = {
      localStorage: {
        getItem: function() {
          return null
        },
        setItem: function() {
          return true
        }
      }
    }
  })
  afterEach(function() {
    sandbox.restore()
  })

  describe('Logger', function() {
    it('Should call do action in any case', function() {
      let log = new Logger()
      log.warn('foo', { bar: 'bar' })
      log.debug('foo', { bar: 'bar' })
      log.info('foo', { bar: 'bar' })
      log.log('foo', { bar: 'bar' })
      log.trace('foo', { bar: 'bar' })
      log.error('foo', { bar: 'bar' })
      assert.equal(loggerDoAction.callCount, 6)
    })
    it('Output correctly', function() {
      let clock = sinon.useFakeTimers({ now: 1534860716 })
      loggerDoAction.restore()
      let log = new Logger()
      let spyLog = sinon.spy(console, 'log')
      let spyWarn = sinon.spy(console, 'warn')
      let spyDebug = sinon.spy(console, 'debug')
      let spyInfo = sinon.spy(console, 'info')
      let spyTrace = sinon.spy(console, 'trace')
      let spyError = sinon.spy(console, 'error')
      log.warn('foo', { bar: 'bar' })
      log.debug('foo', { bar: 'bar' })
      log.info('foo', { bar: 'bar' })
      log.log('foo', { bar: 'bar' })
      log.trace('foo', { bar: 'bar' })
      log.error('foo', { bar: 'bar' })
      assert.equal(spyDebug.firstCall.lastArg, '[DEBUG] [19:21:00] foo {"bar":"bar"}')
      assert.equal(spyInfo.firstCall.lastArg, '[INFO] [19:21:00] foo {"bar":"bar"}')
      assert.equal(spyWarn.firstCall.lastArg, '[WARN] [19:21:00] foo {"bar":"bar"}')
      assert.equal(spyLog.firstCall.lastArg, '[LOG] [19:21:00] foo {"bar":"bar"}')
    })
  })

  const RATE = 30
  describe('Runner', function() {
    it('Should instanciate properly without saveState', function() {
      let getItem = sinon.spy(global.window.localStorage, 'getItem')
      let runner = new Runner(RATE)
      assert.equal(runner.framerate, RATE)
      assert.equal(getItem.callCount, 1)
      assert.equal(runner.money, 0)
      assert.equal(runner.linesCount, 0)
      assert.equal(runner.clickCount, 0)
      assert.equal(runner.currentTimer, 0)
      assert.equal(runner.LoopCount, 0)
      assert.equal(runner.lastLoopTS, null)
      assert.equal(runner.happinness, 100)
      assert.equal(runner.productivity, 1)
      assert.equal(runner.bulkStatus, 1)
      assert.equal(_.isObject(runner.clickStage), true)
      assert.equal(_.isArray(runner.autoStages), true)
      runner.collect()
      assert.equal(runner.money, 0)
      assert.equal(runner.linesCount, 0)
      assert.equal(runner.moneyGenerated, 0)
      assert.equal(runner.moneyGeneratedStr, '0.00')
    })
    it('Should instanciate properly without saveState and default constructor', function() {
      let runner = new Runner()
      assert.equal(runner.framerate, RATE)
    })
    it('encrypt decrypt', function() {
      let runner = new Runner()
      let test = runner._encrypt(ressourceSaveState)
      let result = runner._decrypt(test)
      assert.deepEqual(result, ressourceSaveState)
    })
    it('Should instanciate properly with a saveStateJson', function() {
      global.window = {
        localStorage: {
          getItem: function() {
            return JSON.stringify(ressourceSaveState)
          },
          setItem: function() {
            return true
          }
        }
      }
      let runner = new Runner(RATE)
      assert.equal(runner.clickCount, ressourceSaveState.clickCount)
      assert.equal(runner.linesCount, ressourceSaveState.linesCount)
      assert.equal(runner.lastLoopTS, ressourceSaveState.lastLoopTS)
      assert.equal(runner.currentTimer, ressourceSaveState.currentTimer)
      assert.equal(runner.money, ressourceSaveState.money)
      runner.collect()
      assert.equal(runner.money > ressourceSaveState.money, true)
      assert.equal(runner.linesCount > ressourceSaveState.linesCount, true)
      runner.lastLoopTS = null
      runner.doLoop()
      assert.equal(runner.LoopCount, 1)
      runner.lastLoopTS = new Date()
      runner.lastLoopTS.setSeconds(runner.lastLoopTS.getSeconds() - 1)
      runner.doLoop()
      assert.equal(runner.LoopCount > 30, true)
    })
    it('Should instanciate properly with a saveStateAES', function() {
      global.window = {
        localStorage: {
          getItem: function() {
            return encryptedSaveState
          },
          setItem: function() {
            return true
          }
        }
      }
      let runner = new Runner(RATE)
      assert.equal(runner.clickCount, ressourceSaveState.clickCount)
      assert.equal(runner.linesCount, ressourceSaveState.linesCount)
      assert.equal(runner.lastLoopTS, ressourceSaveState.lastLoopTS)
      assert.equal(runner.currentTimer, ressourceSaveState.currentTimer)
      assert.equal(runner.money, ressourceSaveState.money)
      runner.collect()
      assert.equal(runner.money > ressourceSaveState.money, true)
      assert.equal(runner.linesCount > ressourceSaveState.linesCount, true)
      runner.lastLoopTS = null
      runner.doLoop()
      assert.equal(runner.LoopCount, 1)
      runner.lastLoopTS = new Date()
      runner.lastLoopTS.setSeconds(runner.lastLoopTS.getSeconds() - 1)
      runner.doLoop()
      assert.equal(runner.LoopCount > 30, true)
    })
    it('ToString', function() {
      let runner = new Runner(RATE)
      assert.equal(typeof runner.toString(), 'string')
    })
    it('Bulk Status', function() {
      let runner = new Runner(RATE)
      assert.equal(runner.bulkStatus, 1)
      runner.setBulk(10)
      assert.equal(runner.bulkStatus, 10)
    })
    it('Get Stage', function() {
      let runner = new Runner(RATE)
      assert.equal(runner.getStage(0) instanceof Clickstage, true)
      assert.equal(runner.getStage(1) instanceof Autostage, true)
      assert.equal(runner.getStage(1) instanceof Clickstage, false)
    })
    it('Click', function() {
      let runner = new Runner(RATE)
      assert.equal(runner.clickCount, 0)
      assert.equal(runner.money, 0)
      assert.equal(runner.linesCount, 0)
      runner.click()
      assert.equal(runner.clickCount, 1)
      assert.equal(runner.money, 1)
      assert.equal(runner.linesCount, 1)
    })
    it('can Buy', function() {
      let runner = new Runner(RATE)
      assert.equal(runner.canBuy('stage', 0), false)
      runner.money = 1
      assert.equal(runner.canBuy('stage', 0), true)
      assert.equal(runner.canBuy('stage', -1), false)
    })
    it('Buy', function() {
      let runner = new Runner(RATE)
      let setItem = sinon.spy(global.window.localStorage, 'setItem')
      assert.equal(runner.buy('stage', 0), false)
      assert.equal(runner.buy('stage', -1), false)
      runner.money = 1
      assert.equal(runner.buy('stage', 0), true)
      assert.equal(runner.money, 0)
      assert.equal(runner.clickStage.number, 1)
      assert.equal(setItem.callCount, 1)
    })
  })
  describe('Event Stack', function() {
    it('Should instanciate properly', function() {
      let runner = new Runner(RATE)
      let _eventStack = new eventStack(runner)
      assert.equal(_eventStack.runner instanceof Runner, true)
      assert.equal(_eventStack.stack instanceof Array, true)
      assert.equal(_eventStack.stack.length, 0)
    })
    it('gotEvent', function() {
      let runner = new Runner(RATE)
      let _eventStack = new eventStack(runner)
      assert.equal(_eventStack.gotEvent(), false)
      _eventStack.stack.push({})
      assert.equal(_eventStack.gotEvent(), true)
    })
    it('setEvent', function() {
      let runner = new Runner(RATE)
      let _eventStack = new eventStack(runner)
      let _event = new Event('test', 0)
      _eventStack.setEvent(_event)
      assert.equal(_eventStack.gotEvent(), true)
      assert.deepEqual(_eventStack.stack[0], _event)
      let err
      try {
        _eventStack.setEvent({})
      } catch (e) {
        err = e
      }
      assert.equal(err instanceof Error, true)
    })
    it('getEvents', function() {
      let runner = new Runner(RATE)
      let _eventStack = new eventStack(runner)
      let _event = new Event('test', 0)
      _eventStack.setEvent(_event)
      let r = _eventStack.getEvents()
      assert.equal(r.length, 1)
      assert.equal(_eventStack.gotEvent(), true)
      assert.equal(_eventStack.stack.length, 1)
      r = _eventStack.getEvents(true)
      assert.equal(r.length, 1)
      assert.equal(_eventStack.gotEvent(), false)
      assert.equal(_eventStack.stack.length, 0)
    })
  })
  describe('Stage', function() {
    it('Should instanciate properly', function() {
      let runner = new Runner(RATE)
      let s = new Autostage(runner, stages[0])
      assert.equal(s.title, htmlStage.title)
      assert.equal(s.lps, htmlStage.lps)
      assert.equal(s.baseMoneyGenerated, htmlStage.baseMoneyGenerated)
      assert.equal(s.basePrice, htmlStage.basePrice)
    })
    it('Should add', function() {
      let runner = new Runner(RATE)
      let s = new Autostage(runner, stages[0])
      assert.equal(s.number, 0)
      assert.equal(s.isUnlocked, false)
      s.add()
      assert.equal(s.isUnlocked, true)
      assert.equal(s.number, 1)
      s.add(2)
      assert.equal(s.number, 3)
    })
    it('properties', function() {
      let runner = new Runner(1000)
      let FakeStage = {
        id: 1,
        title: 'FakeStage',
        description: 'foobar',
        lps: 1,
        baseMoneyGenerated: 2,
        basePrice: 10
      }
      let s = new Autostage(runner, FakeStage)
      s.add()
      assert.equal(s.codeGenerated, 1)
      assert.equal(s.moneyGenerated, 2)
      assert.equal(s.moneyGeneratedStr, '2.00')
      assert.equal(typeof s.toString(), 'string')
    })
    it('Should collect', function() {
      let runner = new Runner(1000)
      let FakeStage = {
        id: 1,
        title: 'FakeStage',
        description: 'foobar',
        lps: 1,
        baseMoneyGenerated: 2,
        basePrice: 10
      }
      let s = new Autostage(runner, FakeStage)
      let result = s.collect()
      assert.equal(result.count, 0)
      assert.equal(result.money, 0)
      s.add()
      result = s.collect()
      assert.equal(result.count, 1)
      assert.equal(result.money, 2)
    })
  })
  describe('Achievements', function() {
    describe('Buy', function() {
      it('Should instanciate properly', function() {
        let runner = new Runner(RATE)
        assert.equal(runner.achievements.buy.achievements.length > 0, true)
      })
      it('get Achievement', function() {
        let runner = new Runner(RATE)
        assert.equal(runner.achievements.buy.getAchievement('test'), null)
        assert.equal(runner.achievements.buy.getAchievement('b-1-5') instanceof Object, true)
      })
      it('Testing condition', function() {
        let runner = new Runner(RATE)
        let a = runner.achievements.buy.getAchievement('b-1-5')
        assert.equal(a.condition(), false)
        assert.equal(a.unlocked, false)
        runner.setBulk(5)
        runner.money = 999999999999999
        runner.buy('stage', 1)
        assert.equal(a.condition(), true)
        assert.equal(a.unlocked, true)
        assert.equal(a.condition(), true)
      })
      it('Testing condition should throw an error', function() {
        let runner = new Runner(RATE)
        sandbox.stub(Runner.prototype, 'getStage').returns(null)
        let a = runner.achievements.buy.getAchievement('b-1-5')
        let err
        try {
          a.condition()
        } catch (e) {
          err = e
        }
        assert.equal(err instanceof Error, true)
      })
    })
  })
})
