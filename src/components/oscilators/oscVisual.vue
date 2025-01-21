<template>
    <div class="osc_window">
        <svg class="osc_svg" :width="width" :height="height">
            <rect width="100%" height="100%" stroke="rgba(62, 174, 243,0.5)" fill="rgba(15,10,45,1)" stroke-width="2"/>
            <line x1="0" x2="100%" y1="50%" y2="50%" stroke="rgba(62, 174, 243,0.2)" stroke-width="2"/>

            <g stroke-linecap="round" stroke-linejoin="round" fill="rgba(62, 174, 243,0.25)" stroke="rgba(62, 174, 243,1)" stroke-width="2">

                <path v-if="oscMode === 'sawtooth'" :d="`M${0},${height/2}L${0},${height/4}L${width},${height*0.75}L${width},${height/2}`" />
                <path v-if="oscMode === 'sine'" :d="getSine"/>
                <path v-if="oscMode === 'triangle'" :d="`M${0},${height/2}L${width/4},${height/4}L${width*0.75},${height*0.75}L${width},${height/2}`" />
                <path v-if="oscMode === 'square'" :d="`M${0},${height/2}L${0},${height/4}L${width/2},${height/4}L${width/2},${height*0.75}L${width},${height*0.75}L${width},${height/2}`" />
            </g>

        </svg>
     </div>
</template>
<script>
export default {
    props:['oscMode'],
    data(){
        return{
            width:176,
            height:112-0
        }
    },
    computed:{
        getSine(){
            let myDots = []
            let x
            let y
            let amplitude = this.height/4
            let frequency = 1
            let move = 0

            for(let i=0;i<this.width;i+=5){
                y = this.height/2 - amplitude * Math.sin( (i + move) * 2 * Math.PI * (frequency/this.width)) 
                // y = this.height/2 + this.amplitude * Math.sin( (i+this.move)/20 ) 
                myDots.push({
                x: i,
                y: y
                })
            }
                
            let linepath = `M 0 ${this.height/2}`

            myDots.forEach((e)=>{
            linepath += `L ${e.x} ${e.y}`
            })
            // linepath += `L ${this.width} ${myDots[myDots.length-1].y} L ${this.width} ${this.height} L 0 ${this.height} L 0 ${this.height/2}`
                
            return linepath
            
        }
    }
}
</script>
<style>
  .osc_window{
        width :192px;
        height: calc(128px - 0);
        padding:8px;
        background: rgba(15,10,45,1);
        color: rgba(62, 174, 243,1);
        overflow: hidden;
        border-radius: 5px;
        display:block;

       
    }
    .osc_svg{
        display:block;
        overflow: visible;
    }  
</style>