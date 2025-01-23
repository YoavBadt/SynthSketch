<template >
    <div class="threedee">
        <!-- <div v-for="(dot,i) in points">{{dot.x}}</div> -->
        <svg class="osc_svg" width="100%" height="100%">
            <rect width="100%" height="100%" stroke="rgba(62, 174, 243,0.5)" fill="rgba(15,10,45,1)" stroke-width="2"/>

            <g v-for="(dot,i) in points">
                <circle :cx="dot.x" :cy="dot.y" :r="dot.size" :fill="dot.color" :display="dot.display" stroke="black"></circle>
                   
            </g>
            <line v-for="line in lines" :x1="line.from.x" :x2="line.to.x" :y1="line.from.y" :y2="line.to.y" stroke="rgba(62, 174, 243,1)" stroke-width="1"/>  

        </svg>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            points : [],
            lines : [],
            width :800,
            height :800
        }
    },
    methods : {
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
        drawlines(points){
            const lines = []
            
            let something = 11
            let something2 = 8
            lines.push({ from: points.find(e => e.cIndex == something), to: points.find(e => e.cIndex == something2) })

            something = 8
            something2 = 5
            lines.push({ from: points.find(e => e.cIndex == something), to: points.find(e => e.cIndex == something2) })

            something = 10
            something2 = 17
            // lines.push({ from: points.find(e => e.cIndex == something), to: points.find(e => e.cIndex == something2) })
            // for (let i = 1; i < points.length; i++) {
            //     const currentPoint = points[i];

            //     // Neighbors: the next and previous points (with modular arithmetic for wrapping)
            //     // const prevPoint = points[(i - 1 + points.length) % points.length];
            //     // const nextPoint = points[(i + 1) % points.length];

            //     const prevPoint = points.find(e => e.cIndex  == 5);
            //     const nextPoint = points.find(e => e.cIndex  == 5);

                    
            //     // Draw line from current point to previous neighbor
            //     lines.push({ from: currentPoint, to: prevPoint });
                
            //     // Draw line from current point to next neighbor
            //     lines.push({ from: currentPoint, to: nextPoint });
            // }

            return lines;
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
        generateGrid(){
            let points = []

            for(let x = -5;x<=5;x+=1){
                for(let y = -5;y<=5;y+=1){
                    for(let z = -5;z<=5;z+=1){
                        points.push(
                        {
                            x: x,
                            y: y,
                            z: z,
                            display: ''
                        }
                        )
                    }
                        
                    
                }
                
            }

            return points
        }
    },
    mounted(){
        // this.points = this.generateSphericalCoordinates(240, 100)
        this.points = this.generateGrid()
        // this.lines = this.drawlines(this.points)
        // this.lines = this.findNearestNeighbors(this.points)

        this.points.forEach((e,i)=>{

            // e.front = e.z >= 0 ? true : false;
            // let color = this.mapper(e.z,4,16,0,255)
            e.color = 'blue'
            if(e.z < 0 ){ 
                // e.display= 'none'
                e.y += -10
                e.color = 'red'
            }
            if(e.y > -5){
                e.display= 'none'
            }
            
            
            
                // e.display= 'none'
                
                // e.color = e.front ? 'blue' : `rgba(${color},${color},${color},1)`
            
            


            e.size = this.mapper(e.z,-5,5,4,16)
            e.x = this.mapper(e.x,-5,5,0,this.width)
            e.y = this.mapper(e.y,5,-5,0,this.height)
            
            
            
        })
        // this.points.sort((a,b) => a.z < b.z ? -1 : 1)
        
    }

}
</script>

<style >
    .threedee{
        position:absolute;
        z-index:10;
        background:white;
        width:800px;
        height:800px;
        left:25%;
    }
</style>