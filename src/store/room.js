import { reactive } from 'vue'

export const store = reactive({{

    room :{ 
        width  : 100,  //for positioning
        height : 100, //for positioning
        depth  : 200,  //for positioning
        backwall : 10, //as part of width (10 out of 800 is 80)
        depth_div : 20, //for drawing the grid
        div :10, //for drawing the grid
        frontLeftTop = {x:0,y:100,z:0},
        frontRightTop = {x:100,y:100,z:0},
        frontLeftBottom = {x:0,y:0,z:0},
        frontRightBottom = {x:100,y:0,z:0},

        backLeftTop = {x:0,y:100,z:200},
        backRightTop = {x:100,y:100,z:200},
        backLeftBottom = {x:0,y:0,z:200},
        backRightBottom = {x:100,y:0,z:200},
        walls : [
            {
                name : 'front',
                corners : [frontLeftTop,frontRightTop,frontLeftBottom,frontRightBottom],
                display: 'none'
            },{
                name : 'back',
                corners : [backLeftTop,backRightTop,backLeftBottom,backRightBottom]
            },{
                name : 'left',
                corners : [frontLeftTop,backLeftTop,backLeftBottom,frontLeftBottom],
                display: ''
            },{
                name : 'right',
                corners : [frontRightTop,backRightTop,backRightBottom,frontRightBottom],
                display: ''
            },{
                name : 'top',
                corners : [frontLeftTop,backLeftTop,backLeftBottom,frontLeftBottom],
                display: ''
            },{
                name : 'bottom',
                corners : [frontLeftBottom,backLeftBottom,backRightBottom,frontRightBottom],
                display: ''
            }
        ]
    }

})