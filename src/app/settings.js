import consts from 'app/const'

/**
 * @class
 */
class Settings {
  constructor() {
    this.moneyDisplayFormat = consts.moneyDisplayFormat.SHORTENED
    this._chkSettings()
  }

  _updateSettings() {
    this.log.debug('updating settings')
    let settings = {
      moneyDisplayFormat: this.moneyDisplayFormat
    }
    let strToStore = JSON.stringify(settings)
    window.localStorage.setItem(consts.settingsStorageId, strToStore)
  }

  /**
   * Check if the local storage have stored settings
   * If settings are found, load them.
   */
  _chkSettings() {
    let currentStorage = window.localStorage.getItem(consts.settingsStorageId)
    if (currentStorage) {
      this.loadSettings(JSON.parse(currentStorage))
    }
  }

  /**
   * Load settings
   * @param {settings} settings
   */
  _loadSettings(settings) {
    this.log.debug('Loading Settings')
    this.log.debug(settings)
    this.moneyDisplayFormat = settings.moneyDisplayFormat
  }
}
export default Settings
