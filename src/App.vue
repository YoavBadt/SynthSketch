<template>
    <div>
        <!-- <div class="debug">
            
            <div v-for="n in store.env1.adsr">{{ n }}</div>
            refs : {{ store.synth.voices.state[0].setGateRef }}
            <div v-for="n in store.synth.voices.state">{{ n.setGateRef }}</div>
        </div> -->
        <Synth/> 
    </div>
</template>

<script>
import Synth from './components/synth/synth.vue'
import { store } from './store/store.js'

export default {
    data(){
        return{
            store
        }
    },
    computed:{
        
    },
   components : {
    Synth
   },
   mounted(){
        window.addEventListener("mousedown",this.localMouse);
        window.addEventListener("mouseup",this.localMouse);
        
   },
   beforeUnmount() {
        window.removeEventListener("mousedown",this.localMouse);
        window.removeEventListener("mouseup",this.localMouse);
        
    },
   methods:{
    localMouse(event){
        store.updateGlobalMouseDown(event)
        if(event.type === 'mousedown'){
            store.init.core ? null : store.init()//initializeEngine()
        }
    }
   }
   
}
</script>
<style >
    .debug{
        position: absolute;
        background:white;
        padding:20px;
        width: 50%;
    }
</style>