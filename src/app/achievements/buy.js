import find from 'lodash/find'
// const steps = [10, 30, 50, 100, 200, 250, 500, 1000]
const steps = [1, 2, 3, 4, 5, 6, 7, 8]
class buyAchievements {
  constructor(runner) {
    this.runner = runner
    this.achievements = []
    this._initAchievements()
  }
  getAchievement(id) {
    return find(this.achievements, a => {
      return a.achievementId === id
    })
  }
  _initAchievements() {
    this.runner.autoStages.forEach(s => {
      steps.forEach(step => {
        this.achievements.push({
          runner: this.runner,
          achievementId: `b-${s.id}-${step}`,
          unlocked: false,
          step: step,
          stageId: s.id,
          condition: function() {
            if (this.unlocked) {
              return true
            }
            let _stage = this.runner.getStage(this.stageId)
            if (_stage) {
              if (_stage.number >= this.step) {
                this.unlocked = true
                return _stage.number >= this.step
              } else {
                return false
              }
            } else {
              throw new Error('Stage not found')
            }
          }
        })
      })
    })
  }
}
export default buyAchievements
