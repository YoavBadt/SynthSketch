<template >
    <div class="cut_box"
        
    >
        <div class="cut_pointer" :style="{'left': getH + '%'}"
        @mouseup="drag = false"
        @mousemove="drag ? startDrag($event) : null"
        @mousedown.prevent="{add();drag = true}"
        ></div>
        
        <div class="cut">
            <div class="cut_marker" :style="{'width': getH + '%'}"></div>
        </div> 

    </div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    
    
    data(){
        return{
            width: 224,
            drag : false,
        }
    },
    computed:{
        getH(){
            let w = store.filter1.cutoff
            let min = store.filter1.cutMin
            let max = store.filter1.cutMax
            w = this.mapper(w,min,max,0,86)
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
     
            let w = store.filter1.cutoff
            let min = store.filter1.cutMin
            let max = store.filter1.cutMax
            
            let num = event.movementX 

            // w = this.mapper(w,min,max,0,224)
            w = w + num
            // w = this.mapper(w,0,224,min,max)
            w = Math.floor(w)
 
            
            if(w < min){
                w = min
            }else if(w > max){
                w = max
            }

            let newFilter = store.filter1
            newFilter.cutoff = w
            store.updateFilter1({...newFilter})
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        }
    }
}
</script>
<style >
    .cut_box{
        width:224px;
        height:32px;
        /* background: #9e9e9e; */
        /* outline:1px solid rgba(0,0,0,0.2); */
        /* box-shadow: inset 1px 1px 3px 0px rgba(255,255,255,0.3); */
        border-radius:0 0 6px 6px;
        padding-top:12px;
        /* overflow:hidden; */
        position:relative;
    }
    .cut{
        width:100%;
        height:8px;
        background:rgba(0,0,0,0.5);
        overflow:hidden;
        display:flex;
        flex-direction: row
    }
    .cut_marker{
        box-shadow:  inset 0px 1px 2px 0px rgba(0,0,0,0.5);
        background:var(--highlight);
    }
    .cut_pointer{
        height:12px;
        width:32px;
        position:absolute;
        top:10px;
        background:var(--back);
        border-radius:4px;
        outline:1px solid rgba(0,0,0,0.2);
        box-shadow: inset 0px 1px 3px 0px rgba(255,255,255,0.3),1px 1px 1px 1px rgba(0,0,0,0.3);
    }
</style>