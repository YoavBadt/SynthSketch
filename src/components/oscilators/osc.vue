<template >
    <div class="oscilator">
            <div class="osc_knobs">
                
                <Title :name="name" width="100%" />
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
                    
                    <Knob  v-model.number="stateOsc.level" show="true" name="level" min="0" max="1" step="0.01" soft="2"/>
                    <Knob  v-model.number="stateOsc.pan" show="true" name="pan" min="0" max="1" step="0.01" soft="2"/>
                </div>

            </div>

            <div class="osc_middle">
                <OscVisual :oscType="stateOsc.type"/>
                <OscSelect :oscNum="oscNum"/>
                
            </div>

            <div>
                <Voices />
            </div>
            

            
           
    </div>    
</template>
<script>
import {store} from '../../store/store.js'
import OscSelect from './oscSelect.vue'
import OscVisual from './oscVisual.vue'
import Voices from './voices.vue'

export default {
    props:['name','oscNum'],
    components:{OscSelect,OscVisual,Voices},
    data(){
        return {
            osc : {
                type : 'sine',
                level :null,
                pan : null,
                trans : null,
                tune : null
            }
            
        }
    },
    computed:{
        stateOsc(){
            if(this.oscNum == 1){
                return store.osc1 
            }else{
                return store.osc2
            } 
        }
    },
    watch: {
        stateOsc(oldStateOsc,newStateOsc){
        // this.osc = {...newStateOsc}
       },
       osc : {
        handler(oldLocalOsc,newLocalOsc){
            // store.updateOsc1({...newLocalOsc})
        },
        deep:true
       } 
    },
    created(){
        // this.osc = {...store.osc1}
        
    }
}
</script>
<style >
    .oscilator{
        width:100%;
        height: 208px;
        padding-top:16px;
        padding-left:16px;
        padding-right:16px;
        border-bottom:1px solid rgba(0,0,0,0.2);
        display:flex;
        flex-direction:row;
        gap:16px;

        /* bump */
        box-shadow: inset 1px 1px 0px 0px rgba(255,255,255,0.1),inset -1px -1px 0px 0px rgba(0,0,0,0.1);
    }
    
    
    .osc_digits_box{
        background: rgba(15,10,45,1);
        color: rgba(62, 174, 243,1);
        overflow: hidden;
        border-radius: 5px;
        width:160px;
        height: 48px;
        
        margin-top:16px;
        display:flex;
        flex-direction:row;
        align-items: center;
        justify-content:center;
    }
    .osc_digits{
        width:50%;
    }
    .osc_knobs{
        width: 160px;
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
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:16px;
        margin-right:16px;
    }
    .osc_middle{
        width :192px;;
        height:100%;
    }
    
    
</style>