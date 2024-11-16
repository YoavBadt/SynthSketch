<template>
    <button 
    :class="[myActive ? 'button_selected' : '' ]" 
    @click.prevent="select(name);myActive=!myActive">
        {{ name }} 
    </button>
</template>
<script>
export default {
    props : ['name','active','select'],
    emits : ['update'],
    data(){
        return{
            myActive : false
        }
    },
    created(){
        this.myActive = this.active
    },
    updated(){
        this.myActive = this.active
    }
}
</script>
<style>
button{
  width:64px;
  height:32px;
  margin:0;
  text-transform: uppercase;
  
  -webkit-user-select: none;
  user-select: none;

  line-height:32px;
        
  border-radius:5px;

  box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.2);
  background:#9e9e9e;
  outline:1px solid rgba(0,0,0,0.15);
  text-shadow: rgba(255,255,255,0.4) 0px 1px 1px;  
}
button:active{
  background: #8c8c8c;
  box-shadow: inset 2px 2px 3px 1px rgba(0,0,0,0.2);
}
.button_selected{
  color:rgb(255, 172, 17);
  background:#909090;
  /* background: #8c8c8c; */
  box-shadow: inset 1px 1px 1px 1px rgba(0,0,0,0.2);

  /* background:rgb(172, 146, 99); */
  text-shadow:none;
   /* rgba(0,0,0,0.8) 0px -1px 2px; */
}

</style>