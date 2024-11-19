<template>
    <div>
        <button :style="{'width' : '200px' }" @click="init">elemantary init</button>
        <button :style="{'width' : '200px' }" @click="play">elemantary play</button>
        <Synth/> 
    </div>
</template>

<script>
import Synth from './components/synth/synth.vue'
import {el} from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'
const ctx = new AudioContext();
const core = new WebRenderer();


export default {
   components : {
    Synth
   },
   methods:{
    async init(){
        let node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [1],
        })
        // console.log(node)
        node.connect(ctx.destination);
        

        // console.log(stats);
        // })();
    },
    play(){
        let [cutoff, setCutoffFreq] = core.createRef("const", {value: 200}, []);

        core.render(el.lowpass(cutoff, 1.0, el.in({channel:0}) ))

        // let newCutoff = 500
        // setCutoffFreq({value: newCutoff});

        core.render( el.mul( 0.5 , el.cycle(440) ) )  
    }
   }
   
}
</script>
<style >
    
</style>