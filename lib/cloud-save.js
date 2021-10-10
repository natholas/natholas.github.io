//@ts-check
// @ts-ignore
import { setDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import { values } from "../configs.js";
import { getSaveData } from "./get-save-obj.js";
import { debounce } from "./debounce.js";

export const cloudSave = async () => {
  console.log("trying to save to firebase");
  const data = getSaveData()
  if (values.vueApp.loggedIn && !values.loadingUserData) {
    console.log("saving to firestore");
    const db = getFirestore();
    await setDoc(doc(db, "plant_data", values.uid), {
      user: values.uid,
      name: values.user_name,
      plantsData: JSON.stringify(data)
    });
  }
}

export const cloudSaveDebounced = debounce(() => {
  cloudSave()
}, 1000)