<template >
    <div class="slider">
        <div class="slider-box">
            <input class="slider-input" type='range' :step="step" :min="min" :max="max" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" ref="inputrange">
        </div>
        
        <div class="value">
            <h3 class="digits">{{ modelValue }}</h3>    
        </div>
        <h3 class="digits">{{name}}</h3>
    </div>
</template>

<script>
export default {
    props: ['modelValue','name','min','max','step'],
    emits: ['update:modelValue']
}
</script>
<style lang="css">
    .slider{
        width:100px;
        height:300px;
        padding-right:5px;
        padding-left:5px;
        outline: 1px solid black;
        /* overflow: hidden; */
    }
    .slider-box{
        height:200px;
        width:10px;
        border-radius:4px;
        margin: 0 auto;
        position:relative;
        background: rgba(0,0,0,0.1);
        box-shadow: inset 0px 5px 10px 1px rgba(0, 0, 0,0.2);
        /* 0px 5px 5px 1px rgba(0, 0, 0,0.1); */
        border-bottom: 1px solid grey;
        /* align-items: stretch;
        justify-content: center; */
    }
    .slider-box::before,.slider-box::after{
        display:block;
        position:absolute;
        z-index:99;
        width:100%;
        text-align:center;
        pointer-events:none;
    }
    .slider-box::before{
        content: "";
    }
    .slider-box::after{
        content: "";
        bottom: 0
    }

    .slider-input{
        -webkit-appearance: none;
        background-color: rgba(255, 255, 255, 0.8);
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0;
        padding: 0;
        width: 200px;
        height: 10px;
        transform: translate(-50%, -50%) rotate(-90deg);
        border-radius: 5px;
        overflow: hidden;
        cursor: row-resize;
    }
    .slider-input[step] {
        background-color: transparent;
        /* background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2) calc(12.5% - 1px), #6f6f98 12.5%); */
    }
    .slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 5px;
        height:40px;
        background:rgb(62, 174, 243);
        box-shadow: -100px 0 0 100px rgb(117, 189, 233)
    }
    .slider-input::-moz-range-thumb {
        border: none;
        width: 0;
        /* box-shadow: -20rem 0 0 20rem rgba(255, 255, 255, 0.2); */
    }


    .slider-button{
        height:20px;
        width:100%;
        background:white;
        border-radius:5px;
        border: 1px solid grey;
        margin:0;
        padding:0;
    }
    .value{
        width:100%;
        /* background: white; */
    }
    .digits{
        text-align: center;
        font-size: 16px;
        line-height: 40px;
        font-weight: medium;
        text-transform: uppercase ;
        width:100%;
    }
</style>