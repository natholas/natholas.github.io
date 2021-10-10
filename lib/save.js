//@ts-check
// @ts-ignore
import { setDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";

import { values, configs } from '../configs.js'

let saveCount = 0
let lastSavedData

export const save = async () => {
  if (values.killed) return
  saveCount += 1
  let data = {
    version: configs.version,
    lastUpdateTime: values.lastUpdateTime,
    lastWateredTime: values.lastWateredTime,
    addPlantSelectedPlantIndex: values.addPlantSelectedPlantIndex,
    addPlantSelectedPotIndex: values.addPlantSelectedPotIndex,
    maxShelfCount: values.maxShelfCount,
    stats: values.stats,
    points: values.points,
    shelves: values.shelves.map(shelf => {
      return shelf.pots.map(pot => {
        return {
          key: pot.plant.key,
          growthAmount: pot.plant.growthAmount,
          stage: pot.plant.stage,
          potIndex: pot.potIndex
        }
      })
    }).filter(a => a.length)
  }

  const dataString = JSON.stringify(data)
  localStorage.setItem('data', dataString)

  if (dataString !== lastSavedData) {
    lastSavedData = dataString
    if (values.vueApp.loggedIn && !values.loadingUserData) {
      console.log("saving to firestore");
      const db = getFirestore();
      await setDoc(doc(db, "plant_data", values.uid), {
        user: values.uid,
        plantsData: JSON.stringify(data)
      });
    }
  }
}