<template>
  
    <div class="Synth ">
      <Threedee v-if="ThreeDee"/>
      <div class="topbar ">

        <button class="graph-w-8"  @click="ThreeDee = !ThreeDee">
          <template v-if="!ThreeDee">Open</template>
          <template v-if="ThreeDee">Close</template>
          Three Dee</button>
      </div>
      
      <div class="row2">
        
      <div class="left">
        
        <!-- <div class="macros"></div> -->
             
        <Osc v-for="(oscilator,i) in store.oscilators" :name="oscilator.name" :oscNum="i"/>
        
            
        <div class="filters">
          <Filter v-for="filter in store.filters" :name="filter.name" />
          
        </div>
      </div>
        <div class="right">
          <Envelopes />
          <Lfo/>
           <!-- <Trial /> -->
        </div>
        
      <!-- close row -->
      </div>
      
      <Keyboard2 />
    </div>
  
</template>

<script>
import {store}    from '../../store/store.js'
import Envelopes  from '../../components/envelopes/envelopes.vue'
import Lfo        from '../../components/lfos/lfo.vue'
import Osc        from '../../components/oscilators/osc.vue'
import Filter     from '../../components/filters/filter.vue'
import Keyboard   from '../../components/keyboard/keyboard.vue'
import Keyboard2  from '../../components/keyboard/keyboard2.vue'
import Trial      from '../../components/trial/trial.vue'
import Threedee   from  '../../components/threedee/threedee.vue'


export default{
  components:{
    Envelopes,Lfo,Osc,Filter,Keyboard,Keyboard2,Trial,Threedee
  },
  data(){
    return{
      store,
      ThreeDee : false,
      synth:{}
      
    }
  },
  methods:{
    init(){
        // initializeEngine()
        // MidiInit()
    },
    toneStart(){
      // start()
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
    width:calc(76 * 16px);
    height: calc(54 * 16px);
    outline:1px solid black;
    overflow:hidden;
    border-radius:8px;
    
    background: var(--back);
    
    /* lines */
    background-size: var(--graph-size) var(--graph-size);
    background-image:
    linear-gradient(to bottom, var(--graph) 1px, transparent 1px),
    linear-gradient(to right, var(--graph) 1px, transparent 1px);
    
    box-shadow: 5px 15px 20px 2px rgba(0,0,0,0.25),inset 2px 2px 3px 1px rgba(255,255,255,0.2);
  }
  .topbar{
    width:100%;
    height:64px;
    padding:16px 32px;
    box-shadow: var(--card);
    background:var(--grad);
    outline:1px solid rgba(0,0,0,0.2);
    
  }
  .row2{
    width:100%;
    height:calc(40 * 16px);
    border-bottom:1px solid rgba(0,0,0,0.2);
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* display:flex; */
    /* flex-direction: row; */
  }
  .left{
    width: calc(36 * var(--grid-size));
    height: 100%;
    border-right:1px solid rgba(0,0,0,0.2);
  }
  
  .macros{
    width:calc(2 * 16px);
    height:100%;
    /* padding-right:16px; */
    padding-top:16px;
    border-right:1px solid rgba(0,0,0,0.2);

  }
  
  .filters{
    width:100%;
    display:grid;
    grid-template-columns: 1fr 1fr;
    /* gap:16px;  */
    /* border-bottom:1px solid rgba(0,0,0,0.2) */
  }
  .right{
    width:100%;
    height:100%;
    /* border-right:1px solid rgba(0,0,0,0.2); */
  }


</style>
