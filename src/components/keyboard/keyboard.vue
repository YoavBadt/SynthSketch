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
import {Synth,start,getDestination} from "tone";
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
                    frequency : frequencies[s][this.octave]
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
<style >
    .keyboard{
        height:100%;
        height:144px;
        overflow:hidden;
        position:relative;
        display:flex;
        flex-direction: row;
        
    }
    .keyboard_controls{
        height:100%;
        width:128px;
        border-right:1px solid rgba(0,0,0,0.2);
    }
    .keyboard_box{
        width:672px;
        height:100%;
        background:#717171;
        position:relative;
    }
    .flat_box{
        width:100%;
        height:100%;
        position:relative;
        display:flex;
        flex-direction: row;
        align-content: stretch;
        
    }
   
    .sharp_box{
        position:absolute;
        z-index:2;
        width:100%;
        display:flex;
        flex-direction: row;
        padding-left:32px;
        
        
    }
    .key_sharp{
        width:32px;
        height:80px;
        color:rgba(255,255,255,0.25);
        display:flex;
        flex-direction: column-reverse;
        padding-bottom:15px;
        border-radius:0 0 5px 5px;
        outline:1px solid rgba(0,0,0,0.2);
        background:#201e1e; 
        box-shadow: inset 0px -8px 0px 0px rgb(158, 158, 158,0.25),inset 0px -3px 4px 0px rgba(0, 0, 0, 0.8);
    }
    .key_press_sharp{
        box-shadow: 0px 4px 0px 1px rgba(0,0,0,0.1);
        background:linear-gradient(to bottom, rgb(22, 22, 22) 0px, #201e1e 25%);
        padding-bottom:10px;
    }

    .key_flat{
        height: 128px;
        width: 48px;
        color:rgba(0,0,0,0.5);
        display:flex;
        flex-direction: column-reverse;
        padding-bottom:15px;
        border-radius:0 0 5px 5px;
        outline:1px solid rgba(0,0,0,0.2);
        background:#9e9e9e;
        box-shadow: inset 0px -4px 0px 1px rgba(0,0,0,0.15);
    }
    .key_press_flat{
        box-shadow: 0px 4px 0px 1px rgba(0,0,0,0.1);
        background:linear-gradient(to bottom, #888888 0px,#9e9e9e 25%);
        padding-bottom:10px;
    }
    
    
</style>