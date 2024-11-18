<template >
    <div>
    <div class="lfoVisual" :width="width" :height="height" @mouseup="deselect">
        <svg :width="width" :height="height" class="lfoSvgBox" @mouseup="deselect">
             
            <!-- background -->
             <rect class="envBg" x="0" y="0" width="100%" height="100%" fill="rgba(15,10,45,1)" stroke="rgba(62, 174, 243,0.2)" stroke-width="1"/>
             
             <!-- grid -->
             <g v-for="(item,i) in getGrid"  class="envGrid" stroke="rgba(62, 174, 243,0.2)" stroke-width="1" >
                 <line  :x1="item.val" :x2="item.val" y1="0" :y2="height"   />
                 <line v-for="(item2,i) in item.children" x1="0" :x2="width" :y1="item2.val" :y2="item2.val"  />
            </g> 

            <g v-for="item in this.rects">
                <rect :x="item.x" :y="item.y" :width="item.width" :height="item.height" stroke-width="1" fill="none" stroke="rgba(256,0,0,0.2)"/>
            </g>

            <!-- LFO path -->
            <g  style="fill:rgb(62, 174, 243,0.2); stroke:rgb(62, 174, 243,0.5); stroke-width:2" >
                <path :d="drawPath()"  @dblclick="addDot(e,$event)"/>
            </g>

            
            <!-- controlpoints -->
            
            <g v-for="dot in dots" v-if="true">
                
                <g >
                    <circle r="4"  :cx="dot.x" :cy="dot.y" stroke-width="2" stroke="rgb(62, 174, 243,1)"   fill="rgba(15,10,45,1)"/>

                    <circle r="14" :cx="dot.x" :cy="dot.y" stroke="rgb(62, 174, 243,0.5)" fill="rgba(0,0,0,0)" 
                    :stroke-width="dot.hover ? 2 : 0 "
                    @mouseover="dot.hover=true"
                    @mousedown.prevent="dot.selected=true"
                    @mouseup="dot.selected=false"
                    @mousemove="dot.selected ? startDrag(dot,$event) : null"
                    @mouseleave="dot.hover=false"
                    @dblclick="removeDot(dot)"
                    />
                </g>

            </g>
             <g v-for="dot in rects">
                <circle r="3"  :cx="dot.x+dot.width/2" :cy="dot.curveDotY" fill="rgba(62, 174, 243,1)"/>

                <circle r="14" :cx="dot.x+dot.width/2" :cy="dot.curveDotY" stroke="rgb(62, 174, 243,0.5)" fill="rgba(0,0,0,0)" 
                :stroke-width="dot.hover ? 2 : 2 "
                @mouseover="dot.hover=true"
                @mousedown.prevent="dot.selected=true"
                @mouseup="dot.selected=false"
                @mousemove="dot.selected ? curveDrag(dot,$event) : null"
                @mouseleave="dot.hover=false"
                
                />
            </g> 
        </svg>
       
    </div>
</div>
</template>
<script>
import {store} from '../../store/store.js'

export default {
    
    data(){
        return {
            width : 448,
            height: 192, //*1.5
            lfoType : null,
            dots : [],
            rects: [],
            drag : {
                start : false,
                id : ''
            },
            grid : {
                Y : 4,
                X : 4,
                G : []
            },
            
        }
    },
    methods:{
        startDrag(dot,e){
            let X = e.movementX
            let Y = e.movementY
            let dots = this.dots
            let index = dot.index

            let resultY = Math.trunc(dot.y + Y)
            let resultX = Math.trunc(dot.x + X)
            
                if(dot.type === 'start'&& resultY > 0 && resultY <this.height){
                    dot.y = resultY
                    this.dots.find((e)=>e.type === 'end').y += Y
                }else if(dot.type === 'end'&& resultY > 0 && resultY <this.height){
                    dot.y = resultY
                    this.dots.find((e)=>e.type === 'start').y += Y
                }else if(dot.type === 'control' && resultY > 0 && resultY <this.height && resultX > 0 && resultX < this.width){

                   if(resultX > dot.prevX && resultX < dot.nextX){
                    
                        dot.x = resultX

                        dots.forEach((e,i)=>{
                            if(i>0 && i< dots.length-1){
                                e.nextX = dots[i+1].x
                                e.prevX = dots[i-1].x
                            }
                        })
                   }  
                    dot.y = resultY   
                }
            this.dotRect()
               
        },
        curveDrag(rect,e){
            let Y = e.movementY
            let resultY = rect.curveDotY + Y
            let curveResult
            if(resultY < rect.height && resultY > rect.y){
                rect.curveDotY = resultY

                curveResult = this.mapper(resultY,rect.y+rect.height,rect.y,-50,50)
                curveResult = Math.floor(curveResult)
                rect.curve = curveResult //0.5 is up
            }
            
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        deselect(){
            
            this.dots.forEach((e)=>{
                e.selected = false
            })
        },
        addDot(e,event){
            let height = this.height
            let width = this.width
            let offX = event.offsetX
            let offY =event.offsetY
            let dots = this.dots
            let newdots = []

            let newDot = {
                x:offX/2,
                y:offY/2,
                prevX: false,
                nextX:null,
                hover : false,
                selected :false,
                type : 'control',
                index : 0
            }
            //find between
            for(let i = 0;i<dots.length-1;i++){
                newdots.push(dots[i])
                if(dots[i].x < offX/2 && dots[i+1].x > offX/2){
                    newdots.push(newDot)
                }
            }
            //push last
            newdots.push(this.dots[this.dots.length-1])

            //update Prev and next
            newdots.forEach((e,i)=>{
                if(i>0 && i< newdots.length-1){

                    e.nextX = newdots[i+1].x
                    e.prevX = newdots[i-1].x

                }
            })

            this.dots = newdots
            this.dotRect()
        },
        removeDot(dot){
            let dots = this.dots
            let newdots = []
            
            dots.forEach((e)=>{
                e !== dot ? newdots.push(e) : null
            })
            dots.forEach((e,i)=>{
                if(i>0 && i< dots.length-1){
                    e.nextX = dots[i+1].x
                    e.prevX = dots[i-1].x
                }
            })
            this.dots = newdots
            this.dotRect()
        },
        getDots(){
            let initial = this.getType.init
            let Dots = [] 
            let width = this.width
            let height = this.height 

            initial.forEach((e)=>{
                e.x === 'width'    ? e.x = width : null
                e.x === 'width/2'  ? e.x = width/2 : null
                e.y === 'height'   ? e.y = height : null
                e.y === 'height/2' ? e.y = height/2 : null
            })

            initial = [
                {
                    x:0,
                    y:height,
                    prevX: 0,
                    nextX:width/2,
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
                    hover : false,
                    selected :false,
                    type : 'end',
                    index : 2
                }
            ]
            Dots = initial
            
            //return Dots
            this.dots = Dots
        },
        drawPath(){
            let Dots = this.dots
            let height = this.height
            let width = this.width
            let dotString = `M 0 ${height} `


            let sinX
            let sinY

            let toX
            let toY 


            this.rects.forEach((rect)=>{
                //sinus smooth
                let zero
                
                let direction
                let fromX = rect.fromX
                let fromY = rect.fromY 
                let toX = rect.toX
                let toY = rect.toY

              

                let sinX
                let sinY
                let amp = rect.height/2
                let freq = 1
                let startY = rect.y+rect.height-amp
                let phase
                

                let curve = rect.curve //zero make a square!

                rect.down ? phase = rect.width : phase = 0 
                
                if(rect.up){
                    zero = rect.height/2 + rect.toY
                    direction = 1
                }else if(rect.down){
                    zero = rect.height/2 + rect.fromY
                    direction = -1
                }
                
                dotString += `L${fromX} ${fromY}`


                for(let i=0;i<(rect.width);i+=1){
                    sinX= rect.x + i 
                    sinY = amp * direction * Math.cos( i * Math.PI / rect.width ) + zero
                    
                    // sinY = rect.height/2+rect.y + Math.tan( (i) * Math.PI * freq/(rect.width))
                    dotString += `L${sinX} ${sinY}`
                }

                
                //no smooth
                // dotString += `L${toX} ${toY}` 
            })
            dotString += `L ${width} ${height} `
            return dotString
        },
        sigmoid(z){
            return 1 / (1 + Math.exp(-z));
        },
        dotRect(){
            let rects = []
            let dots = this.dots
            let width = this.width
            let height = this.height
            let a
            let b
            let c
            let d
            let up = false
            let down = false
            dots.forEach((dot,i)=>{
            
               
                if(i > 0 ){

                    a = dots[i-1].y
                    b = dot.y

                    b < a ? up = true : down = true;
                    b < a ? down = false : up = false;

                    b > a ? c = b-a : c=a-b
                    d = b < a ? b : a


                    rects.push({
                    x: dots[i-1].x,
                    y: d,
                    width: dot.x - dots[i-1].x,
                    height : c,
                    up: up,
                    down : down,
                    toX : dot.x,
                    toY : dot.y,
                    fromX: dots[i-1].x,
                    fromY: dots[i-1].y,
                    curve: 0,
                    curveDotY: d+c/2,
                    hover:false,
                    selected:false
                    })
                }

                
            })
            
            this.rects = rects
            
        },
    },
    computed:{
        getType(){
            return store.lfo1.LFOtypes.find((e)=>e.selected)
        },
        getGrid(){
            let grid = []
            for(let i = 1;i < store.lfo1.gridX;i++){
                let xObject = {
                    val : i*(this.width/store.lfo1.gridX),
                    children : []
                }

                for(let i = 1;i < store.lfo1.gridY;i++){
                    let yObjet = {
                        val : i*(this.height/store.lfo1.gridY)
                    }
                    xObject.children.push(yObjet)
                    
                }
                grid.push(xObject)
            }
            return grid
        },
        getLFO1(){
            return store.lfo1
        }
    },
    watch:{
        getType(newGetType,oldGetType){
            this.lfoType = newGetType.name
        }
    },
    created(){
        //this.initial = (this.getInitial(this.lfoType)) //this will be a prop! dont do it on update!
        this.lfoType = this.getType.name
        this.getDots()
        this.dotRect()
    }
}
</script>
<style>
    .lfoVisual{
        border-radius:5px;
        overflow:visible;
        width:480px;
        height:224px;
        /* width:calc(1.5 * 384px); */
        /* height:calc(1.5 * 192px); */
        padding:16px;
        background:rgba(15,10,45,1)
    }
    .lfoSvgBox{
        display:block;
        overflow:visible;
    }
</style>