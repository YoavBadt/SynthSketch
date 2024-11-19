<template>
  
    <div class="Synth">
      <div class="topbar">
        <button :style="{'width' : '200px' }" @click="toneStart">tonejs start</button>
      </div>
      
      <div class="row2">
        
      <div class="left">
        <div class="left_top">
          <div class="macros"></div>
          <div class="generators">
             <div class="oscilators">
              <Osc name="Oscilator 1" oscNum="1"/>
              <Osc name="Oscilator 2" oscNum="2"/>
            </div>
            <div class="filters">
              <Filter name="filter 1" style="border-right:1px solid rgba(0,0,0,0.2)"/>
              <Filter name="filter 2" />
            </div>
          </div>
        </div>
        <Keyboard />
      </div>
        <div class="right">
          <Envelopes />
          <Lfo/>
           <!-- <Trial /> -->
        </div>

      <!-- close row -->
      </div>

        
    </div>
  
</template>

<script>
import {store}    from '../../store/store.js'
import Envelopes  from '../../components/envelopes/envelopes.vue'
import Lfo        from '../../components/lfos/lfo.vue'
import Osc        from '../../components/oscilators/osc.vue'
import Filter     from '../../components/filters/filter.vue'
import Keyboard   from '../../components/keyboard/keyboard.vue'
import Trial      from '../../components/trial/trial.vue'

import {Synth,start} from "tone";

export default{
  components:{
    Envelopes,Lfo,Osc,Filter,Keyboard,Trial
  },
  data(){
    return{
      store,
      synth:{}
      
    }
  },
  methods:{
    toneStart(){
      start()
    }
  },
  watch:{
    keyPlay(){

    }
  },
  created(){
    //this is just for dev
    // document.body.style.zoom = "200%"
    // window.scrollTo(1200, 20)
  }

}
</script>

<style >
  .Synth{
    width:1280px;
    height: 928px;
    outline:1px solid black;
    overflow:hidden;
    border-radius:8px;
    background:#9e9e9e;
    /* background:#4a5c70; */
    
    /* lines */
    background-size: 16px 16px;
    background-image:
    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
    
    box-shadow: 5px 5px 20px 20px rgba(0,0,0,0.1),inset 2px 2px 3px 1px rgba(255,255,255,0.2);
  }
  .topbar{
    width:100%;
    height:64px;
    outline:1px solid rgba(0,0,0,0.2);
    
  }
  .row2{
    width:100%;
    height:100%;
    /* border-bottom:1px solid rgba(0,0,0,0.2); */
    display:flex;
    flex-direction: row;
  }
  .left{
    width: 672px;
    height: 100%;
    border-right:1px solid rgba(0,0,0,0.2);
  }
  .left_top{
    width:672px;
    height:720px;
    border-bottom:1px solid rgba(0,0,0,0.2);
    display:flex;
    flex-direction:row;
  }
  .macros{
    width:96px;
    height:100%;
    /* padding-right:16px; */
    padding-top:16px;
    border-right:1px solid rgba(0,0,0,0.2);

  }
  .generators{
    width:576px;
    height:100%;
    /* border-right:1px solid rgba(0,0,0,0.2); */
  }
  .filters{
    width:100%;
    display:flex;
    flex-direction: row;
    /* gap:16px;  */
    border-bottom:1px solid rgba(0,0,0,0.2)
  }
  .right{
    width:608px;
    height:100%;
    /* border-right:1px solid rgba(0,0,0,0.2); */
  }


</style>
