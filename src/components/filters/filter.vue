<template>
    <div class="filter">
        <Title name="filter 1"/>
        <div class="filter_box">

            <FilterVisual />
            <ResoSlider storeValue="resonance"/>

        </div>
        
        <div class="filter_knobs">
            <CutSlider storeValue="cutoff" min="-52" max="76" step="0.1" />
        </div>
        {{store.filter1.cutoff}} : {{store.filter1.resonance}}
    </div>
</template>
<script>
import {store} from '../../store/store.js'
import ResoSlider from './resoSlider.vue'
import CutSlider from './CutSlider.vue'
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