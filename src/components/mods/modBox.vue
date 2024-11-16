<template>
    <div :class="[active ? 'modBox_active' : '', press ? 'press' : '','modBox']" @click.prevent="this.select_modBox(name)" @mousedown.prevet="press=true" @mouseup.prevent="press=false">
        mod
        <div v-show="false" class="modBox_tab"></div>
    </div>
</template>
<script>
export default {
    props: ['active','name','select_modBox'],
    emits: [],
    data(){
        return{
            press : false
        }
    }
}
</script>
<style >
    .modBox{
        width:64px;
        height:96px;
        
        -webkit-user-select: none;
        user-select: none;

        line-height:32px;
        
        border-radius:5px;
        position:relative;

        box-shadow: inset 2px 2px 3px 1px rgba(255,255,255,0.2);

        background:#8c8c8c;
        outline:1px solid rgba(0,0,0,0.15);
    }
    .modBox_active{
        color:orange;
        background:rgb(172, 146, 99);
        text-shadow: rgba(0,0,0,0.5) 1px 1px 2px;
        /* box-shadow: inset 2px 2px 6px 3px rgba(4, 4, 4, 0.15); */
        /* background: rgba(0,0,0,0.1) */
        /* background-size: 16px 16px; */
        /* background-image:linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px); */
        /* background:none; */
    }
    .modBox_tab{
        height:100%;
        width:4px;
        background:#8c8c8c;
        position:absolute;
        right:0;
        top:0;
    }
    .press{
        background: rgb(135, 135, 135);
        box-shadow: inset 2px 2px 3px 1px rgba(0,0,0,0.2);
    }
</style>