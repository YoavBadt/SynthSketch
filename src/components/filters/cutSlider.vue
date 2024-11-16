<template >
    <div class="cut_box"
        @mouseup="drag = false"
        @mousemove="drag ? startDrag($event) : null"
        @mouseenter="checkMouse"
        @mouseleave ="checkMouse"
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
    props:['storeValue','min','max','step'],
    
    data(){
        return{
            width: 224,
            drag : false,
        }
    },
    computed:{
        getH(){
            let w = store.filter1[this.storeValue]
            this.min ? w = this.mapper(w,this.min,this.max,0,100) :  null
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
            let w = store.filter1[this.storeValue]

            let num = event.movementX/2 //*0.01//* this.step
            // num = num * 1000
            num = Math.trunc(num)
            // num = num/1000
            // console.log(num)

            let newVal = w + num 

            // newVal = Math.floor(newVal)
            
            if(newVal < this.min){
                newVal = this.min
            }else if(newVal > this.max){
                newVal = this.max
            }


            let newFilter = store.filter1
            newFilter[this.storeValue] = newVal
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
        background: #9e9e9e;
        outline:1px solid rgba(0,0,0,0.2);
        border-radius:0 0 6px 6px;
        padding-top:12px;
        overflow:hidden;
        position:relative;
        box-shadow: inset 1px 1px 3px 0px rgba(255,255,255,0.3);
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
        background:#FF9F1E;
    }
    .cut_pointer{
        height:32px;
        width:12px;
        position:absolute;
        top:0;
        background:#9e9e9e;
        border-radius:4px;
        outline:1px solid rgba(0,0,0,0.2);
        box-shadow: inset 0px 1px 3px 0px rgba(255,255,255,0.3),1px 1px 1px 1px rgba(0,0,0,0.3);
    }
</style>