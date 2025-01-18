<template >
    <div class="keyboard">
        
        <!-- <div class="keyboard_controls">
            <Title name='keyboard' width="128px" style="position:absolute;z-index:4"/>
        </div> -->
       

        <div class="keyboard_box">
            
            <div class="flat_box" @mousedown="" @mouseup="">
                <div  v-for="(myKey,i) in this.keys" 
                :class="getClass(myKey.name,myKey.pressed,i)" 
                :style="getFixed2(myKey.name,i)"
                
                @mousedown="myKey.pressed  = true ;key.start = true; key.play = myKey.name+octave" 
                @mouseup="myKey.pressed    = false;key.start = false;key.play = 'up'"

                @mouseleave="myKey.pressed = false;key.play = 'up'"
                @mouseenter="myKey.pressed = key.start;key.play = myKey.name+octave"
                >
                <span>{{myKey.name}}</span>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import frequencies from './frequencies.js'
import {store} from '../../store/store.js'
// import {Synth,start,getDestination} from "tone";
import { isProxy, toRaw } from 'vue';



export default {
    data(){
        return{
            keys : [],
            octave : 2,
            key : {
                start : false,
                play : ''
            },
            synth : null
        }
    },
    watch:{
        key:{
            handler(){
                if(this.key.start && this.key.play !== 'up' ){
                    // if you dont use toRaw you have to put the synth outside 
                    

                    toRaw(this.synth).triggerAttack(this.key.play) 

                }else if(!this.key.start && this.key.play === 'up'){
                    
                    // console.log('realease')
                    toRaw(this.synth).triggerRelease()
                }
            },deep:true
        },
        adsr:{
            handler(newAdsr,oldAdsr){
            let adsr = {}
            adsr.attack = store.env1.adsr.attack.value
            adsr.decay = store.env1.adsr.decay.value
            adsr.sustain = store.env1.adsr.sustain.value
            adsr.release = store.env1.adsr.release.value        

            this.synth = new Synth({
                        envelope: adsr,
                        oscillator : {
                            type : store.osc1.type,
                        }
                    }).toDestination();
            },deep:true
        },
        osc(oldOsc,newOsc){
            let adsr = {}
            adsr.attack = store.env1.adsr.attack.value
            adsr.decay = store.env1.adsr.decay.value
            adsr.sustain = store.env1.adsr.sustain.value
            adsr.release = store.env1.adsr.release.value     

            this.synth = new Synth({
                        envelope: adsr,
                        oscillator : {
                            type : store.osc1.type,
                        }
                    }).toDestination();
        }
        
    },
    computed:{
        adsr(){
            return store.env1.adsr
        },
        osc(){
            return store.osc1.type
        },
        getSharps(){
            let arr = []

            this.keys.forEach((e)=>{
                e.name.includes("#") ? arr.push(e) : null
            })
            return arr
        },
        getFlats(){
            let arr = []

            this.keys.forEach((e)=>{
                e.name.includes("#") ? null : arr.push(e)
            })
            
            return arr
        },
    },
    methods : {
        getClass(name,pressed,i){
            let klass = ''
            let k = ''

            name.includes("#") ? k = 'sharp' : k = 'flat'
            
            if(pressed){
                klass = `key_${k} key_press_${k}` 
            }else{
                klass = `key_${k}`
            }
            
            return klass
        },
        getFixed2(name,i){
            let con = name.includes("#")
            let a = 0
            let obj = {}
            
            if(i == 3 || i == 6 ){
                a = 16
            }else if(i == 8){
                a = 32
            }else if(i == 10 || i == 13){
                a = 48
            }else if( i == 15|| i == 18){
                a = 64
            }else if(i == 20 ){
                a = 80
            }else if(i == 22){
                a = 96 
            }
            let left = (32 * i) - a
            if(con){
                obj = {
                    'position': 'absolute',
                    'left' : left + 'px'
                }
            }
            return obj
        }
    },
   created(){
        let arr = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
        
        arr.forEach((e,i)=>{
            let s    
            e.includes('#') ? s = e.split('#')[0] + 's' : s = e  
            this.keys.push(
                {
                    name : e,
                    pressed : false,
                    octave : this.octave,
                    index : i,
                    frequency : frequencies[s][this.octave]
                }
            )})
        arr.forEach((e,i)=>{
            let s    
            e.includes('#') ? s = e.split('#')[0] + 's' : s = e 
            this.keys.push(
                {
                    name : e,
                    pressed : false,
                    octave : this.octave+1,
                    index : i,
                    frequency : frequencies[s][this.octave+1]
                }
        )})    
                
        let adsr = {}
            adsr.attack = store.env1.adsr.attack.value
            adsr.decay = store.env1.adsr.decay.value
            adsr.sustain = store.env1.adsr.sustain.value
            adsr.release = store.env1.adsr.release.value           

        this.synth = new Synth({
                        envelope: adsr,
                        oscillator : {
                            type : store.osc1.type,
                        }
                    }).toDestination();
    
    }

}
</script>
<style>
</style>