'use strict'
import BuyAchievements from './buy'
// const achievements = {
//   buy: new buyAchievements(),
//   misc: null
// }
class achievements {
  constructor(runner) {
    this.runner = runner
    this.buy = new BuyAchievements(this.runner)
    this.misc = null
  }
}
export default achievements
