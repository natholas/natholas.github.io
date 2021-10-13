//@ts-check
// @ts-ignore
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { values, configs } from "../configs.js";
import { load } from "./load.js";
import { debouncedSave, save } from "./save.js";

const getCloudPlantData = async () => {
  const db = getFirestore();
  let docRef = doc(db, 'plant_data', values.vueApp.uid)
  const docSnap = await getDoc(docRef)
  values.loadingUserData = false
  if (!docSnap) return
  const data = docSnap.data()
  if (!data) return
  const plantData = JSON.parse(data.plantsData)
  if (plantData.version !== configs.version) return
  return plantData
}

const getCloudMissionData = async () => {
  const db = getFirestore();
  let docRef = doc(db, 'missions', values.vueApp.uid)
  const docSnap = await getDoc(docRef)
  values.loadingUserData = false
  if (!docSnap) return
  const data = docSnap.data()
  if (!data || !data.missionData) return
  const missionData = JSON.parse(data.missionData)
  return missionData
}

export const getCloudData = async () => {
  const data = await Promise.all([getCloudPlantData(), getCloudMissionData()])
  return {
    plantData: data[0],
    missionData: data[1],
  }
}