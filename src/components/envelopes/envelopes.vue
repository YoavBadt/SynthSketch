<template>
    <div class="envelopes">
      <!-- <Title name="Envelope" width="180px"/> -->
      

        <div class="envMods">
          <Button v-for="item in envelopes" :select="this.select_env" :active="item.active" :name="item.name"/>
          <!-- <ModBox  /> -->
        </div>

        <div class="envControls">
            <EnvVisual2 />
            
            <div class="knobs">
                <Knob  v-for="item in adsr" :name="item.name" size="big" :value="item.value"  @update:value="updateStore" :min="0" :max="100" :step="1"/>
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
   
  data(){
    return{
      adsr : store.env1.adsr,
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
      return store.env1.adsr
    }
  },
  methods:{
    select_env(name){
      this.envelopes.forEach((e)=> {e.name === name ? e.active = true : e.active = false})
    },
    updateStore(name,value){
      
      // let adsr = Object.assign( {}, store.env1.adsr ) 
      
      store.updateEnv1(name,value)
    }
  },
  
}
</script>
<style>
.envelopes{
  /* height:320px; */
  /* display:flex; */
  /* flex-direction:row; */
  /* width:486px; */
  box-shadow: var(--card);
  background:var(--grad);
  border-bottom:1px solid rgba(0,0,0,0.2);
  display:flex;
  flex-direction:row;
  padding:16px 32px;
  gap:32px;
}

.envMods{
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