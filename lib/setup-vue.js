import { values } from "../configs.js";
import { getAmountText } from "./get-amount-text.js";
import { getHighScores } from "./get-high-scores.js";
import { login } from "./login.js";
import { logout } from "./logout.js";

export const setupVueApp = () => {
  values.vueApp = new Vue({
    el: '#app',
    data: {
      loggedIn: false,
      email: undefined,
      money: '',
      selectPlantMenuMeta: '',
      plantInfoMeta: '',
      shelfLimitMenuMeta: '',
      plantMenuOpen: false,
      plantInfoMenuOpen: false,
      shelfLimitMenuOpen: false,
      statsVisible: false,
      stats: {waters: 0, planted: {}, harvested: {}},
      highscores: []
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