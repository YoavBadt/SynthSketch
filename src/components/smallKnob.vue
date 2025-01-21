<template >
    <div class="SmallKnob_box"
    @mousedown.prevent="drag=true"
    @mouseup="drag = false"
    
    
    >
    
        <!-- <input type="range" min="0" max="100" value="50" class="SmallKnob" @input="$emit"/> -->
        
        <svg class="SmallKnob_svg" viewBox="0 0 100 100" :width="width+ 'px'" :height="height+ 'px' " 
        :style="{
            transform :'rotate(90deg)'
        }"    
        >
            <!-- Track -->
            <circle class="knob-track" :cx="width+ 'px'" :cy="height+ 'px'" :r="radius+'px'" :style="{
               fill: 'var(--black)' 
            }"/>
            <path id="arc" fill="none" stroke="var(--back)" stroke-width="10" stroke-linecap="round" 
            d="M 71.38268590217984 61.5 A 27 27 0 1 1 71.38268590217984 34.499999999999986"
            
            />
            <path id="arc" fill="none" stroke="var(--highlight)" stroke-width="10" stroke-linecap="round" 
            :d="getArc"
            
            />
            <!-- Progress -->
            <!-- <circle class="knob-progress" cx="50" cy="50" r="45" /> -->

            <!-- Indicator Circle -->
            <!-- <circle class="knob-indicator" cx="50" cy="5" /> -->
        </svg>
           
    </div>
</template>
<script>
import {store} from '../store/store.js'
export default {
    props : ['value','name','min','max','step'],
    emits: ['update:value'],
    data(){
        return {
            width : 3 * store.gridSize ,
            height : 3 * store.gridSize,
            radius :  (3 * store.gridSize)-5,
            drag :false,
            
            
        }
    },
    watch:{
        drag(){
            this.drag ? window.addEventListener("mousemove",this.startDrag) : window.removeEventListener("mousemove",this.startDrag)
            
        }
    },
    computed:{
        getArc(){
            //the entire SVG needs to be rotated 90 deg for this to work!!!

            const radius = this.radius-16
            const centerX = this.width; // Circle center x
            const centerY = this.height; // Circle center y
            
            const percentage = this.mapper(this.value,this.min,this.max,0,100); 
            
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
        getGlobalMouse(){
            return store.globalMouseDown
        }
    },
    methods:{
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        startDrag(event){
            
            let num = event.movementY * this.step 
            let newVal = this.value - num
            if(newVal < 0){
                newVal = 0
            }else if(newVal > 100){
                newVal = 100
            }
            this.getGlobalMouse ? this.$emit('update:value',newVal,this.name) : this.drag = false
        }
    }
    
}
</script>
<style >
    .SmallKnob_box {
        position: relative;
        width: calc(3 * var(--grid-size));
        height: calc(3 * var(--grid-size));
        /* background:red; */
    }
    .SmallKnob {
        position: absolute;
        left:0;
        top:0;
        width: 100%;
        height: 100%;
        -webkit-appearance: none;
        appearance: none;
        opacity: 0; 
        z-index: 2; /* Keeps it interactive */
    }
    .SmallKnob:focus{
        outline:none;
    }
    
</style>