import { values } from "../configs.js";
import { getAmountText } from "./get-amount-text.js";
import { getHighScores } from "./get-high-scores.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { acceptMission } from "./accept-mission.js";
import { cancelMission } from "./cancel-mission.js";

export const setupVueApp = () => {
  values.vueApp = new Vue({
    el: '#app',
    data: {
      loggedIn: false,
      uid: undefined,
      email: undefined,
      loading: true,
      money: '',
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
        this.highscores = await getHighScores()
      },
      closeStats() {
        this.statsVisible = false
      },
      acceptMission(mission) {
        console.log("accept");
        acceptMission(mission)
      },
      cancelMission() {
        cancelMission()
      },
    },
    computed: {
      getTotalPlanted() {
        return Object.values(values.vueApp.stats.planted).reduce((t, v) => t + (v || 0), 0)
      },
      getTotalHarvested() {
        return Object.values(values.vueApp.stats.harvested).reduce((t, v) => t + (v || 0), 0)
      },
      getWaters() {
        return getAmountText(values.vueApp.stats.waters)
      }
    }
  })
}