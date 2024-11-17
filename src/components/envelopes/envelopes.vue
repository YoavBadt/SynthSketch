<template>
    <div class="envelopes">
      <Title name="Envelope" width="180px"/>
      <div class="env_box">

        <div class="envMods">
          <Button v-for="item in envelopes" :select="this.select_env" :active="item.active" :name="item.name"/>
          <!-- <ModBox  /> -->
        </div>

        <div class="envControls">
            <EnvVisual2 />
            
            <div class="knobs">
              <Knob v-for="item in getEnv.adsr" v-model.number="item.value" :soft="item.soft" :show="item.show" :name="item.name" :min="item.minmax.min" :max="item.minmax.max" :step="item.step"/>
            </div>
        </div>

      </div>
    </div>
</template>

<script>
import EnvVisual2 from './envVisual2.vue'
import ModBox from '../../components/mods/modBox.vue'
import {store} from '../../store/store.js'

export default {
    components:{ModBox,EnvVisual2},
    props:['env1'],
    emits:['update:env1'],
  data(){
    return{
      envelopes:[
        {
          name: 'env 1',
          active : true
        },
        {
          name: 'env 2',
          active : false
        },
        {
          name: 'env 3',
          active : false
        },
        {
          name: 'env 4',
          active : false
        }
      ],
      
    }
  },
  computed:{
    getEnv(){
      return store.env1
    }
  },
  methods:{
    select_env(name){
      this.envelopes.forEach((e)=> {e.name === name ? e.active = true : e.active = false})
    }
  },
  watch:{
    faders:{
      handler(){
          let adsr = {
            attack:this.faders.attack.value,
            decay:this.faders.decay.value,
            sustain:this.faders.sustain.value,
            release:this.faders.release.value
          }
        // this.$emit('update:env1',adsr)
        store.updateEnv1(adsr)
      },
      deep:true
      
    }
  }
}
</script>
<style>
.envelopes{
  height:320px;
  /* display:flex; */
  /* flex-direction:row; */
  /* width:486px; */
  border-bottom:1px solid rgba(0,0,0,0.2);
}
.env_box{
  display:flex;
  flex-direction:row;
  /* gap:16px; */
}
.envMods{
  width:96px;
  padding-left:16px;
  padding-right:16px;
  margin-top:16px;
  display:flex;
  flex-direction: column;
  /* justify-content: space-between; */
  gap:16px;

  /* height:100%; */
  /* border-bottom:1px solid black; */
   
} 
.envControls{
  /* width:480px; */
  /* margin-left:16px; */
  /* margin:0 auto; */
  /* height:100%; */
  /* background:green; */
} 
.knobs{
  width:480px;
  /* height:100px; */
  display:flex;
  flex-direction:row;
  justify-content:center;
  gap:32px;
}
</style>