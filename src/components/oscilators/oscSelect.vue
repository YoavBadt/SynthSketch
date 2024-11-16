<template >
    <div class="osc_select">
        
        <button @click="getSel('sine')     ; upDateOsc('sine')"     :class="[ sine ? 'button_selected' : '', 'osc_wave']"     :style="{borderRadius : '5px 0 0 5px'}">
            <img v-show="sine" src="../../assets/sine.svg" class="sel_img">
            <img v-show="!sine"  src="../../assets/_sine.svg" class="sel_img_">
        </button>
        <button @click="getSel('triangle') ; upDateOsc('triangle')" :class="[ triangle ? 'button_selected' : '', 'osc_wave']" :style="{borderRadius : '0'}">
            <img v-show="triangle" src="../../assets/tri.svg" class="sel_img">
            <img v-show="!triangle" src="../../assets/_tri.svg" class="sel_img_">
        </button>
        <button @click="getSel('sawtooth') ; upDateOsc('sawtooth')" :class="[ sawtooth ? 'button_selected' : '', 'osc_wave']" :style="{borderRadius : '0'}">
            <img v-show="sawtooth" src="../../assets/saw.svg" class="sel_img">
            <img v-show="!sawtooth" src="../../assets/_saw.svg" class="sel_img_">
        </button>
        <button @click="getSel('square')   ; upDateOsc('square')"   :class="[ square ? 'button_selected' : '', 'osc_wave']"   :style="{borderRadius : '0 5px 5px 0'}">
            <img v-show="square" src="../../assets/square.svg" class="sel_img">
            <img v-show="!square" src="../../assets/_square.svg" class="sel_img_">
        </button>
     
    </div>
</template>
<script>
import {store} from '../../store/store.js'

export default {
    props: ['oscNum'],
    emits : [],
    data(){
        return {
            sine : false,
            triangle : false,
            sawtooth : false,
            square : false
        }
    },
    methods:{
        getSel(e){
            this.sine = false,
            this.triangle = false,
            this.sawtooth = false,
            this.square = false
            this[e] = true     
        },
        upDateOsc(e){
            if(this.oscNum == 1){
                // console.log(store.osc1)
                let newOsc = store.osc1
                newOsc.type = e
                store.updateOsc1(newOsc)
            }
        }
    },
    created(){
        this.getSel(store.osc1.type)
    }
    
       
    
}
</script>
<style >
    .osc_select{
        /* border-left:1px solid rgba(0,0,0,0.2);
        border-top:1px solid rgba(0,0,0,0.2);
        border-bottom:1px solid rgba(0,0,0,0.2); */
        margin-top:16px;
        display:flex;
        flex-direction:row;
        border-radius:3px;
        height:32px;
        
    }
    .osc_wave{
        /* border-right:1px solid rgba(0,0,0,0.2); */
        width:48px;
        display:flex;
        align-items: center;
        justify-content:center;
    }
    .sel_img{
        width:50%;
    }
    .sel_img_{
        width:50%;
        opacity:90%;
    }
</style>