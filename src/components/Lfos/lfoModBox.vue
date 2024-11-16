<template >
    <div class="envLfoBox"
    :class="[active ? 'lfoModBox_active' : '', 'lfoModBox']"
    @click="this.select_lfo(name)"
    >
        {{name}}
        <!-- <div v-show="!active" class="envLfoBox_tab" select_lfo="this.select_lfo"></div> -->
    </div>
</template>
<script>
export default {
    props: ['active','name','select_lfo'],
}
</script>
<style >
    .envLfoBox{
        width:64px;
        height:80px;
        background:none;
        position:relative
    }
    .envLfoBox_active{
        background:#8c8c8c;
        background-size: 16px 16px;
        background-image:linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        /* background:none; */
    }
    .envLfoBox_tab{
        height:100%;
        width:4px;
        background:#8c8c8c;
        position:absolute;
        right:0;
        top:0;
    }
</style>