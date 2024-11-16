<!-- <g fill="rgb(62, 174, 243,0)" stroke="rgb(62, 174, 243,1)" stroke-width="2">
                <circle @mouseleave="poly.ab.hover=false" v-show="poly.ab.hover" :cx="poly.a.x+(poly.b.x-poly.a.x)/2" :cy="poly.ab.y" r="9" />
                <circle @mouseleave="poly.bc.hover=false" v-show="poly.bc.hover" :cx="poly.b.x+(poly.c.x-poly.b.x)/2" :cy="poly.bc.y" r="9" />
                <circle @mouseleave="poly.cd.hover=false" v-show="poly.cd.hover" :cx="poly.c.x+(poly.d.x-poly.c.x)/2" :cy="poly.cd.y" r="9" />
            </g>

            <g fill="rgb(62, 174, 243,1)">
                <circle @mouseover="poly.ab.hover=true" :cx="poly.a.x+(poly.b.x-poly.a.x)/2" :cy="poly.ab.y" r="3" />
                <circle @mouseover="poly.bc.hover=true" :cx="poly.b.x+(poly.c.x-poly.b.x)/2" :cy="poly.bc.y" r="3" />
                <circle @mouseover="poly.cd.hover=true" :cx="poly.c.x+(poly.d.x-poly.c.x)/2" :cy="poly.cd.y" r="3" />
            </g>      -->

            <!-- dots -->
            <!-- <g stroke="rgb(62, 174, 243,1)" stroke-width="2" fill="rgb(62, 174, 243,0.5)">
                <circle :cx="poly.a.x" :cy="poly.a.y" r="20" @mouseleave="this.poly.a.hover=false" v-show="this.poly.a.hover" fill="rgb(62, 174, 243,0)" />
                <circle :cx="poly.b.x" :cy="poly.b.y" r="20" @mouseleave="this.poly.b.hover=false" v-show="this.poly.b.hover" fill="rgb(62, 174, 243,0)" />
                <circle :cx="poly.c.x" :cy="poly.c.y" r="20" @mouseleave="this.poly.c.hover=false" v-show="this.poly.c.hover" fill="rgb(62, 174, 243,0)"  />
                <circle :cx="poly.d.x" :cy="poly.d.y" r="20" @mouseleave="this.poly.d.hover=false" v-show="this.poly.d.hover" fill="rgb(62, 174, 243,0)"  />
                
                <circle :cx="poly.a.x" :cy="poly.a.y" r="5"  @mouseover="this.poly.a.hover=true" @mousedown="drag.start = true;drag.id = 'delay'" />
                <circle :cx="poly.b.x" :cy="poly.b.y" r="5"  @mouseover="this.poly.b.hover=true" @mousedown="drag.start = true;drag.id = 'attack'"/>
                <circle :cx="poly.c.x" :cy="poly.c.y" r="5"  @mouseover="this.poly.c.hover=true" @mousedown="drag.start = true;drag.id = 'decaysustain'"/>
                <circle :cx="poly.d.x" :cy="height"   r="5"  @mouseover="this.poly.d.hover=true" @mousedown="drag.start = true;drag.id = 'release'"/>
            </g> -->