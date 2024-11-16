<template>
    <div class="LFOs">
        <div class="LFO_head">
            
            <Title name="LFO"  width="64px"/>
            <div class="LFO_paint">paint</div>
            <LfoGrid/>
            <div class="LFO_curve">c</div>
            <LfoSelect/>
            

        </div>
        <div class="LFOs_box">

            <div class="lfoMods">
                <Button v-for="item in LFOs" :select="this.select_lfo" :active="item.active" :name="item.name"/>
            </div>
            <div class="lfoControls">
                <LfoVisual />
                
            </div>
        </div>
    </div>
</template>
<script>
import LfoGrid from './lfoGrid.vue'
import LfoSelect from './lfoSelect.vue'
import LfoVisual from './lfoVisual.vue'
import ModBox from '../../components/mods/modBox.vue'
export default {
    components : {
        ModBox,LfoVisual,LfoGrid,LfoSelect
    },
    data(){
        return {
        LFOs:[
            {
                name : 'lfo 1',
                active: true
            },
            {
                name : 'lfo 2',
                active: false
            },
            {
                name : 'lfo 3',
                active: false
            }
            ]
    
        }
    },
    methods:{
        select_lfo(name){
            
            this.LFOs.forEach((e)=> {e.name === name ? e.active = true : e.active = false})
        }
  }
}
</script>
<style >
    .LFOs{
       padding-top:16px;
       padding-bottom:16px;
       padding-left:16px;
       padding-right:32px;
    }
    .LFO_head{
        width:100%;
        height:32px;
        margin-bottom:16px;
        margin-left:1px;
        display:flex;
        flex-direction:row;
        gap:16px;
    }
    .LFO_head > div{
        /* outline:1px solid rgba(0,0,0,0.2); */
        /* border-radius:3px; */
    }

    .LFO_paint{
        width:96px;
        
        outline:1px solid rgba(0,0,0,0.2);
    }
    .LFO_curve{
        width:32px;
        outline:1px solid rgba(0,0,0,0.2);
    }
    .LFOs_box{
        display:flex;
        flex-direction:row;
    }
    
    .lfoMods{
        width:80px;
        
        display:flex;
        flex-direction: column;
        gap:16px;
    } 

    .lfoControls{
        width:480px;
        /* margin-left:16px; */
        /* border-bottom:1px solid red; */
    }
</style>