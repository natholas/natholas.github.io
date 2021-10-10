//@ts-check
// @ts-ignore
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { values } from "../configs.js";
import { getAmountText } from "./get-amount-text.js";

export const getHighScores = async () => {
  const db = getFirestore();
  const _col = collection(db, "plant_data");
  const docs = await getDocs(_col)

  const userData = docs.docs.map(d => d.data())

  userData.forEach(data => {
    data.plantsData = JSON.parse(data.plantsData)
    data.plantsData.totalPlanted = Object.values(values.vueApp.stats.planted).reduce((t, v) => t + (v || 0), 0)
    data.plantsData.totalHarvested = Object.values(values.vueApp.stats.harvested).reduce((t, v) => t + (v || 0), 0)
    data.totalPoints = getAmountText(data.plantsData.points)
  })

  userData.sort((a, b) => a.plantsData.points < b.plantsData.points ? 1 : -1)

  return userData
}