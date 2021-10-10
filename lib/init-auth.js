//@ts-check
// @ts-ignore
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { values, configs } from "../configs.js";
import { load } from "./load.js";


export const initAuth = async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) return
    values.vueApp.loggedIn = true
    values.vueApp.email = user.email
    values.uid = user.uid
    values.loadingUserData = true

    const db = getFirestore();
    let docRef = doc(db, 'plant_data', user.uid)
    const docSnap = await getDoc(docRef)
    values.loadingUserData = false
    if (!docSnap) return
    const data = docSnap.data()
    const plantData = JSON.parse(data.plantsData)
    console.log(plantData);
    if (plantData.version === configs.version) load(plantData)
  })
}