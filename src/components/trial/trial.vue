<template >
    <div class="trial">
        <svg class="trial_svg" width="100%" height="100%">
            
            <line x1="0" :y1="height/2" :x2="width" :y2="height/2" stroke="grey" stroke-width="1"/>

            <g v-for="dot in dots">
                <circle r="4"  :cx="dot.x" :cy="dot.y" stroke-width="1" stroke="rgb(62, 174, 243,1)"   fill="rgba(15,10,45,1)"/> 
            </g>

            <g  style="fill:rgb(62, 174, 243,0.2); stroke:blue; stroke-width:2" >
                <path :d="drawEc()"  />
            </g>

        </svg>
    </div>
</template>
<script>
export default {
    data(){
        return{
            width: 480,
            height:256,
            dots : [],
            initial : []
        }
    },
    created(){
        let height = this.height
        let width = this.width
        let initial = [
                {
                    x:0,
                    y:height,
                    prevX: 0,
                    nextX:width/2,
                    prevY: height,
                    nextY:0,
                    hover : false,
                    selected :false,
                    type : 'start',
                    index : 0
                },
                {
                    x:width/2,
                    y:0,
                    prevX: 0,
                    nextX:width,
                    prevY: height,
                    nextY:height,
                    hover : false,
                    selected :false,
                    type : 'control',
                    index : 1
                },
                {
                    x:width,
                    y:height,
                    prevX: width/2,
                    nextX : width,
                    prevY: 0,
                    nextY:height,
                    hover : false,
                    selected :false,
                    type : 'end',
                    index : 2
                }
            ]
        this.dots = initial
        
    },
    methods:{
        drawEc(){
            let width = this.width
            let height = this.height 
            let newX
            let newY
            let distance
            let distH
            let ratio
            let dotString = `M ${0} ${height} `
            let t = 16
            let step = 4
            let rounding

            this.dots.forEach((dot)=>{

                distance = dot.nextX-dot.x
                distH = dot.nextY+dot.y * -1 //without -1 it produces a saw wave!
                ratio = distH/distance
               
                

                for(let i=0;i<distance;i += 1){
                    //Math.sin( i * (Math.PI*2 / 6) )
                    //* Math.cos(i * (Math.PI*2 / 6))// * 2

                    //sine problematic
                    //newY = distH/2 * Math.cos(i * Math.PI*2 / 480) + distH/2
                    //newX =  dot.x + i

                    //triangle
                    //newY = dot.y + (i * (distH/distance) ) 
                    //newX =  dot.x + i

                    //step ladder
                    i%(distance/step) == 0 ? rounding=0 : rounding=1
                    newY = dot.y + ( Math.floor( i / ( distance/step ) ) * (distH / step)  ) 
                    newX =  dot.x + i  + rounding 

                  
                    dotString += `L ${newX} ${newY} `
    
                    
                }
                // dotString += `L ${dot.x} ${dot.y}`
            
            })
                

            dotString += `L ${width} ${height} `
            return dotString
        }
    }
}
</script>
<style >
    .trial{
        width:480px;
        height:256px;
        border:1px solid grey;
    }
    .trial_svg{
        overflow:visible;
    }
</style>