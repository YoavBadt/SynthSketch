<template>
    <div class="envVisual" @mouseup="drag.start = false">

        <svg width="100%" height="100%" class="envBox"  @mousemove="drag.start ? MouseMove($event) : null" @mouseup="drag.start = false">
        
            <!-- background -->
            <rect class="envBg" x="0" y="0" width="100%" height="100%" fill="rgba(15,10,45,1)" stroke="rgba(62, 174, 243,0.25)" stroke-width="2"/>

            <!-- time grid -->
            <g class="envGrid"  stroke-width="2" stroke="rgba(62, 174, 243,0.1)">
                <line v-for="n in 8" :x1="n*width/8" :x2="n*width/8" :y1="0" :y2="height" />
                <!-- <line v-for="n in 7"  :x1="unit"   :x2="width-unit" :y1="n*height/8" :y2="n*height/8" /> -->
                
                <!-- this line shows the cubes! -->
                <!-- <line v-for="item in polyDots" :x1="item.x" :x2="item.x" y1="0" y2="100%"   /> -->
            </g>
            
            <!-- path -->
            <path :d="com_Path" style="fill:rgb(62, 174, 243,0.2); stroke:rgb(62, 174, 243,0.5); stroke-width:3" />
            
            <!-- SamplePath -->
            <!-- <path d="M250,200 C375,200 375,200 375,0" /> -->
            
            <!-- hoverboxes -->
            <g class="hover" stroke="none" stroke-width="1" fill="rgba(0,0,0,0)">
            <rect :x="poly.a.x  "y="0"             :width="poly.b.x "              :height="height"             v-on:mousedown="drag.start = true;drag.id = 'attackCurve'"   v-on:dblclick="$emit('update:attackCurve', 50 )" />
            <rect :x="poly.b.x"  y="0"             :width="poly.c.x-poly.b.x"      :height="poly.c.y"           v-on:mousedown="drag.start = true;drag.id = 'decayCurve'"    v-on:dblclick="$emit('update:decayCurve', 50 )"/> 
            <rect :x="poly.c.x" :y="poly.c.y"      :width="poly.d.x-poly.c.x"      :height="height - poly.c.y"  v-on:mousedown="drag.start = true;drag.id = 'releaseCurve'"  v-on:dblclick="$emit('update:releaseCurve', 50 )"/>
            </g>
            
            <!-- dots -->
            <g v-for="(item,key) in poly" >
                <g v-if="!item.curve"  >
                <circle :cx="item.x" :cy="item.y" r="20" @mouseleave="item.hover=false" v-show="item.hover"                            fill="rgb(62, 174, 243,0)" stroke="rgb(62, 174, 243,1)" stroke-width="2"/>
                <circle :cx="item.x" :cy="item.y" r="5"  @mouseover="item.hover=true" @mousedown="drag.start = true;drag.id = item.id" fill="rgb(62, 174, 243,0.5)" stroke="rgb(62, 174, 243,1)" stroke-width="2"/>    
                </g>
                <g v-if="item.curve" fill="rgb(62, 174, 243,0)" stroke="rgb(62, 174, 243,1)" stroke-width="2" >
                    <circle @mouseleave="item.hover=false" v-show="item.hover"  :cx="item.newx" :cy="item.y" r="20" />
                    <circle @mouseover="item.hover=true"                        :cx="item.newx" :cy="item.y" r="3" v-on:mousedown="drag.start = true;drag.id =item.id" v-on:dblclick="$emit('update:'+ item.id , 50 );item.hover=false"/>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['delay','attack','decay','sustain','release','attackCurve','decayCurve','releaseCurve'],
    emits: ['update:delay','update:attack','update:decay','update:sustain','update:release','update:attackCurve','update:decayCurve','update:releaseCurve'],
    data(){
        return {
            width : 464-16,
            height: 176-32,
            unit : 32,
            zoom : 4,
            drag:{
                id: '',
                start : false
            },
            poly:{
                a:   {x:null,y:null,hover:false,id:'delay'},
                ab : {x:null,y:null,hover:false,id:'attackCurve',newx:null,curve:true},
                b:   {x:null,y:null,hover:false,id:'attack'},
                bc:  {x:null,y:null,hover:false,id:'decayCurve',newx:null,curve:true},
                c:   {x:null,y:null,hover:false,id:'decaysustain'},
                cd:  {x:null,y:null,hover:false,id:'releaseCurve',newx:null,curve:true},
                d:   {x:null,y:null,hover:false,id:'release'} 
            }
        }
    },
    methods:{
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        com(prop){
            if(prop === this.sustain){
                return ( this.mapper(prop,0,1,this.height,0) )
            }else{
                return ( this.mapper(prop,0,4,0,this.width) )
            }
        },
        MouseMove(event) {
            let X = event.movementX
            let Y = event.movementY
            let delay   =  this.mapper(this.poly.a.x + X,                   0,this.width,0,this.zoom)
            let attack  =  this.mapper((this.poly.b.x + X) - this.poly.a.x, 0,this.width,0,this.zoom)     
            let decay   =  this.mapper((this.poly.c.x + X) - this.poly.b.x, 0,this.width,0,this.zoom) 
            let sustain =  this.mapper(this.poly.c.y + Y,                          this.height,0,0,1)  //this.com(this.sustain)
            let release =  this.mapper((this.poly.d.x + X)-this.poly.c.x,   0,this.width,0,this.zoom) 
            
            switch(this.drag.id) {
                case 'delay':
                    delay <= 0 ? null : this.$emit('update:delay',delay)
                    break;
                case 'attackCurve':
                    this.attackCurve+Y < 0 || this.attackCurve+Y > 100  ? null : this.$emit('update:attackCurve', this.attackCurve + Y )
                    break;
                case 'attack':
                    attack <= 0  ? null : this.$emit('update:attack',attack)
                    break;
                case 'decayCurve':
                    this.decayCurve+Y < 0 || this.decayCurve+Y > 100 ? null : this.$emit('update:decayCurve', this.decayCurve + Y )
                    break;
                case 'decaysustain':
                    sustain <= 0 || sustain >= 1 ? null : this.$emit('update:sustain', sustain )
                    decay <= 0  ? null : this.$emit('update:decay', decay )
                    break;
                case 'releaseCurve':
                    this.releaseCurve+Y < 0 || this.releaseCurve+Y > 100 ? null : this.$emit('update:releaseCurve', this.releaseCurve + Y )
                    break;
                case 'release':
                    release <= 0 ? null : this.$emit('update:release',release )
                    break;
                default:
                    break;
                }
    },
    },
    computed:{
        polyDots(){
            return [this.poly.a,this.poly.b,this.poly.c,this.poly.d]
        },
        polySmallDots(){
            return [this.poly.ab,this.poly.bc,this.poly.cd]
        },
        com_Path(){
            this.com_Points
            //M0,100 C50,50 50,50 250,100
            // ${this.poly.ab.x},${this.poly.ab.y}
            return `M ${this.poly.a.x} ${this.poly.a.y} 
                    Q ${this.poly.ab.x},${this.poly.ab.y} ${this.poly.b.x} ${this.poly.b.y} 
                    Q ${this.poly.bc.x},${this.poly.bc.y} ${this.poly.c.x},${this.poly.c.y} 
                    Q ${this.poly.cd.x},${this.poly.cd.y} ${this.poly.d.x} ${this.poly.d.y}`
        },
        com_Points(){
            let delay   = 0 //this.com(this.delay)
            let attack  = delay + this.com(this.attack) 
            let decay   = attack + this.com(this.decay)
            let sustain = this.com(this.sustain)
            let release = decay + this.com(this.release) 

            //delay
            this.poly.a.x = delay
            this.poly.a.y = this.height

            //attack curve
            this.poly.ab.x  =  this.mapper(this.attackCurve,0,100,delay,attack )  
            this.poly.ab.y  =  this.mapper(this.attackCurve,0,100,0,this.height) 
            this.poly.ab.newx = delay+(attack-delay)/2

            this.poly.b.x = attack
            this.poly.b.y = 0

            //decay curve
            this.poly.bc.x =  this.mapper(this.decayCurve,0,100,decay,attack )   
            this.poly.bc.y =  this.mapper(this.decayCurve,0,100,0,sustain) 
            this.poly.bc.newx = attack+(decay-attack)/2

            this.poly.c.x = decay
            this.poly.c.y = sustain

            //release curve
            this.poly.cd.x =  this.mapper(this.releaseCurve,0,100,release,decay)  
            this.poly.cd.y =  this.mapper(this.releaseCurve,0,100,sustain,this.height) 
            this.poly.cd.newx = decay+(release-decay)/2

            this.poly.d.x = release
            this.poly.d.y = this.height 
            
        }
    },
    onMounted(){

    }
}
</script>

<style>
    .envVisual{
        width:480px;
        height:176px;
        border-radius:5px;
        overflow:hidden;
        margin-top:16px;
        padding:16px;
        background:rgba(15,10,45,1);
    }
    .envBox{
        display:block;
        margin: 0 auto;
        overflow:visible;
    }
</style>