//@ts-check
// @ts-ignore
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { values, configs } from "../configs.js";
import { load } from "./load.js";
import { debouncedSave, save } from "./save.js";


export const initAuth = async () => {
  const auth = getAuth();
  return new Promise(resolve => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return resolve(false)
      values.vueApp.loggedIn = true
      values.vueApp.email = user.email
      values.vueApp.uid = user.uid
      values.user_name = user.displayName
      values.loadingUserData = true
      const db = getFirestore();
      let docRef = doc(db, 'plant_data', user.uid)
      const docSnap = await getDoc(docRef)
      values.loadingUserData = false
      if (!docSnap) return resolve(false)
      const data = docSnap.data()
      if (!data) return resolve(false)
      const plantData = JSON.parse(data.plantsData)
      if (plantData.version !== configs.version) return resolve(false)
      load(plantData)
      debouncedSave()
      resolve(true)
    })
  })
}