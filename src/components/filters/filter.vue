<template>
    <div class="filter">
        <Title name="filter 1"/>
        <div class="filter_box">

            <FilterVisual />
            <ResoSlider/>

        </div>
        
        <div class="filter_knobs">
            <CutSlider />
        </div>
        
    </div>
</template>
<script>
import {store} from '../../store/store.js'
import ResoSlider from './resoSlider.vue'
import CutSlider from './cutSlider.vue'
import FilterVisual from './filterVisual.vue'
export default {
    components:{ResoSlider,FilterVisual,CutSlider},
    data(){
        return{
            store
        }
    },
    computed:{
        
    }
}
</script>
<style >
    .filter{
        width:50%;
        height:calc(14 * 16px);
        padding:16px 32px;
        box-shadow: var(--card);
        background:var(--grad);
    }
    .filter_box{
        display: flex;
        flex-direction:row;
        padding-top:16px;
    }
    
    .filter_knobs{
        /* display:flex; */
        /* flex-direction:row; */

    }
</style>