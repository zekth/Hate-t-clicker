'use strict'
import clickerEvent from './event'
class eventStack {
  constructor(runner) {
    this.runner = runner
    this.stack = []
  }
  gotEvent() {
    return this.stack.length > 0
  }
  getEvents(flush) {
    let output = this.stack.slice(0)
    if (flush) {
      this.stack = []
    }
    return output
  }
  setEvent(event) {
    if (!(event instanceof clickerEvent)) {
      throw new Error('not an event')
    } else {
      this.stack.push(event)
    }
  }
}
export default eventStack
