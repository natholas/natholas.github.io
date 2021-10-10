import { values } from "../configs.js";
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
    },
    methods: {
      logout() {
        logout()
      },
      login() {
        login()
      },
    }
  })
}