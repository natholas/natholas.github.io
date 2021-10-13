//@ts-check
// @ts-ignore
import { setDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import { values } from "../configs.js";

export const cloudSave = async (data, missionData) => {
  if (values.vueApp.loggedIn && !values.loadingUserData) {
    console.log("saving to firestore");
    const db = getFirestore();
    await Promise.all([
      setDoc(doc(db, "plant_data", values.vueApp.uid), {
        user: values.vueApp.uid,
        name: values.user_name,
        plantsData: JSON.stringify(data)
      }),
      setDoc(doc(db, "missions", values.vueApp.uid), {missionData: JSON.stringify(missionData)}),
    ]);
  }
}