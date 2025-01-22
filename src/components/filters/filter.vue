<template>
    <div class="filter">
        <!-- <Title name="filter 1"/> -->
        <div class="filter_box">
            <div class="viz_head">
                <div class="filter_mode_select">
                    <template v-for="(n,i) in filterModes">
                        <input type="radio" :id="n+name" :name="`filter-${name}`" :value="n" :checked="filter.mode === n"  @change="updateFilter('mode',n)"/> 
                        <label class="filter_mode" :for="n+name">
                            <svg  width="50%" height="40%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style=";overflow: visible;evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                                <g >
                                    <g >
                                        <path :d="filterPaths[i]" :style="{
                                            stroke: filter.mode === n ?'var(--viz-high)' : 'var(--viz-high-medium)',
                                            fill:'none',
                                            strokeWidth:'5px'
                                            }"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </label>
                    </template>
                </div>
                
            </div>
            <FilterVisual :style="{borderRadius : '0 0 5px 5px'}" :mode="filter.mode" :cutoff="filter.cutoff" :resonance="filter.resonance"/>
            
        </div>
        
        <div class="filter_knobs" >
            
            <Knob  name="mix"        @update:value="updateFilter" size="small" :value="filter.mix"       :min="filter.mixMin" :max="filter.mixMax" :step="1"/>
            <Knob  name="cutoff"    :style="{marginTop: '-16px'}" @update:value="updateFilter" size="big"   :value="filter.cutoff"    :min="filter.cutMin" :max="filter.cutMax" :step="1"/>
            <Knob  name="resonance"  @update:value="updateFilter" size="small" :value="filter.resonance" :min="filter.resMin" :max="filter.resMax" :step="1" label="rez"/>
            
            <!-- <CutSlider /> -->
            <!-- <ResoSlider/> -->
            
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
    props : ['name'],
    data(){
        return {
            filter : store.filters[this.name] ,
            filterModes : ['lowpass','bandpass','highpass','notch','allpas'],
            filterPaths : ['M 0,0 L 16,0 L 32,32','M 0,32 L 16,0 L 32,32','M 0,32 L 16,0 L 32,0','M 0,0 L 16,32 L 32,0','M 0,16 L 32,16'],
        }
    },
    computed:{
        
    },
    methods:{
        updateFilter(name,value){
            
            store.updateFilter(this.name,name,value)
        }
    }
}
</script>
<style >
    .filter{
        
        height:calc(14 * 16px);
        padding:16px 32px;
        box-shadow: var(--card);
        background:var(--grad);
    }
    .filter_box{
        /* padding-top:16px; */
    }
    
    .filter_knobs{
        /* width:100%; */
        /* margin-left:-16px; */
        /* margin-top:-16px; */
        padding: 0 var(--grid-size);
        position:relative;
        display:flex; 
        flex-direction:row;
        justify-content: space-between;
    }
    .filter_knob_wing{
        position:absolute;
        background : var(--back);
        width:48px;
        height:32px;
        border-radius: 0 20px 0 0;
    }
    .filter_mode_select{
        width:100%;
        display:flex;
    }
    .filter_mode_select input[type="radio"]{
        display:none;
    }
    .filter_mode{
        /* border-right:1px solid rgba(0,0,0,0.2); */
        display: inline-block;
        cursor: pointer;
        /* background:red; */
        flex:1;
        height:32px;
        display:flex;
        align-items: center;
        justify-content:center;
        border-right:1px solid var(--viz-high-soft)
        /* outline:1px solid rgba(0,0,0,0.15); */
        /* box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.2); */
        /* background:var(--back); */
        /* outline:1px solid rgba(0,0,0,0.15); */
    }
</style>