//@ts-check
// @ts-ignore
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
// @ts-ignore
import { getAmountText } from "./get-amount-text.js";

export const getHighScores = async () => {
  const db = getFirestore();
  const _col = collection(db, "plant_data");
  const docs = await getDocs(_col)

  const userData = docs.docs.map(d => d.data())

  userData.forEach(data => {
    data.plantsData = JSON.parse(data.plantsData)
    data.totalPlanted = Object.values(data.plantsData.stats.planted).reduce((t, v) => t + (v || 0), 0)
    data.totalHarvested = Object.values(data.plantsData.stats.harvested).reduce((t, v) => t + (v || 0), 0)
    data.totalWaters = getAmountText(data.plantsData.stats.waters)
    data.totalPoints = getAmountText(data.plantsData.points)
    data.xp = data.plantsData.xp ? getAmountText(data.plantsData.xp) : '0'
  })

  userData.sort((a, b) => a.plantsData.points < b.plantsData.points ? 1 : -1)

  return userData
}