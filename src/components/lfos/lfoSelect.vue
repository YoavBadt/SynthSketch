<template >
    <div class="LFO_select">
        
        <div class="LFO_select_btn"  @click=upDate(-1)>
            <svg width="16px" height="100%" >
                <path d="M12,8 4,16 12,24" style="fill:none" stroke="#3eaef3" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="LFO_select_txt">
            {{getLfo.name}} 
        </div>
        <div class="LFO_select_btn" @click=upDate(1)>
            <svg width="16px" height="100%">
                <path d="M4,8 12,16 4,24" style="fill:none" stroke="#3eaef3" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round"/>
                
            </svg>
        </div>
    </div>

</template>
<script>
import {store} from '../../store/store.js'
export default {
    data(){
        return {
           
        }
    },
    methods:{
        upDate(v){
            let LFO = this.getLfo
            let list = store.lfo1.LFOtypes
            let index = store.lfo1.LFOtypes.indexOf(LFO)
            let next = index + v
            
            next < 0 ? next = list.length-1 : null
            next > list.length-1 ? next = 0 : null

            list.forEach((e)=>{e.selected = false})
            list[next].selected = true

            let lfo1 = store.lfo1
            lfo1.LFOtypes = list
            store.updateLFO1(lfo1)

            // let newLFO = store.lfo1
            // let next = store.lfo1.types.indexOf(store.lfo1.type) + v
            // newLFO.type = store.lfo1.types[next]
            // store.updateLFO1(newLFO)
        }
    },
    computed:{
        getLfo(){
            
            return store.lfo1.LFOtypes.find((e)=>e.selected)
            // return store.lfo1.type
        }
    }
}
</script>

<style >
    .LFO_select{

    width:208px;
    background: rgba(15,10,45,1);
    color:#3eaef3;
    border-radius:3px;
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items:space-between;
    }
    .LFO_select_btn{
        height:32px;
        width:32px;
        padding-left:8px;
        padding-right:8px;
    }
    .LFO_select_txt{
        line-height:32px;
        width:144px;
    }
</style>