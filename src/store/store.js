import { reactive } from 'vue'


export const store = reactive({
    
    keyPlay : '',
    synth : null,
    osc1 : {
        type : 'sine',
        level : 0.5,
        pan : 0,
        trans : 12,
        tune : 0
    },
    osc2 : {
        type : 'sine',
        level : 1,
        pan : 0,
        trans : 12,
        tune : 0
    },
    filter1 : {
        type : "highpass",
        cutoff : 15,
        cutMin: -52,
        cutMax:72,
        resonance : 50,
        resMin: 0,
        resMax: 100
    },
    filter2 :{},
    keyboard : {
        octave : null,
        keyPlay : null,
    },
    env1 : {
        adsr : {
            delay : {
                name:'delay',
                value : 0,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },
              attack: {
                name:'attack',
                value : 1,
                curve :50,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },
              decay : {
                name:'decay',
                value : 0.5,
                curve :50,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },  
              sustain:{
                name:'sustain',
                value :0.5,
                minmax : { min: 0,max: 1},
                curve: false,
                step: 0.01,
                show : true,
                soft : 2
              },
              release:{
                name: 'release',
                value : 1,
                curve : 50,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              }
        }
    },
    env2 :{},
    lfo1 : {
        name : 'Lfo1',
        selected : true,
        gridX:4,
        gridY:2,
        type : 'sine', //un-needed
        types : ['sine','triangle','sawtooth','square'], //un-needed
        LFOtypes: [
            {
                name : 'sine',
                curve : true,
                selected : true,
                init : [{x:0,y:'height'},{x:'width/2',y:0},{x:'width',y:'height'}],

            },
            {
                name : 'triangle',
                curve : false,
                selected : false,
                init : [{x:0,y:'height'},{x:'width/2',y:0},{x:'width',y:'height'}],

            },
            {
                name : 'sawtooth',
                curve : true,
                selected : false,
                init : [{x:0,y:'height'},{x:0,y:0},{x:'width',y:'height'}],

            },
            {
                name : 'square',
                curve : false,
                selected : false,
                init : [{x:0,y:'height'},{x:0,y:0},{x:'width/2',y:0},{x:'width/2',y:'height'},{x:'width',y:'height'}],

            }
        ]
    },
    lfo2 : {},
    updateLFO1(payload){
        this.lfo1 = payload
    },
    updateOsc1(payload){
        this.osc1 = payload
    },
    updateOsc2(payload){
        this.osc2 = payload
    },
    updateSynth(payload){
        this.synth = payload
    },
    updateEnv1(payload) {
        this.env1.adsr = payload
    },
    updateKeyPlay(payload){
        this.keyboard.keyPlay = payload
    },
    updateFilter1(payload){
        this.Filter1 = payload
    }

})