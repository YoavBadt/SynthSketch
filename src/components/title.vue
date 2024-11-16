<template >
    <div class="title" :style="{'width' : width}">
        <h2 class="title_h2">{{ name }}</h2>
    </div>
</template>
<script>


export default {
    props:['name','width']
}
</script>
<style >
    .title{
        /* border-bottom:1px solid rgba(0,0,0,0.2); */
        outline:1px solid rgba(0,0,0,0.2);

        background-color: #9e9e9e;
        padding-left:4px;
        height:16px;
        /* margin: 0 auto; */
        box-shadow: inset 1px 1px 1px 1px rgba(255,255,255,0.2);
    }
    .title_h2{
        text-align:left;
        line-height:16px;
        font-size:12px;
        font-weight:600;
        color:rgba(0,0,0,0.8);
        padding:0;
    }
</style>