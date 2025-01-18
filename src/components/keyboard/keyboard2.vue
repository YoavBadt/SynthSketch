<template >
    <div class="keyboard">
        
        <div class="keyboard_box">
            <div class="flat_box" v-for="keyset in keys">
                <div v-for="(myKey,i) in keyset" :style="myKey.sharp ? getFixed(i) : null" 
                :class="[myKey.pressed ? `key_press_${myKey.flat ? 'flat':'sharp'}` : null,`key_${myKey.flat ? 'flat': 'sharp'}`]"
                
                @mousedown="keyState(myKey,'down')" 
                
                @mouseup="keyState(myKey,'up')"

                @mouseenter="keyState(myKey,'enter')"
                
                @mouseleave="keyState(myKey,'leave')"
                >
                    <span>{{myKey.name}}{{ myKey.octave }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import frequencies from './frequencies.js'
import { noteEvent } from '../../audio/elementaryEngine.js';


export default {
    data(){
        return{
            keys : [],
            octave : 3,
            mouseDown : false,
            glyphDown : []
        }
    },
    methods:{
        keyState(myKey,action){
            
            if(action === 'down'){

                myKey.pressed = true
                noteEvent('noteOn',myKey.frequency,myKey.name,myKey.octave)

            }else if(action === 'up'){

                myKey.pressed = false
                noteEvent('noteOff',myKey.frequency,myKey.name,myKey.octave)

            }else if(action === 'leave' && this.mouseDown){

                myKey.pressed = false
                noteEvent('noteOff',myKey.frequency,myKey.name,myKey.octave)

            }else if(action === 'enter' && this.mouseDown){
                
                myKey.pressed = true
                noteEvent('noteOn',myKey.frequency,myKey.name,myKey.octave)

            }

        },
        getFixed(i){
            
            let a = 0
            let obj = {}
            
            if(i == 3 || i == 6 ){
                a = 16
            }else if(i == 8){
                a = 32
            }else if(i == 10){
                a = 48
            }
            let left = (32 * i) - a
            
                obj = {
                    'position': 'absolute',
                    'left' : left + 'px'
                }
            
            return obj
        },
        handleKeydown(event){
            event.preventDefault();
            let myKey
            myKey = this.keys[0].find((e) => e.glyph === event.key)

            if(myKey && this.glyphDown.includes(event.key) == false ){
                this.glyphDown.push(event.key)
                myKey.pressed = true
                noteEvent( 'noteOn',myKey.frequency, myKey.name,myKey.octave)
            }
        },
        handleKeyup(event){
            event.preventDefault();
            let myKey
            myKey = this.keys[0].find((e) => e.glyph === event.key)
            if(myKey){
                this.glyphDown = this.glyphDown.filter((e)=>e !== event.key)
                myKey.pressed = false
                noteEvent( 'noteOff',myKey.frequency, myKey.name,myKey.octave)
            }
        },
        handleMouseUp(){
            this.mouseDown = false
            
        },
        handleMouseDown(){
            this.mouseDown = true
            
        }
    },
    created(){
        let arr = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
        let glyphs = ['a','w','s','e','d','f','t','g','y','h','u','j']

        let keys = [[],[],[]]
        arr.forEach((e,i)=>{
            let freqIndex
            let flat = true
            let sharp = false    
            e.includes('#') ? freqIndex = e.split('#')[0] + 's' : freqIndex = e  
            e.includes('#') ? (flat = false,sharp = true) : null 
            keys[0].push(
                {
                    name : e,
                    glyph : glyphs[i],
                    pressed : false,
                    octave : this.octave,
                    flat : flat,
                    sharp : sharp,
                    index : i,
                    frequency : frequencies[freqIndex][this.octave],
                    freqIndex : freqIndex
                }
            )
        })

        for(let t=1;t<3;t++){
            
            keys[0].forEach((e,i)=>{
                let newKey = {...e}
                newKey.octave += t
                newKey.frequency = frequencies[newKey.freqIndex][newKey.octave]
                newKey.glyph = false
                keys[t].push(newKey)
            })

        }
            
        this.keys = keys
        
            
    },
    mounted(){
        window.addEventListener("keydown", this.handleKeydown);
        window.addEventListener("keyup", this.handleKeyup);
        window.addEventListener("mouseup",this.handleMouseUp);
        window.addEventListener("mousedown",this.handleMouseDown);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("keyup", this.handleKeyup);
        window.removeEventListener("mouseup",this.handleMouseUp);
        window.removeEventListener("mousedown",this.handleMouseDown);
  },
}
</script>
<style >
    .keyboard{
        height:calc(10 * 16px);
        overflow:hidden;
        position:relative;
        display:flex;
        flex-direction: row;
        
    }
    .keyboard_controls{
        height:100%;
        width:128px;
        border-right:1px solid rgba(0,0,0,0.2);
    }
    .keyboard_box{
        /* width:100%; */
         /* 672px; */
         margin:0 auto;
        height:100%;
        background:#717171;
        position:relative;
        display:flex;
        flex-direction: row;
    }
    .flat_box{
        width:calc(21 * 16px);
        height:100%;
        position:relative;
        display:flex;
        flex-direction: row;
        align-content: stretch;
        
    }
   
    .sharp_box{
        position:absolute;
        z-index:2;
        width:100%;
        display:flex;
        flex-direction: row;
        padding-left:32px;
        
        
    }
    .key_sharp{
        width:32px;
        height:80px;
        color:rgba(255,255,255,0.25);
        display:flex;
        flex-direction: column-reverse;
        padding-bottom:15px;
        border-radius:0 0 5px 5px;
        outline:1px solid rgba(0,0,0,0.2);
        background:#201e1e; 
        box-shadow: inset 0px -8px 0px 0px rgb(158, 158, 158,0.25),inset 0px -3px 4px 0px rgba(0, 0, 0, 0.8);
    }
    .key_press_sharp{
        box-shadow: 0px 4px 0px 1px rgba(0,0,0,0.1);
        background:linear-gradient(to bottom, rgb(22, 22, 22) 0px, #201e1e 25%);
        padding-bottom:10px;
    }

    .key_flat{
        height: 128px;
        width: 48px;
        color:rgba(0,0,0,0.5);
        display:flex;
        flex-direction: column-reverse;
        padding-bottom:15px;
        border-radius:0 0 5px 5px;
        outline:1px solid rgba(0,0,0,0.2);
        background:var(--grad),var(--back);
        /* box-shadow: inset 0px -4px 0px 1px rgb(130, 130, 130), inset 0px -5px 1px 2px rgba(255,255,255,0.15); */
        box-shadow: inset 0px -4px 0px 1px rgba(0,0,0,0.25),inset 0px -5px 1px 2px rgba(255,255,255,0.15);
    }
    .key_press_flat{
        box-shadow: 0px 4px 0px 1px rgba(0,0,0,0.1);
        background:linear-gradient(to bottom, rgb(151, 151, 151) 0px, var(--back) 50%);
        padding-bottom:10px;
    }
    
    
</style>