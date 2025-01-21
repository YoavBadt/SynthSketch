import './assets/main.css'
import './assets/graph.css'
import Button from './components/button.vue'
import Knob from './components/knob.vue'
import SmallKnob from './components/smallKnob.vue'
import Title from './components/title.vue'
import OnOff from './components/onOff.vue'

import { createApp } from 'vue'
import App from './App.vue'

export const app = createApp(App)
app.component('Button',Button)
app.component('Knob',Knob)
app.component('SmallKnob',SmallKnob)
app.component('Title',Title)
app.component('OnOff',OnOff)
app.mount('#app')

// createApp(App).mount('#app')
