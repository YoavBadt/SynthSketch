<template >
    <div class="reso_box"
        @mouseup="drag = false"
        @mousemove="drag ? startDrag($event) : null"
        @mousedown.prevent="{add();drag = true}"
        @mouseenter="checkMouse"
        @mouseleave ="checkMouse"
    >
            <div class="reso" 
            
            >
            <div class="reso_marker" :style="getH"></div>
            <div class="reso_pointer"></div>
        </div>    
    </div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    props:['storeValue','min','max','step'],
    
    data(){
        return{
            height: 128,
            drag : false,
             
        }
    },
    computed:{
        getH(){
            let h = store.filter1[this.storeValue]

            this.min ? h = this.mapper(h,this.min,this.max,0,100) :  null
            return {height : h + '%'}
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
            let h = store.filter1[this.storeValue]
            
            let num = event.movementY
            let newVal = h - num

            newVal = Math.floor(newVal)
            
            if(newVal < 0){
                newVal = 0
            }else if(newVal > 100){
                newVal = 100
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
    .reso_box{
        width:32px;
        height:128px;
        
        overflow:hidden;
        /* padding-right:4px; */
        padding-left:12px;
        padding-right:12px;
        /* border-radius:5px; */
        background:#9e9e9e;
        /* box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.1); */
        /* border: 1px solid rgba(0,0,0,0.1); */
    }
    .reso{
        width:10px;
        height:100%;
        border-radius:3px;
        /* outline:3px solid rgb(43, 43, 43); */
        background:grey;
        /* overflow:hidden; */
        /* box-shadow:  inset -2px -2px 3px 1px rgba(0,0,0,0.5); */
        display:flex;
        flex-direction: column-reverse
    }
    .reso_marker{
        
        width:100%;
        background:#333333;
        border-radius: 0 0 3px 3px;
        /* outline:2px solid #333333; */
        /* background:#FF9F1E; */
        box-shadow:  0px -2px 0px 0px #333333;
    }
    .reso_pointer{
        height:20px;
        margin-bottom:-0px;
        width:10px;
        /* box-shadow: inset 1px 1px 1px 1px rgba(255,255,255,0.2); */
        background:#9e9e9e;
        border-radius:4px;
        border:3px solid rgb(43, 43, 43);
        
    }
</style>