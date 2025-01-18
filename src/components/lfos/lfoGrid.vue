<template >
    <div class="LFO_grid">
        <div >
            <div class="LFO_grid_digit"
            @dblclick="update('x','default')"
            >
                {{getGrid.x}}
            </div>
            <div class="LFO_grid_btns">
                <div class="LFO_grid_btn" style="border-bottom:1px solid rgba(0,0,0,0.2)"
                @click="update('x','+')"
                
                >
                    +
                </div>
                <div class="LFO_grid_btn"
                @click="update('x','-')"
                style="line-height: 12px;padding-left:1.5px"
                >
                    -
                </div>
            </div>
        </div>
        <!-- <div style="background:#3eaef3;width:1px;height:26px;margin-top:3px">&nbsp;</div> -->
        <div >
            <div class="LFO_grid_digit"
            @dblclick="update('y','default')"
            >
                {{getGrid.y}}
            </div>
            <div class="LFO_grid_btns">
                <div class="LFO_grid_btn" style="border-bottom:1px solid rgba(0,0,0,0.2)"
                @click="update('y','+')"
                >
                    +
                </div>
                <div class="LFO_grid_btn"
                @click="update('y','1')"
                style="line-height: 12px;padding-left:1.5px"
                >
                    -
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import {store} from '../../store/store.js'
export default {
    data(){
        return{
            x:null,
            y:null
        }
    },
    methods:{
        update(grid,way){
            let x1 = this.getGrid.x
            let y1 = this.getGrid.y
            

            if(grid === 'x'){
                way === '+' ? x1++ : x1--
                x1 < 1 ? x1 = 1 : null
                x1 > 32 ? x1 = 32 : null
                way === 'default' ? x1 = 4 : null 
            }else if(grid === 'y'){
                way === '+' ? y1++ : y1-- 
                y1 < 1 ? y1 = 1 : null
                y1 > 24 ? y1 = 24 : null
                way === 'default' ? y1 = 4 : null
            }

            let n_store = store.lfo1
            n_store.gridX = x1
            n_store.gridY = y1
            store.updateLFO1({...n_store})
        }
    },
    computed:{
       getGrid(){
            return {
                x: store.lfo1.gridX,
                y: store.lfo1.gridY
            }
        }     
    }
}
</script>
<style >
.LFO_grid{
    display:flex;
    flex-direction: row;
}
.LFO_grid > div{
    width:50%;
    height:100%;
    
    display:flex;
    flex-direction: row;
    justify-content:space-between;
}
.LFO_grid_digit{
    width:32px;
    display:flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
}
.LFO_grid_btn{
    height:16px;
    width:16px;
    /* background:Red; */
    text-align:left;
    border-left:1px solid rgba(0,0,0,0.2);
    line-height: 16px;
}
</style>