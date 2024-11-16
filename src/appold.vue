<template>
    <!-- {{ adsr }}
    <div id="vue-canvas" ref="kanvas"></div>
    <button @click="change_attack">{{ adsr.attack }}</button> -->
    
    
    <div class="tres">
      <TresCanvas clear-color="lightgrey">
        <!-- <TresOrthographicCamera :position="[0,0,1]" :look-at="[0, 0, 0]"/> -->
         <TresOrthographicCamera/>
        <TresAxesHelper :args="[200]"/>
        <!-- v-for="(item,index) in arr" -->
        <TresMesh  :position="[-250,0,0]">
          <TresBoxGeometry :args="[25,25,0]"/>
          <TresMeshBasicMaterial color="teal" />
        </TresMesh>
        <Line2 
        v-for="n in 25"
        :points="[[50, -100, 0], [50, 100, 0]]"
        :line-width="1"
        color="black"
      />
        <TresGridHelper />
        <!-- <OrbitControls /> -->
      </TresCanvas>
    </div>
  
  </template>
  
  <script setup>
  import { Line2,OrbitControls } from '@tresjs/cientos'
  
  
  
  // import p5 from 'p5'
  // import { TresCanvas } from '@tresjs/core'
  
  
  // export default{
  
  //   components:{
      
  //   },
  //   data(){
  //     return {
  //       adsr : {
  //         delay : 0,
  //         attack: 50,
  //         decay : 25,
  //         sustain: 50,
  //         release: 20
  //       }
  //     }
  //   },
  //   methods :{
  //     change_attack(){
  //       this.adsr.attack = 100
  //     }
  //   },
  //   mounted(){
  //     const width = 500
  //     const height = 200
      
  //     const attack = this.adsr.attack 
  //     const decay = this.adsr.decay 
  //     const sustain = this.adsr.sustain
  //     const release = this.adsr.release
      
  //     const ref = this.$refs.kanvas
  
  //     const script = function(p5){
        
  //       p5.setup = () => {
  //         const canvas = p5.createCanvas(width, height);
  //         canvas.background(245);
  
          
  //         p5.noLoop();
  //         //redraw....
  //         // canvas.parent(ref);
  //       };
  //       p5.draw = _ => {
  //           //attack
  //         const attackpath = p5.line(0, height, attack, 0)
  //         const attacknode = p5.circle(attack, 0, 15)
  
  //         //decay + sustain
  //         const decaypath = p5.line(attack, 0, decay+attack, sustain)
  //         const decaynode = p5.circle(decay+attack, sustain, 15)
  
  //         //release 
  //         const releasepath = p5.line(decay+attack, sustain, release+attack+decay, height)
  //         const releasenode = p5.circle(release+attack+decay, height, 15)
  //       }    
  //     }
  //     new p5(script,ref)
  //   }
  // }
  </script>
  
  
  
  <style >
  
  .tres{
    width:500px;
    height:200px;
    border: 1px solid red;
  }
  /* header {
    line-height: 1.5;
  }
  
  .logo {
    display: block;
    margin: 0 auto 2rem;
  }
  
  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }
  
    .logo {
      margin: 0 2rem 0 0;
    }
  
    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    } 
  }*/
  </style>
  