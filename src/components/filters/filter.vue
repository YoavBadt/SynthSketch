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
        width:290px;
        height:224px;
        padding:16px 16px 16px 16px;
        /* bump */
        box-shadow: inset 1px 1px 0px 0px rgba(255,255,255,0.1),inset -1px -1px 0px 0px rgba(0,0,0,0.1);
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