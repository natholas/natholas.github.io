import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

export const logout = async() => {
  const auth = getAuth();
  await signOut(auth)
  window['reset']()
}