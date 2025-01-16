<template>
    <div class="knob_box" v-if="show"
        @mousemove="drag ? startDrag($event) : null"
        @mouseup="drag = false"
        @mousedown.prevent="drag=true"
        @mouseleave="drag=false"
    >
        <div class="knob">
            <svg id="svg" class="KnobSvg" :width="width" :height="width"  >
                <circle id="back":r="r" :cx="c" :cy="c" fill="transparent" 
                :stroke-width='r/3'
                style="stroke: var(--back)"
                :transform="`rotate(118 ${c} ${c})`"
                :stroke-dasharray="r*val"
                stroke-dashoffset="20" 
                />
                
                <circle 
                
                id="bar" :r="r" :cx="c" :cy="c" fill="transparent" 
                :stroke-width='r/3'
                style="stroke: var(--highlight)"
                :transform="`rotate(118 ${c} ${c})`"
                :stroke-dasharray="r*val" 
                :stroke-dashoffset="getP"
                />
                
                <g :transform="`rotate(${getDeg} ${c} ${c})`"
                :style="{'pointerEvents': 'none'}"
                >
                    <!-- <circle id ="dial" stroke="black" :r="r-r/6" fill="#0f0a2d" :cx="c" :cy="c"/> -->
                    <line :x1="c" :y1="c" :x2="c" :y2="c+r+4" style="stroke:rgba(0,0,0,0.8); stroke-width:10" stroke-linecap="round"/>
                    <line :x1="c" :y1="c" :x2="c" :y2="c+r+4" style="stroke:var(--back); stroke-width:4" stroke-linecap="round"/>
                </g>
            </svg>
            <div class="knobShadow" :style="`width:${r*2+8*1.5}px;height:${r*2+8*1.5}px`"> </div>
            <div class="knobBG"
            
            ></div>
        </div>
        <div v-if="!drag" :class="[drag ? 'knob_label_hightlight' : '', 'knob_label']">{{ name }}</div>
        <div v-if="drag" :class="[drag ? 'knob_label_hightlight' : '', 'knob_label']">{{ modelValue }} </div>
    </div>
</template>
<script>
export default {
    props: ['modelValue','name','min','max','step','show','soft'],
    emits: ['update:modelValue'],
    data(){
        return{
            width : 64,
            c : 32,
            r : 20,
            p : null,
            stroke : 8,
            val : 6.283111111111111,
            drag :false
        }
    },
    methods:{
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        startDrag(event){
            
            let num = event.movementY * this.soft * this.step 
            let newVal2 = this.modelValue - num

            newVal2 = newVal2 * 100 
            newVal2 = Math.trunc(newVal2) 
            newVal2 = newVal2 / 100
           
            if(newVal2 >= this.max){
                return
            }else if(newVal2 < 0.01 && newVal2 < this.modelValue){
                this.name === 'Sustain' ? newVal2 = 0 : newVal2 = 0.01
                this.$emit('update:modelValue',newVal2)
            }else{
                this.$emit('update:modelValue',newVal2)

            }
            
        }
    },
    computed:{
        getP(){
            let c = Math.PI*(this.r*2);
            let newP = this.mapper(this.modelValue*100,this.min*100,this.max*100,0,90)
            let pct = ((100-newP)/100)*c;
            return pct
        },
        getDeg(){
            let deg = this.mapper(this.modelValue*100,this.min*100,this.max*100,20,340)
            return deg
        }
    },
    updated(){
        
    },
    created(){
        
       
    }
}
</script>
<style >
    /* https://codepen.io/JMChristensen/pen/AGbeEy the dashoffset thing*/

    /* nice blue #2f97f9; */
    .knob_box{
        width:64px;
        height:110px;
        /* outline: 1px solid rgba(0,0,0,0.5); */
        text-align: center;
        /* box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.2); */
    }
    .knob{
        height: 96px;
        /* border-bottom: 1px solid rgba(0,0,0,0.5); */
        display:flex;
        align-items: center;
        justify-content: center;
        position:relative;
        z-index: 0;
    }
    .knobShadow{
        position:absolute;
        z-index:-1;
        border-radius:50%;
        background: rgba(0,0,0,0.8)
        /* background:rgba(15,10,45,1); */
        /* width:64px; */
        /* height:64px; */
        /* #424242; */
        /* outline: 2px solid rgba(0,0,0,0.5); */
        /* box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.3); */
    }
    .knobBG{
        position:absolute;
        z-index:-2;
        border-radius:50%;
        width:68px;
        height:68px;
        background:var(--back);
        box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.1);
        outline: 1px solid rgba(0,0,0,0.15);
    }
    .knob_label{
        height:16px;
        width:100%;
        margin-top:-16px ;
        /* margin-right:16px; */
        /* margin-left: 16px; */
        margin-bottom: 0px;
        border-radius:1px;
        outline: 1px solid rgba(0,0,0,0.15);
        box-shadow: inset 2px 2px 0px 0px rgba(255, 255, 255, 0);
        background:var(--back);
        color: #0f0a2d
        
    }
    .knob_label_hightlight{
        /* background:#0f0a2d;
        color: #FF9F1E; */
        
    }
    
</style>