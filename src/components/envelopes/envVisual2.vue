<template >
    <div class="envVisual"  @mouseup="drag=false;dragId = false" @mousemove="drag && dragId != false ? startDrag($event) : null">
        
        <div class="envVisual_box" 
        :style="{
            'height': height + 'px',
            'width': width + 'px',
            'backgroundSize': width/zoom + 'px ' + width/zoom + 'px'
            }">
            
            <div v-for="(item) in getVal()" :style="item.style" class="envKey_box">

                <svg v-if="item.name !== 'sustain'" class="envKey_svg" width="100%" height="100%">
                    
                    <path :d="item.polyPath" v-if="item.name !== 'delay'" style="fill:rgb(62, 174, 243,0.2);" />
                    <path :d="item.pathString" v-if="item.name !== 'delay'" style="fill:rgb(62, 174, 243,0); stroke:rgb(62, 174, 243,0.5); stroke-width:2"/>
                    
                    <!-- main dot -->
                    <circle r="4"  :cx="item.path.x2" :cy="item.path.y2" stroke-width="2" stroke="rgb(62, 174, 243,1)"   fill="rgba(15,10,45,1)"/>
                    <circle
                      :stroke-width="dragId === item.name ? 2 : 0 " r="14" stroke="rgb(62, 174, 243,0.5)" fill="rgba(0,0,0,0)"
                      
                      @mousedown="drag=true;dragId = item.name"
                      @mouseup="drag=false"
                      @mouseover="dragId = item.name"
                      @mouseleave ="drag ? null : dragId = false"  
                      :cx="item.path.x2" :cy="item.path.y2"  
                      />

                    <!-- curve dot -->
                     <g v-if="item.name !== 'delay'">

                         <circle  r="3"  :cx="item.width/2" :cy="item.height/2"   fill="rgba(62, 174, 243,1)"/>
                         
                         <circle
                         @mousedown="drag=true;dragId = 'curve_'+item.name"
                         @mouseup="drag=false"
                         @mouseover="dragId = 'curve_'+item.name"
                         @mouseleave ="drag ? null : dragId = false"
                         @dblclick="setCurve(item.name)"
                         :stroke-width="dragId === 'curve_'+item.name ? 2 : 0 "
                          r="14" stroke="rgb(62, 174, 243,0.5)" fill="rgba(0,0,0,0)"
                         :cx="item.width/2" :cy="item.curveHeight"  
                         />
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    data(){
        return {
            width : 448,
            height: 144,
            zoom : 4,
            drag : false,
            dragId : false,
        }
    },
    computed:{
        getEnv(){
            return store.env1.adsr
        }
    },
    methods:{
        getVal(){
            let newAdsr = {}
            let sustainH = this.getEnv.sustain.value
            let susMin = this.getEnv.sustain.minmax.min
            let susMax = this.getEnv.sustain.minmax.max 
            sustainH = this.mapper(sustainH,susMin,susMax,0,this.height)

                Object.entries(this.getEnv).forEach((entry)=>{
                    
                    let name = entry[0]
                    let val = entry[1].value
                    let min = entry[1].minmax.min
                    let max = entry[1].minmax.max
                    let curve = entry[1].curve

                    let newWidth
                    newWidth = this.mapper(val,min,max,0,this.zoom/max)
                    newWidth = this.mapper(newWidth,0,this.zoom,0,this.width)
                    newWidth < 0.1 ? newWidth = 3 : null

                    let path = {
                        x1: 0,
                        y1: 0,
                        x2:newWidth,
                        y2:0
                    }
                    let style = {}
                    let newHeight 

                    switch(name){
                        case 'delay':
                            newHeight = this.height
                            path.y1 = this.height
                            path.y2 = this.height
                            style = {
                                width: newWidth + 'px',
                                height: newHeight + 'px',
                                zIndex : '6'
                            }
                        break;
                        case 'attack':
                            newHeight = this.height
                            path.y1 = this.height
                            path.y2 = 0
                            style = {
                                width: newWidth + 'px',
                                height: newHeight + 'px',
                                zIndex : '5'
                            }
                        break;
                        case 'decay':
                            newHeight = this.height - sustainH;
                            path.y1 = 0
                            path.y2 = newHeight
                            style = {
                                width: newWidth + 'px',
                                height: newHeight + 'px',
                                zIndex : '4'
                            }
                        break;
                        case 'sustain':
                            newHeight = this.height - sustainH;
                            style = {
                                display: 'none',
                            }
                        break;
                        case 'release':
                            newHeight = sustainH
                            path.y1 = 0
                            path.y2 = sustainH 
                            style = {
                                width: newWidth + 'px',
                                height: newHeight + 'px',
                                alignSelf : 'flex-end',
                                zIndex : '3'
                            }   
                        break;
                        default:
                        break;
                    }

                    newAdsr[name] = {
                        name : name,
                        value : val,
                        width : newWidth,
                        height : newHeight,
                        path : path,
                        pathString : this.getPath(path.x1,path.y1,path.x2,path.y2,curve),
                        polyPath : this.polyPath(path.x1,path.y1,path.x2,path.y2,curve,name),
                        style : style,
                        hover : false,
                        curve : curve,
                        curveHeight : newHeight/2
                    }
                    
                })
            return newAdsr
        },
        startDrag(event){
            let name = this.dragId
            let resultX = event.movementX  
            let resultY = event.movementY
            let adsr = this.getEnv

            if (name.split('_')[0] != 'curve'){
                let val = store.env1.adsr[name].value
                let min = store.env1.adsr[name].minmax.min 
                let max = store.env1.adsr[name].minmax.max
                let step = store.env1.adsr[name].step

                val = val + resultX * step            
                if(val < min ){val = min }else if(val > max){val = max}
                
                adsr[name].value = val 
            
                if(name === 'decay'){
                    val = store.env1.adsr.sustain.value
                    min = store.env1.adsr.sustain.minmax.min 
                    max = store.env1.adsr.sustain.minmax.max
                    step = store.env1.adsr.sustain.step 
                    resultY = resultY * step
                    val = val - resultY
                    if(val < min ){val = min }else if(val > max){val = max}
                    adsr.sustain.value = val      
                }
            }else if(name.split('_')[0] === 'curve'){
                name = name.split('_')[1]
                let val = store.env1.adsr[name].curve
                val = val - resultY
                if(val < 0){val = 0}
                if(val > 100){val = 100}
                adsr[name].curve = val
            }
        },
        setCurve(name){
            store.env1.adsr[name].curve = 50
        },
        getPath(x1,y1,x2,y2,curve,name){
            
            let pathstring = `M ${x1} ${y1} `
            
            y1 > y2 ? curve = 100 - curve : null 
            
            let curveX = this.mapper(curve,0,100,x1,x2)
            let curveY = this.mapper(curve,0,100,y2,y1)
            
            pathstring += `Q${curveX} ${curveY} ${x2} ${y2}`
            
            //straight
            // pathstring = `M ${x1} ${y1} L ${x2} ${y2}`

            return pathstring
        },
        polyPath(x1,y1,x2,y2,curve,name){

            let polyPath = `M ${x1} ${y1} `
            
            y1 > y2 ? curve = 100 - curve : null 
            
            let curveX = this.mapper(curve,0,100,x1,x2)
            let curveY = this.mapper(curve,0,100,y2,y1)
            
            name === 'attack' ? polyPath += `Q${curveX} ${curveY} ${x2} ${y2} L ${x2} ${y1}` : null
            name === 'decay' ? polyPath += `Q${curveX} ${curveY} ${x2} ${y2} L ${x2} ${y2+this.height-y2} ${x1} ${y2+this.height-y2}` : null
            name === 'release' ? polyPath += `Q${curveX} ${curveY} ${x2} ${y2} L ${x1-1} ${y2+1}` : null
           

            return polyPath
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        }
    }
}
</script>
<style >
    .envVisual{
        width:480px;
        height:176px;
        border-radius:5px;
        overflow:hidden;
        margin-top:16px;
        padding:16px;
        background:rgba(15,10,45,1);
    }
    .envVisual_box{
        border:1px solid rgba(62, 174, 243,0.25);
        display:flex;
        /* align-items: bottom; */
        align-items: flex-start;
        position: relative;
        background-image:
        linear-gradient(to right, rgba(62, 174, 243,0.25) 1px, transparent 1px);
    }
    .envKey_box{
        
        /* border:1px solid rgba(255,0,0,0.3); */
        overflow:visible;
    }
    .envKey_svg{
        overflow:visible;
        display:block;
    }
    .polygon{
        position:absolute;
        top:0;
        color:white;
    }
</style>