import { values } from "../configs.js";
import { getAmountText } from "./get-amount-text.js";
import { getHighScores } from "./get-high-scores.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { acceptMission } from "./accept-mission.js";
import { cancelMission } from "./cancel-mission.js";
import { showMissionsMenu } from "./show-missions-menu.js";
import { getLevel } from "./calc-level.js";
import { xpToGoForNextLevel } from "./calc-level.js";
import { totalXpNextLevel } from "./calc-level.js";
import { nextLevelPercent } from "./calc-level.js";

export const setupVueApp = () => {
  values.vueApp = new Vue({
    el: '#app',
    data: {
      loggedIn: false,
      uid: undefined,
      email: undefined,
      loading: true,
      money: '',
      xp: '',
      selectPlantMenuMeta: '',
      plantInfoMeta: '',
      shelfLimitMenuMeta: '',
      plantMenuOpen: false,
      plantInfoMenuOpen: false,
      shelfLimitMenuOpen: false,
      missionsMenuOpen: false,
      statsVisible: false,
      stats: {waters: 0, planted: {}, harvested: {}},
      highscores: [],
      focusedHighscore: undefined,
      activeMission: undefined,
      availableMissions: []
    },
    methods: {
      logout() {
        logout()
      },
      login() {
        login()
      },
      async openStats() {
        this.statsVisible = true
        this.focusedHighscore = undefined
        this.highscores = await getHighScores()
      },
      closeStats() {
        this.statsVisible = false
      },
      setFocusedHighscore(data) {
        this.focusedHighscore = data
      },
      openMissionsMenu() {
        showMissionsMenu()
      },
      acceptMission(mission) {
        acceptMission(mission)
      },
      cancelMission() {
        cancelMission()
      },
      getLevel(offset) {
        return getLevel(offset)
      },
      xpToGoForNextLevel() {
        return xpToGoForNextLevel()
      },
      totalXpNextLevel() {
        return totalXpNextLevel()
      },
      nextLevelPercent() {
        return nextLevelPercent()
      },
    },
    computed: {
      getTotalPlanted() {
        if (this.focusedHighscore) return this.focusedHighscore.totalPlanted
        return Object.values(values.vueApp.stats.planted).reduce((t, v) => t + (v || 0), 0)
      },
      getTotalHarvested() {
        if (this.focusedHighscore) return this.focusedHighscore.totalHarvested
        return Object.values(values.vueApp.stats.harvested).reduce((t, v) => t + (v || 0), 0)
      },
      getWaters() {
        if (this.focusedHighscore) return this.focusedHighscore.totalWaters
        return getAmountText(values.vueApp.stats.waters)
      },
    }
  })
}