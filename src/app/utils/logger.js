'use strict'
let instance = null
class Logger {
  constructor() {
    if (instance) {
      return instance
    } else {
      instance = this
    }
  }
  _doAction(verb, ...Args) {
    let str = []
    let date = new Date()
    str.push(
      `[${verb.toUpperCase()}] [${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}]`
    )
    Args.forEach(a => {
      if (a === Object(a)) {
        str.push(JSON.stringify(a))
      } else {
        str.push(a)
      }
    })
    let s = str.join(' ')
    switch (verb.toUpperCase()) {
      case 'DEBUG':
        console.debug(s)
        break
      case 'INFO':
        console.info(s)
        break
      case 'WARN':
        console.warn(s)
        break
      case 'ERROR':
        console.error(s)
        break
      case 'TRACE':
        console.trace(s)
        break
      default:
        console.log(s)
        break
    }
  }
  debug(...Args) {
    this._doAction('debug', ...Args)
  }
  warn(...Args) {
    this._doAction('warn', ...Args)
  }
  error(...Args) {
    this._doAction('error', ...Args)
  }
  info(...Args) {
    this._doAction('info', ...Args)
  }
  trace(...Args) {
    this._doAction('trace', ...Args)
  }
  log(...Args) {
    this._doAction('log', ...Args)
  }
}
export default Logger
