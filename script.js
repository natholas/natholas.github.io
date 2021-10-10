//@ts-check

import { plants } from './plants.js'
import { configs, values } from './configs.js'
import { load } from './lib/load.js'

// Import the functions you need from the SDKs you need
// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
// @ts-ignore
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
// @ts-ignore
import { setupVueApp } from './lib/setup-vue.js';
import { initAuth } from './lib/init-auth.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCglT27J6zNj1VA0JubXgfEZQEGeT6EuIc",
  authDomain: "plants-9ff40.firebaseapp.com",
  projectId: "plants-9ff40",
  storageBucket: "plants-9ff40.appspot.com",
  messagingSenderId: "914156310539",
  appId: "1:914156310539:web:df895535aadcbfc048f70e",
  measurementId: "G-KL7TJSM52M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

setupVueApp()

values.app = new PIXI['Application']({ width: 128, height: configs.topHeight + configs.bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI['SCALE_MODES'].NEAREST;
document.getElementById('canvas-container').appendChild(values.app.view);

values.app.renderer.view.style.touchAction = 'auto';
values.app.renderer.plugins.interaction.autoPreventDefault = false;

const loader = PIXI['Loader'].shared;

values.sounds.money = PIXI['sound'].Sound.from({url: '/assets/sounds/money.mp3', autoPlay: false}),
values.sounds.plant = PIXI['sound'].Sound.from({url: '/assets/sounds/plant.mp3', autoPlay: false}),
values.sounds.button = PIXI['sound'].Sound.from({url: '/assets/sounds/button.mp3', autoPlay: false}),
values.sounds.buttonDisabled = PIXI['sound'].Sound.from({url: '/assets/sounds/button-disabled.mp3', autoPlay: false}),
values.sounds.water = PIXI['sound'].Sound.from({url: '/assets/sounds/water.mp3', autoPlay: false}),
values.sounds.turn = PIXI['sound'].Sound.from({url: '/assets/sounds/turn.mp3', autoPlay: false}),

// load main textures
loader.add('shelf-1', 'assets/shelf-1.png')
loader.add('shelf-2', 'assets/shelf-2.png')
loader.add('bg-top', 'assets/bg-top.png')
loader.add('bg-bottom', 'assets/bg-bottom.png')
loader.add('text-frame', 'assets/text-frame.png')
loader.add('water-level', 'assets/water-level.png')
loader.add('plant-select-menu-bg', 'assets/plant-select-menu-bg.png')
loader.add('shelf-limit-bg', 'assets/shelf-limit-bg.png')
loader.add('arrow-left', 'assets/buttons/arrow-left.png')
loader.add('arrow-right', 'assets/buttons/arrow-right.png')
loader.add('button_add-plant', 'assets/buttons/add-plant.png')
loader.add('button_water', 'assets/buttons/water.png')
loader.add('button_confirm', 'assets/buttons/confirm.png')
loader.add('button_sell', 'assets/buttons/sell.png')
loader.add('button_close', 'assets/buttons/close.png')
for (let i = 1; i <= configs.numberOfPots; i++) loader.add('pot-' + i, 'assets/pot-' + i + '.png')

plants.forEach(plant => {
  for (let i = 0; i <= plant.numberOfStages; i++) loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
})

window['reset'] = () => {
  if (!confirm('Are you sure?')) return
  localStorage.removeItem('data')
  values.killed = true
  window.location.reload()
}

loader.load(async () => {
  const loading = document.getElementById('loading')
  loading.parentElement.removeChild(loading)
  let data
  try {
    data = JSON.parse(localStorage.getItem('data'))
    if (data.version !== configs.version) data = undefined
  } catch(e) {}
  load(data)
  await initAuth()
})
