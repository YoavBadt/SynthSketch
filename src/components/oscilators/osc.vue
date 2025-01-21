<template >
    <div class="oscilator">
            <div class="osc_knobs">
                <Title :name="name" width="100%" style="margin-bottom : 16px" />
                <!-- <div class="viz_head" >{{ name }}</div> -->
                <div class="osc_digits_box">
                    <div class="osc_digits" style="border-right:1px solid rgba(62, 174, 243,1)">
                        <h3>12</h3>
                        <label>trans</label>
                    </div >
                    <div class="osc_digits"style="border-left:1px solid rgba(62, 174, 243,1)">
                        <h3>0</h3>
                        <label>tune</label>
                    </div >
                </div>
                <div class="osc_knobs_box">
                    
                    <Knob  :modelValue="osc.level" @update:modelValue="updateStore" show="true" name="level" min="0" max="1" step="0.01" soft="2"/>
                    <Knob  :modelValue="osc.pan" @update:modelValue="updateStore" show="true" name="pan" min="0" max="1" step="0.01" soft="2"/>
                </div>

            </div>

            <div class="osc_middle">
                
                <OscVisual :oscMode="osc.mode"/>

                <OscSelect :oscNum="oscNum" :mode="osc.mode" @update:mode="updateStore"/>
                
            </div>

            <!-- <div>
                <OscVoices />
            </div> -->
            

            
           
    </div>    
</template>
<script>
import {store} from '../../store/store.js'
import OscSelect from './oscSelect.vue'
import OscVisual from './oscVisual.vue'
import OscVoices from './oscVoices.vue'

export default {
    props:['name','oscNum'],
    components:{OscSelect,OscVisual,OscVoices},
    data(){
        return {
            osc : store.oscilators[this.name]
            
        }
    },
    computed:{
        stateOsc(){
            if(this.oscNum == 1){
                // return store.osc1 
            }else{
                // return store.osc2
            } 
        }
    },
    methods:{
        updateStore(name,value){
            store.updateOsc(this.name,name,value)
        }
    }
    
}
</script>
<style >
    .oscilator{
        width:100%;
        height: 208px;
        padding:16px 32px;
        border-bottom:1px solid rgba(0,0,0,0.2);
        display:flex;
        flex-direction:row;
        gap:32px;

        /* bump */
        box-shadow: var(--card);
        background:var(--grad)
    }
    
    
    .osc_digits_box{
        background: rgba(15,10,45,1);
        color: rgba(62, 174, 243,1);
        overflow: hidden;
        border-radius: 5px;
        width:160px;
        height: 48px;
        
        /* margin-top:16px; */
        display:flex;
        flex-direction:row;
        align-items: center;
        justify-content:center;
    }
    .osc_digits{
        width:50%;
    }
    .osc_knobs{
        /* width: 160px; */
        /* padding-left:16px; */
        /* padding-right:16px; */
        /* margin-right:16px; */
        /* border-right:1px solid rgba(0,0,0,0.2) */

    }
    .osc_knobs_box{
        display:flex;
        flex-direction:row;
        gap:32px;
    }
    .osc_buttons{
        width:64px;
        /* display:flex; */
        flex-direction:column;
        align-items:center;
        gap:16px;
        margin-right:16px;
    }
    .osc_middle{
        /* width :192px; */
        /* height:100%; */
        
    }
    
    
</style>