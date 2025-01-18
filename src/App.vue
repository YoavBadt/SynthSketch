<template>
    <div>
        
        <Synth/> 
    </div>
</template>

<script>
import Synth from './components/synth/synth.vue'




export default {
    data(){
        return{
            freq:440,
            gate : null,
            setGate: null
        }
    },
   components : {
    Synth
   },
   mounted(){
        
   },
   methods:{
    

   }
   
}
</script>
<style >
    
</style>