<template >
    <div class="threedee">
        <div class="three_menu">
            <input type="range" v-model="movePoint.x" min="0" max="10" step="0.1"/>
            <input type="range" v-model="movePoint.y" min="0" max="10" step="0.1"/>
            <input type="range" v-model="movePoint.z" min="0" max="20" step="0.1"/>
            <br/>
            x : {{ movePoint.x }},<br/> y : {{ movePoint.y }},<br/> z:{{ movePoint.z }}
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
            <g v-for="(tile,i) in tiles">
                <line v-for="facet in tile" :x1="facet.x1" :y1="facet.y1" :x2="facet.x2" :y2="facet.y2" stroke="var(--viz-high-soft)"/>
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
            tiles : [],
            points : [], 
            lines : [],
            movePoint:{
                x:1,y:2,z:3
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
                    i > div/2 ? log = end * (log3 / log2) : log = end * log1 / log2
                    
                    break;
                case 'height':
                    i > div/2 ? log = this.height - end * (log3 / log2) : log = end * log1 / log2
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
            
            facet.push({
                x1:this.getPos({x:f,y:0,z:20}).graph_x,
                y1:this.getPos({x:f,y:0,z:20}).graph_y,
                x2:this.getPos({x:f,y:0,z:0}).graph_x,
                y2:this.getPos({x:f,y:0,z:0}).graph_y,
            })
        }
        for(let f=0;f<11;f++){
            facet.push({
                x1:this.getPos({x:f,y:10,z:20}).graph_x,
                y1:this.getPos({x:f,y:10,z:20}).graph_y,
                x2:this.getPos({x:f,y:10,z:0}).graph_x,
                y2:this.getPos({x:f,y:10,z:0}).graph_y,
                    
            })
        }
        for(let f=0;f<11;f++){
            facet.push({
                x1:this.getPos({x:10,y:f,z:20}).graph_x,
                y1:this.getPos({x:10,y:f,z:20}).graph_y,
                x2:this.getPos({x:10,y:f,z:0}).graph_x,
                y2:this.getPos({x:10,y:f,z:0}).graph_y,
                    
            })
        }
        for(let f=0;f<11;f++){
            facet.push({
                x1:this.getPos({x:0,y:f,z:20}).graph_x,
                y1:this.getPos({x:0,y:f,z:20}).graph_y,
                x2:this.getPos({x:0,y:f,z:0}).graph_x,
                y2:this.getPos({x:0,y:f,z:0}).graph_y,
                    
            })
        }    
            this.tiles.push(facet)
        
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