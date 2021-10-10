//@ts-check
// @ts-ignore
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { values } from "../configs.js";

export const getHighScores = async () => {
  const db = getFirestore();
  const _col = collection(db, "plant_data");
  const docs = await getDocs(_col)

  const userData = docs.docs.map(d => d.data())

  return userData.forEach(data => {
    data.plantData = JSON.parse(data.plantData)
    data.plantData.totalPlanted = Object.values(values.vueApp.stats.planted).reduce((t, v) => t + (v || 0), 0)
    data.plantData.totalHarvested = Object.values(values.vueApp.stats.harvested).reduce((t, v) => t + (v || 0), 0)
  })
}