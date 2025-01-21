<template>
    <div class="filter_window">

        <svg class="filter_svg" :width="width" :height="height">
            <!-- <rect class="envBg" x="0" y="0" width="100%" height="100%" fill="yellow" stroke="rgba(62, 174, 243,0.25)" stroke-width="2"/> -->
            
            <g stroke-width="1" stroke="rgba(62, 174, 243,1)">
                 <path :d="com_Path" style="fill:rgb(62, 174, 243,0.2); stroke:rgb(62, 174, 243,0.5); stroke-width:3" />
            </g>
            
            <!-- <g v-for="(n,i) in com_Dots">
                <circle v-if="i%2!=0" :cx="n[0]" :cy="n[1]" r="2" fill="yellow" stroke-width="0"/>
                
                <circle v-if="i%2==0" :cx="n[0]" :cy="n[1]" r="2" fill="red" stroke-width="0"/>
            </g> -->

        <line x1="0" x2="100%" y1="50%" y2="50%" stroke="rgba(62, 174, 243,0.5)" stroke-width="1"/>
</svg>

</div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    props:['mode','cutoff','resonance'],

    data(){
        return{
            width: 16*14,
            height: 16 * 6,
            
        }
    },
    methods:{
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
    },
    watch:{
        getStore(oldGetStore,newGetStore){
            // this.reso = newGetStore.resonance //this doesnt matter
        }
    },
    computed:{
        getStore(){
            return store.filter1
        },
        com_Dots(){
            let h = this.height
            let w = this.width
            
            let cut = this.cutoff
            cut = this.mapper(cut,0,100,0,w)
            cut = Math.trunc(cut)

            let reso = this.resonance
            reso = this.mapper(reso,0,100,h/2,0+(h/10))
            reso = Math.trunc(reso)
           
            let r = this.resonance
            r = Math.trunc(r)
            
            let dots = [
                [(cut-50),h/2],
                [cut-5,(reso+5 >= h/2 ? h/2 : reso+5)], 
                [cut,reso], //the cut point
                [cut+5,reso+5], 
                [(cut+50),h],
            ]
            // let dots = [
            //     [0,h/2],
            //     [cut-60+(r*0.25)    ,h/2+(r*0.1)],    //curve to peak
            //     [cut-30+(r*0.28)    ,reso+(r*0.01)],  //peak dot 1
            //     [cut+(r*0.01)    ,reso-(r*0.3)],     //curve between
            //     [cut+30-(r*0.28)    ,reso+20-(r/5)], // peak dot 2
            //     [cut+80-(r/2)    ,h],               //curve down
            //     [cut+80          ,h]                //dot
            // ]
            
            return dots
        },
        com_Path(){
            let h = this.height
            let dots = this.com_Dots

            let str = `M 0,${h/2} `

            dots.forEach((e,i)=>{
                
                switch(i){
                    case 0:
                        str += `L ${e[0]},${e[1]} `
                        break;
                    case 1:
                        str += `Q ${e[0]-20},${h/2} ${e[0]},${e[1]}`
                        break;
                    case 2:
                        // str += `L ${e[0]},${e[1]} `
                        // str += `Q ${e[0]-20},${h/2} ${e[0]},${e[1]}`
                        break;
                    case 3:
                        str += `Q ${e[0]-5},${e[1]-10} ${e[0]},${e[1]} `
                        // str += `L ${e[0]},${e[1]} `
                        break;
                    case 4:
                        str += `Q  ${e[0]-20},${h} ${e[0]},${e[1]}`
                        break;
                }

                
            })
            str += `L ${0},${h}`
            return str
            // return `M ${0} ${h/2} 
            //         Q ${cut-40-(reso/4)},${h/2}   ${cut-10-(reso/4)} ${reso}
            //         Q ${cut-5},${reso-5} ${cut} ${reso}  
            //         Q ${cut+80},${h}     ${cut+80},${h}
            //         L ${0},${h}` 
                    
        }
    }
}
</script>
<style >
    .filter_window{
        width :calc(var(--grid-size) * 14);
        height: calc(var(--grid-size) * 6);
        background: rgba(15,10,45,1);
        color: rgba(62, 174, 243,1);
        overflow: hidden;
        /* border-radius: 5px; */
        /* padding:16px; */
        display:block;
    }
    .filter_svg{
        display:block;
    }
    
</style>