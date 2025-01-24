<template >
    <div class="threedee">
        <div class="three_menu">
            <input type="range" v-model="movePoint.x" min="0" max="10" step="0.1"/>
            <input type="range" v-model="movePoint.y" min="0" max="10" step="0.1"/>
            <br/>
            <Knob size="big" name="z" :value="movePoint.z1" @update:value="changeZ" :min="0" :max="100" :step="1"/>
            x : {{ movePoint.x }},<br/> y : {{ movePoint.y }},<br/> z:{{ movePoint.z }}
            <!-- <div v-for="wall in room.walls">{{ wall.corners }}</div> -->
        </div>
        <svg  :width="width" :height="height">
            <rect width="100%" height="100%" stroke="rgba(62, 174, 243,0.5)" fill="var(--viz-back)" stroke-width="2"/>

            <g class="t_graph">
                <rect :x="width/2-backwall/2" :y="height/2-backwall/2" :width="backwall" :height="backwall" fill="none" stroke="var(--viz-high-soft)"/>
                <g v-for="(n,i) in 11">
                    <line class="t_graph_x"  :x1="(width/2-40)+(i*(80/graph))" :x2="(width/2-40)+(i*(80/graph))" :y1="height/2-40" :y2="height/2+40" stroke="var(--viz-high-soft)"/>
                    <line class="t_graph_x"  :x1="(height/2-40)" :x2="(height/2+40)" :y1="(height/2-40)+(i*(80/graph))" :y2="(height/2-40)+(i*(80/graph))" stroke="var(--viz-high-soft)"/>
                </g>
            </g>
            
            <line v-for="(dot,i) in room_dots" :x1="dot.graph_x" :x2="width-dot.graph_x" :y1="dot.graph_y" :y2="dot.graph_y"  stroke="var(--viz-high-soft)"/>
            <line v-for="(dot,i) in room_dots" :y1="dot.graph_x" :y2="height-dot.graph_x" :x1="dot.graph_y" :x2="dot.graph_y"  stroke="var(--viz-high-soft)"/>
            
            <g v-for="facet in tiles">
                <line  :x1="facet.x1" :y1="facet.y1" :x2="facet.x2" :y2="facet.y2" stroke="var(--viz-high-soft)"/>
            </g>    



            <circle :cx="getPos(movePoint).graph_x" :cy="getPos(movePoint).graph_y" r="2" fill="var(--viz-back)"  stroke="var(--viz-high)"></circle> 
            <g v-for="(line) in axis(movePoint)">
                <line :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" stroke="var(--highlight-soft)" />
            </g>

            <!-- dode trial -->
            <!-- <g v-for="(dot,i) in points">
                <circle :cx="dot.x" :cy="dot.y" :r="dot.size" :fill="dot.color" :display="dot.display" stroke="black"></circle>
                   
            </g>
            <line v-for="line in lines" :x1="line.from.x" :x2="line.to.x" :y1="line.from.y" :y2="line.to.y" stroke="rgba(62, 174, 243,1)" stroke-width="1"/>   -->

            <g v-for="wall in room.walls">
                
                <circle v-for="tile in wall.tiles" :display="wall.display" :cx="tile.graph_x" :cy="tile.graph_y" fill="var(--viz-high-soft)" r="2"></circle>
            </g>



        </svg>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            width :800,
            height :800,
            graph : 10,
            divisions: 40,
            backwall : 80,
            room : [],
            tiles : [],
            points : [], 
            lines : [],
            movePoint:{
                x:1,y:2,z:3,z1:30
            }
        }
    },
    methods : {
        getPos(point){
            
            let x = point.x
            let y = point.y
            let z = point.z

            let width = this.width
            let height = this.height

            let graph_x = width/10 * x
            let graph_y = height - height/10 * y

            if(z>0){
                let log_x = this.getLog('width',z)

                graph_x = graph_x + log_x - (log_x/5 * x)
                graph_y = graph_y - log_x + (log_x/5 * y)
            }


            return {graph_x,graph_y}
        },
        getLog(dimention,i){
            let back = this.backwall / 2
            let div = this.divisions
            let log
            let end = (this.width/2-back)
            let log1 = Math.log(i + 1)

            let log2 = Math.log(div/2+1)

            let log3 = Math.log(i - (div/2-1) )

            switch(dimention){
                case 'width':
                    i > div/2 ? log = end * (log3 / log2) : log = end * (log1 / log2)
                    
                    break;
                case 'height':
                    i > div/2 ? log = this.height - end * (log3 / log2) : log = end * (log1 / log2)
                    break;
                default:
                    break;
            }
            
            return log
        },
        axis(point){
            let x = point.x
            let y = point.y
            let z = point.z
            let axis = {
                horizontal : {
                    x1 : this.getPos({x:0,y,z}).graph_x,
                    x2 : this.getPos({x:10,y,z}).graph_x,
                    y1 : this.getPos({x,y,z}).graph_y,
                    y2 : this.getPos({x,y,z}).graph_y,
                },
                vertical : {
                    x1 : this.getPos({x,y,z}).graph_x,
                    x2 : this.getPos({x,y,z}).graph_x,
                    y1 : this.getPos({x,y:0,z}).graph_y,
                    y2 : this.getPos({x,y:10,z}).graph_y,
                },
                depth : {
                    x1 : this.getPos({x,y,z:20}).graph_x,
                    y1 : this.getPos({x,y,z:20}).graph_y,
                    x2 : this.getPos({x,y,z:0}).graph_x,
                    y2 : this.getPos({x,y,z:0}).graph_y,
                }
            }
            return axis
        },
        changeZ(name,value){
            
            this.movePoint.z = this.mapper(value,0,100,0,20)
            this.movePoint.z1 = value
            // console.log(value)
            // let old = this.movePoint.z
            // let newValue 

            // if(old < value){
            //     newValue = old + 0.1
            //     newValue = Math.trunc(newValue * 10) / 10 
            // }else{
            //     newValue = old - 0.1
            //     newValue = Math.trunc(newValue * 10) / 10
            // }
            // newValue < 0 ? newValue = 0 : null
            // newValue > 20 ? newValue = 20 : null
            
            // this.movePoint.z = newValue

        },
        generateSphericalCoordinates(numPoints, radius) {

            const points = []
            let thetaOffset = 0 //Math.PI / 1
            let phiOffset = 0//Math.PI / 1
            
            points.push({ theta: 0, phi: 0, x: 0, y: 0, z: 0 ,center:true, cIndex : 0});
            
            const goldenRatio = (1 + Math.sqrt(5)) / 2;

            for (let i = 0; i < numPoints; i++) {

                // Calculate latitude (theta) and longitude (phi)
                const theta =  Math.PI * (i / numPoints - 0.5) + thetaOffset;  // Latitude (polar angle) + thetaOffset
                const phi = 2 * Math.PI * goldenRatio * i + phiOffset;  // Longitude (azimuthal angle)

                // Convert to Cartesian coordinates (optional, for actual position)
                const x = radius * Math.cos(theta) * Math.cos(phi);
                const y = radius * Math.cos(theta) * Math.sin(phi);
                const z = radius * Math.sin(theta);
                const cIndex = i
                // Store both spherical angles and Cartesian position (optional)
                points.push({ theta, phi, x, y, z ,cIndex});
            }

            return points;
        },
        mapper(value, x1, y1, x2, y2){
            return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
        },
        euclideanDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
        },
        findNearestNeighbors(points) {
            const lines = [];

            // Loop through each point (excluding the center point)
            for (let i = 1; i < points.length; i++) {

                const currentPoint = points[i];
        
                // Find the closest two points (neighbors)
                let nearestNeighbors = [];
                let minDistance1 = Infinity, minDistance2 = Infinity;
                let closestPoint1 = null, closestPoint2 = null;

                // Compare current point with all other points
                for (let j = 1; j < points.length; j++) {

                if (i !== j) {  

                    const distance = this.euclideanDistance(currentPoint, points[j]);

                    if (distance < minDistance1) {

                    // Update nearest neighbor 1
                    minDistance2 = minDistance1;
                    closestPoint2 = closestPoint1;
                    minDistance1 = distance;
                    closestPoint1 = points[j];

                    } else if (distance < minDistance2) {
                    // Update nearest neighbor 2
                        minDistance2 = distance;
                        closestPoint2 = points[j];
                    }
                }
            }

        // Add lines between the current point and its two nearest neighbors
        lines.push({ from: currentPoint, to: closestPoint1 });
        lines.push({ from: currentPoint, to: closestPoint2 });
        }

        return lines;
        },
        getAngle(angle) {
            let radius = this.width * 0.71
            const radians = (angle * Math.PI) / 180; // Convert angle from degrees to radians
            const x = radius * Math.cos(radians) + 400;
            const y = radius * Math.sin(radians) + 400;
            return { x, y };
        },
        
        
    },
    computed:{
        
        graph_dots(){
            let graph_dots = []
            let width = this.width
            let height = this.height
            let graph = this.graph
            let center = {x: width/2, y: height/2}

            graph_dots.push(
                {x:0,y:0},
                {x: 1,y: 1},
                {x: -8,y: -3},
                {x: 1,y: -1},
                {x: -1,y: 1},
            )
            
            graph_dots.forEach((e)=>{
                e.x = center.x + (e.x * width/graph)
                e.y = center.y + (e.y * height/graph)
            })

            return graph_dots
        },
        room_dots(){
            let width = this.width
            let height = this.height
            let back = this.backwall / 2
            let div = this.divisions
            
            let room_dots = []

            for(let i=0;i<div;i+=1){
                let dot = {}   

                dot.graph_x = this.getLog('width',i) 
                dot.graph_y = this.getLog('height',i)
                
                room_dots.push(dot)
            
                
            }

            return room_dots

        }
    },
    mounted(){
        let facet = []
        for(let f=0;f<11;f++){
            let obj = {}
            for(let a=0;a<4;a++){
                switch(a){
                    case 0:
                        obj.x = f
                        obj.y = 0
                    break;
                    case 1:
                        obj.x = f
                        obj.y = 10
                    break;
                    case 2:
                        obj.x = 10
                        obj.y = f
                    break;
                    case 3:
                        obj.x = 0
                        obj.y = f
                    break;
                    default:
                    break;
                }
            
            obj.z = 20
            let obj2 = {}
            obj2.x = obj.x
            obj2.y = obj.y
            obj2.z = 0
            facet.push({
                x1:this.getPos(obj).graph_x,
                y1:this.getPos(obj).graph_y,
                x2:this.getPos(obj2).graph_x,
                y2:this.getPos(obj2).graph_y,
            })
        }
        
        }
        this.tiles.push(...facet)
        
        let room = {
            width : 100,
            height : 100,
            depth : 200,
            walls : [
                {
                    name : 'front',
                    corners : [{x:0,y:100,z:0},{x:100,y:100,z:0},{x:100,y:0,z:0},{x:0,y:0,z:0}],
                    display: 'none'
                },{
                    name : 'back',
                    corners : [{x:0,y:100,z:200},{x:100,y:100,z:200},{x:100,y:0,z:200},{x:0,y:0,z:200}]
                },{
                    name : 'left',
                    corners : [{x:0,y:100,z:0},{x:0,y:100,z:200},{x:0,y:0,z:200},{x:0,y:0,z:0}],
                    display: ''
                },{
                    name : 'right',
                    corners : [{x:100,y:100,z:0},{x:100,y:100,z:200},{x:100,y:0,z:200},{x:100,y:0,z:0}],
                    display: ''
                },{
                    name : 'top',
                    corners : [{x:0,y:100,z:0},{x:0,y:100,z:200},{x:0,y:0,z:200},{x:0,y:0,z:0}],
                    display: ''
                },{
                    name : 'bottom',
                    corners : [{x:0,y:0,z:0},{x:0,y:0,z:200},{x:100,y:0,z:200},{x:100,y:0,z:0}],
                    display: ''
                }
            ] 
        }

        room.walls.forEach((wall)=>{
            let tiles = []
                
            wall.corners.forEach((corner)=>{
                corner.graph_x = null
                corner.graph_y = null
                let obj = {
                    x : corner.x,
                    y : corner.y,
                    z : corner.z,
                    graph_x :corner.graph_x,
                    graph_y :corner.graph_y
                }
                tiles.push(obj)
            })
            
            
            let div_1 = 20
            let div_2 = 10
            wall.name == 'back' || wall.name === 'front' ? div_1 = 10 : null
            
                for(let dim_1 =0; dim_1<=div_1; dim_1++){
                        for(let dim_2=0;dim_2<=div_2; dim_2++){

                            let d_x 
                            let d_y = 100/10 * dim_2
                            let d_z = 200/20 * dim_1
                            switch(wall.name){
                                case 'back':
                                    d_x = 100/10 * dim_1
                                    d_z = 200
                                    break;
                                case 'front':
                                    d_x = 100/10 * dim_1
                                    d_z = 0
                                    break;
                                case 'bottom':
                                    d_x = 100/10 * dim_2
                                    d_y = 0
                                    break;
                                case 'top':
                                    d_x = 100/10 * dim_2
                                    d_y = 100
                                    break;
                                case 'left':
                                    d_x = 0
                                    break;
                                case 'right':
                                    d_x = 100
                                    break;
                                default:
                                    break;
                            }

                            tiles.push({
                                x : d_x,
                                y : d_y,
                                z : d_z,
                                graph_x : null,
                                graph_y : null
                            })
                        }
                    

            }

            wall.tiles = tiles
            

        })

        room.walls.forEach((wall)=>{
            wall.tiles.forEach((tile)=>{
                let obj={
                    x : this.mapper(tile.x,0,100,0,10),
                    y : this.mapper(tile.y,0,100,0,10),
                    z : this.mapper(tile.z,0,200,0,20)

                }
                
                tile.graph_x = this.getPos(obj).graph_x
                tile.graph_y = this.getPos(obj).graph_y
            })
        })

        this.room = room
        

    }

}
</script>

<style >
    .threedee{
        position:absolute;
        z-index:10;
        background:white;
        width:1000px;
        height:800px;
        left:25%;
        display:grid;
        grid-template-columns: 200px 1fr;
        overflow:hidden;
        outline:1px solid grey;
        border-radius:5px;

    }
    .three_menu{
        background: var(--back)
    }
</style>