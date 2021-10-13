//@ts-check
// @ts-ignore
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { values } from "../configs.js";
import { load } from "./load.js";
import { debouncedSave } from "./save.js";
import { getCloudData } from "./get-cloud-data.js";
import { createMission, missionsClasses } from "./setup-missions.js";


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
      const cloudData = await getCloudData()
      if (!cloudData.plantData) return
      load(cloudData.plantData)
      if (cloudData.missionData) {
        values.completedMissions = cloudData.missionData?.completedMissions.map(d => {
          const mission = createMission(d.templateIndex, d.difficulty)
          mission.startTime = d.startTime
          mission.completedTime = d.completedTime
        }) || []

        const am = cloudData.missionData.activeMission
        if (am) {
          values.vueApp.activeMission = createMission(am.templateIndex, am.difficulty)
          values.vueApp.activeMission.startTime = am.startTime
        }
      }
      debouncedSave()
      resolve(true)
    })
  })
}