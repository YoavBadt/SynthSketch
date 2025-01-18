<template>
    <div class="LFO">
        
        <div class="LFO_box">

            <div class="lfoMods">
                <Button v-for="item in LFOs" :select="this.select_lfo" :active="item.active" :name="item.name"/>
            </div>

            <div >

                <div class="viz_head">
                    
                        <div :style="{
                            width:'15%',
                            height:'100%',
                            borderRight:'1px solid var(--viz-high-soft)'}"
                        >p</div>
                        <LfoGrid :style="{
                            width:'25%',
                            height:'100%',
                            borderRight:'1px solid var(--viz-high-soft)',
                            padding : '0px 5px'
                            }" 
                        />
                        <div style="width:10%">c</div>
                    
                    <LfoSelect style="width:50%"/>

                </div>

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
    .LFO{
       padding:32px;
       border-bottom:1px solid rgba(0,0,0,0.2);
       box-shadow: var(--card);
       background:var(--grad);
    }
    .LFO_box{
        display:flex;
        flex-direction:row;
    }

    .viz_head{
        width:100%;
        height:32px;
        line-height:32px;
        /* padding: 0 16px; */
        display:flex;
        flex-direction:row;
        align-items:center;
        /* gap:16px; */
        color:var(--viz-high);
        background-color: var(--viz-back);
        border-radius:5px 5px 0px 0;
        border-bottom: 1px solid var(--viz-high-soft);
    }
    
    
    .lfoMods{
        /* width:80px; */
        margin-right:calc(2 * var(--graph-size));
        display:flex;
        flex-direction: column;
        gap:var(--graph-size);
    } 

</style>