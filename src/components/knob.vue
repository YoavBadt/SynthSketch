<template >
    <div class="BigKnob_box" @mousedown.prevent="drag=true" @mouseup="drag = false" :style="{
        width: `calc(${size === 'big' ? 4 : 3} * var(--grid-size))`,
        height: `calc(${size === 'big' ? 5 : 4} * var(--grid-size))`
    }">
        
        <svg class="BigKnob_svg" width="100%" height="100%" :style="{ 
            transform :'rotate(90deg)',
            height: `calc(${size === 'big' ? 4 : 3} * var(--grid-size))`
            }">
            
            <circle class="knob-track" :cx="width/2 + 'px'" :cy="height/2 + 'px'" :r="radius +'px'" :style="{fill: 'var(--black)' }"/>
            
            <path :d="getPath(100)" fill="none" stroke="var(--back)" :stroke-width="`${size === 'big' ? 6 : 4}`" stroke-linecap="round" />

            <path :d="getArc" fill="none" stroke="var(--highlight)" :stroke-width="`${size === 'big' ? 6 : 4}`" stroke-linecap="round" />

            <g :transform="`rotate(${getDeg} ${width/2} ${height/2})`" >
                <line :x1="width/2" :y1="height/2" :x2="radius*2" :y2="height/2" style="stroke:var(--black); stroke-width:10" stroke-linecap="round"/>
                <line :x1="width/2" :y1="height/2" :x2="radius*2" :y2="height/2" style="stroke:var(--back);  stroke-width:4"  stroke-linecap="round"/>
            </g>
        </svg>
    <div class="BigKnob_back"></div> 

    <div  :class="[drag ? 'knob_label_hightlight' : '', 'bigknob_label']">
        
        <template v-if="!drag">
            {{ label ? label :name }}
        </template>
        <template v-if="drag">{{ value }}</template>
        
        
    </div>
           

    </div>
</template>
<script>
import {store} from '../store/store.js'
export default {
    props : ['value','name','min','max','step','size','label'],
    emits: ['update:value'],
    data(){
        return {
            width : (this.size === 'big' ? 4 : 3) * store.gridSize ,
            height : (this.size === 'big' ? 4 : 3) * store.gridSize,
            radius :  ((this.size === 'big' ? 4 : 3) * store.gridSize) / 2 - 5,
            drag :false
            
        }
    },
    watch:{
        drag(){
            this.drag ? window.addEventListener("mousemove",this.startDrag) : window.removeEventListener("mousemove",this.startDrag)
            
        }
    },
    computed:{
        getArc(){
            const percentage = this.mapper(this.value,this.min,this.max,0,100); 
            
            return this.getPath(percentage)
        },
        getGlobalMouse(){
            return store.globalMouseDown
        },
        getDeg(){
            let deg = this.mapper(this.value,this.min,this.max,25,340)
            return deg
        }
    },
    methods:{
        getPath(percentage){
            const radius = this.radius - (this.size === 'big' ? 8 : 6)
            const centerX = this.width/2; // Circle center x
            const centerY = this.height/2; // Circle center y

            const circumference = 2 * Math.PI * radius

            const startAngleDeg = 30; 
            const endAngleDeg = startAngleDeg + (percentage / 100) * 300 ; 

            // Convert the angle to radians
            const startAngleRad = (startAngleDeg * Math.PI) / 180; // Start point in radians
            const endAngleRad = (endAngleDeg * Math.PI) / 180; // Current end point in radians

            // Calculate start and end points
            const startX = centerX + radius * Math.cos(startAngleRad);
            const startY = centerY + radius * Math.sin(startAngleRad);
            const endX = centerX + radius * Math.cos(endAngleRad);
            const endY = centerY + radius * Math.sin(endAngleRad);

            // Determine if the arc should be large (> 180 degrees)
            const largeArcFlag = (endAngleDeg - startAngleDeg) > 180 ? 1 : 0;

            const path = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
            
            return path 
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        startDrag(event){
            const percentage = this.mapper(this.value,this.min,this.max,0,100);

            let num = event.movementY //* this.step 

            let newVal = percentage - num

            if(newVal < 0){
                newVal = 0
            }else if(newVal > 100){
                newVal = 100
            }
            this.getGlobalMouse ? this.$emit('update:value',this.name,newVal) : this.drag = false
        }
    }
    
}
</script>
<style >
    .BigKnob_box {
        
        
        position: relative;
        z-index:1;
        
    }
    .BigKnob_svg{
        /* display:none; */
        position: absolute;
        
        left:0;
        top:0;
        z-index:3
    }
    .BigKnob_back{
        position: absolute;
        z-index:2;
        top:-3%;
        left:-3%;
        width:106%;
        height:calc(106% - var(--grid-size));
        border-radius:50%;
        background: var(--back);
        box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.1);
        outline: 1px solid rgba(0,0,0,0.15);

    }
    .bigknob_label{
        position:absolute;
        bottom:0;
        height:16px;
        width:100%;
        z-index:1;
        outline: 1px solid rgba(0,0,0,0.15);
        box-shadow: inset 2px 2px 0px 0px rgba(255, 255, 255, 0.1);
        background:var(--back);
        color: #0f0a2d
    }
    
</style>