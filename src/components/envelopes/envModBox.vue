<template>
    <div 
    :class="[active ? 'envModBox_active' : '', 'envModBox']"
    @click="this.select_env(name)"
    
    >
        {{name}}
        <div v-show="!active" class="envModBox_tab"></div>
    </div>
</template>
<script>
export default {
    props: ['active','name','select_env'],
    emits: [],
    data(){
        return{
            
        }
    }
}
</script>
<style >
    .envModBox{
        width:64px;
        height:80px;
        background:none;
        position:relative
    }
    .envModBox_active{
        background:#8c8c8c;
        background-size: 16px 16px;
        background-image:linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        /* background:none; */
    }
    .envModBox_tab{
        height:100%;
        width:4px;
        background:#8c8c8c;
        position:absolute;
        right:0;
        top:0;
    }
</style>