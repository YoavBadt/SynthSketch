<template >
    <div class="osc_select">
        <template v-for="(n,i) in waveTypes">
                <input type="radio" :id="n+oscNum" :name="`waveform-${oscNum}`" :value="n" :checked="waveform === n" v-model="waveform" @change="upDateOsc(n)"/> 
                <label class="osc_wave" :for="n+oscNum"
                    :style="{
                        borderRadius : radius[i]
                    }"
                >
                    <svg  width="50%" height="50%" viewBox="0 0 32 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,0,-6)">
                            <g id="_saw">
                                <path :d="wavePaths[i]" :style="{
                                    stroke: waveform === n ?'rgb(251,159,29)' : 'rgba(15,10,45,0.75)',
                                    fill:'none',
                                    strokeWidth:'4px'
                                    }"
                                />
                            </g>
                        </g>
                    </svg>
                </label>
        </template>
    </div>
</template>
<script>
import {store} from '../../store/store.js'

export default {
    props: ['oscNum'],
    emits : [],
    data(){
        return {
            waveTypes : ['sine','square','triangle','sawtooth'],
            waveform : '',
            wavePaths : ['M2.59,16.553C2.59,16.553 7.465,6.832 14.834,14.345C24.189,23.883 29.329,13.686 29.329,13.686','M2.463,19.5L2.585,8L15.957,8L16,19.5L29.429,19.5L29.5,8','M2.59,17L16,9.5L29,17.5','M3,20.5L3,8.5L29.329,21'],
            radius : ['5px 0 0 5px','0px','0px','0 5px 5px 0'],
        }
    },
    methods:{
        upDateOsc(e){
            if(this.oscNum == 1){
                let newOsc = store.osc1
                newOsc.type = e
                store.updateOsc1(newOsc)
            }else if(this.oscNum == 2){
                let newOsc = store.osc2
                newOsc.type = e
                store.updateOsc2(newOsc)
            }
        }
    },
    created(){
        if(this.oscNum == 1){
            this.waveform = store.osc1.type
        }else if(this.oscNum == 2){
            this.waveform = store.osc2.type
        }
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
    .osc_select input[type="radio"]{
        display:none;
    }
    .osc_wave{
        /* border-right:1px solid rgba(0,0,0,0.2); */
        display: inline-block;
        cursor: pointer;
        /* background:red; */
        width:48px;
        height:32px;
        display:flex;
        align-items: center;
        justify-content:center;
        outline:1px solid rgba(0,0,0,0.15);
        box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.2);
        background:var(--back);
        outline:1px solid rgba(0,0,0,0.15);
    }
    .osc_wave_left{
        border-radius: 5px 0 0 5px;
    }
    .osc_select input[type="radio"]:checked + label {
        background-color: var(--back-selected); /* Highlighted background */
        color:var(--highlight);
        box-shadow: inset 1px 1px 1px 1px rgba(0,0,0,0.2);
    }

</style>