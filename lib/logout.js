import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { values } from "../configs.js";

export const logout = async() => {
  const auth = getAuth();
  await signOut(auth)
  values.vueApp.loggedIn = false
}