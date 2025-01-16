<template >
    <div class="reso_box"
        @mouseup="drag = false"
        @mousemove="drag ? startDrag($event) : null"
        
        @mouseenter="checkMouse"
        @mouseleave ="checkMouse"
    >
    <div class="reso_pointer" :style="{'top': getH + '%'}"
        @mouseup="drag = false"
        @mousemove="drag ? startDrag($event) : null"
        @mousedown.prevent="{add();drag = true}"
    ></div>
            <div class="reso">
            <div class="reso_marker" :style="{'height': 100 - getH + '%'}"></div>
        </div>    
    </div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    
    
    data(){
        return{
            height: 128,
            drag : false,
             
        }
    },
    computed:{
        getH(){
            let w = store.filter1.resonance
            let min = store.filter1.resMin
            let max = store.filter1.resMax
            w = this.mapper(w,min,max,75,0)
            return w //{width : w + '%'}
        }
    },
    methods:{
        add(){
            // console.log('add')
            // document.addEventListener('mousedown',console.log('down'))
            document.addEventListener('mouseup',this.checkMouse)
        },
        checkMouse(){
            this.drag=false
            document.removeEventListener('mouseup',this.checkMouse)
        },
        startDrag(event){
            // console.log(event)
            let h = store.filter1.resonance
            let min = store.filter1.resMin
            let max = store.filter1.resMax

            let num = event.movementY

            h = h - num

            h = Math.floor(h)
            
            if(h < min){
                h = min
            }else if(h > max){
                h = max
            }


            let newFilter = store.filter1
            newFilter.resonance = h
            store.updateFilter1({...newFilter})
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        }
    }
}
</script>
<style >
    .reso_box{
        width:32px;
        height:128px;
        border-radius:0 6px 6px 0px;
        padding-left:12px;
        /* overflow:hidden; */
        position:relative;
        /* background: #9e9e9e; */
        /* outline:1px solid rgba(0,0,0,0.2); */
        /* box-shadow: inset 1px 1px 3px 0px rgba(255,255,255,0.3); */
    }
    .reso{
        width:8px;
        height:100%;
        background:rgba(0,0,0,0.5);
        overflow:hidden;
        display:flex;
        flex-direction: column-reverse
    }
    .reso_marker{
        box-shadow:  inset 0px 1px 2px 0px rgba(0,0,0,0.5);
        background:var(--highlight);
    }
    .reso_pointer{
        height:32px;
        width:12px;
        position:absolute;
        left:10px;
        background:var(--back);
        border-radius:4px;
        outline:1px solid rgba(0,0,0,0.2);
        box-shadow: inset 0px 1px 3px 0px rgba(255,255,255,0.3),1px 1px 1px 1px rgba(0,0,0,0.3);
        
    }
</style>