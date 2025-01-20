import { reactive } from 'vue'
import WebRenderer from '@elemaudio/web-renderer';
import { el } from '@elemaudio/core';

import { getOsc } from '../audio/elementaryEngine.js'


export const store = reactive({
    
    keyPlay : '',
    globalMouseDown : false,
    init : {
        core : null,
        ctx : null,
        setup : false
    },
    synth : {
        NUM_VOICES : 3,
        voices : {
            state : [],
            activeVoices : []
        }
          
        
    },
    osc1 : {
        type : 'square',
        level : 0.5,
        levelRef : null,
        setLevelRef : null,
        pan : 0,
        panRef : null,
        setPanRef : null,
        trans : 12,
        tune : 0
    },
    osc2 : {
        type : 'triangle',
        level : 1,
        pan : 0,
        trans : 12,
        tune : 0
    },
    filter1 : {
        mode : "lowpass",
        modeRef:null,
        setModeRef : null,
        cutoff : 50,
        cutRef : null,
        setCutRef : null,
        cutMin: 0,
        cutMax:100,
        resonance : 100,
        rezRef: null,
        setRezRef:null,
        resMin: 0,
        resMax: 100,
        mix : 100,
        mixRef : null,
        setMixRef : null
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
                ref : null,
                setRef : null,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },
              attack: {
                name:'attack',
                value : 0.01,
                ref : null,
                setRef : null,
                curve :50,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },
              decay : {
                name:'decay',
                value : 0.25,
                ref : null,
                setRef : null,
                curve :50,
                minmax : { min: 0,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },  
              sustain:{
                name:'sustain',
                value :0.15,
                ref : null,
                setRef : null,
                minmax : { min: 0,max: 1},
                curve: false,
                step: 0.01,
                show : true,
                soft : 2
              },
              release:{
                name: 'release',
                value : 1,
                ref : null,
                setRef : null,
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
    updateGlobalMouseDown(event){
        
        if(event.type === 'mousedown'){
            this.globalMouseDown = true
        }else if( event.type === 'mouseup'){
            this.globalMouseDown = false
        } 
        
    },
    async init(){
        let ctx 
        let core 

         if (!this.init.ctx || !this.init.core) {
                ctx = new AudioContext();
                core = new WebRenderer();
        
                const node = await core.initialize(ctx, {
                    numberOfInputs: 0,
                    numberOfOutputs: 1,
                    outputChannelCount: [2],
                })
        
                node.connect(ctx.destination);
        
                console.log("Audio system initialized!");
        
                // createRefs()
                // render(voices)
                this.init.ctx = ctx
                this.init.core = core
                this.synthSetup()
            }

    },
    synthSetup(){
        let numVoices = 3
        for(let i = 0;i < numVoices;i++){
            let [gateRef, setGateRef] = this.init.core.createRef("const", {value: 0}, [])
            let [freqRef, setFreqRef] = this.init.core.createRef("const", {value: 440}, [])
            this.synth.voices.state.push(
                {
                    gate: gateRef,
                    setGateRef : setGateRef, 
                    freq: freqRef,
                    note: null,
                    setFreqRef : setFreqRef, 
                    tc: 0.5,
                    key: `v${i+1}`
                })
            
        }

        //setsup refs for only the first envelope!
        Object.keys(this.env1.adsr).forEach((n)=> {
            let [ref, setRef] = this.init.core.createRef("const", {value: this.env1.adsr[n].value}, [])
            this.env1.adsr[n].ref =  ref   
            this.env1.adsr[n].setRef = setRef
          
          });
        
        //sets up refs for both filters but theres is no setter functions for the second one!
        for(let i=1;i<3;i++){
            let [modeRef, setModeRef] = this.init.core.createRef("const", {value: this.filter1.mode}, [])  
            this['filter'+i].modeRef = modeRef
            this['filter'+i].setModeRef = setModeRef  

            let initCutoff = mapper(this.filter1.cutoff,0,100,20,10000);
            let [cutRef, setCutRef] = this.init.core.createRef("const", {value: initCutoff}, [])  
            this['filter'+i].cutRef = cutRef
            this['filter'+i].setCutRef = setCutRef
            
            let initRezo = this.filter1.resonance / 10;
            let [rezRef, setRezRef] = this.init.core.createRef("const", {value: initRezo}, [])  
            this['filter'+i].rezRef = rezRef
            this['filter'+i].setRezRef = setRezRef 
        }  
        
        
        this.render()
        this.init.setup = true
    },
    render(){
        this.init.core.render( el.add( ...this.synth.voices.state.map( (voice) => this.synthVoice(voice) )) )
    },
    synthVoice(voice){

            // let gate = el.const({ key: `${voice.key}:gate`, value: voice.gate })
            // let freq = el.const({ key: `${voice.key}:freq`, value: voice.freq })
            
            let mode = store.filter1.mode
            let cutoffRef = store.filter1.cutRef
            let rezoRef = store.filter1.rezRef

            let a = this.env1.adsr.attack.ref
            let d = this.env1.adsr.decay.ref
            let s = this.env1.adsr.sustain.ref
            let r = this.env1.adsr.release.ref
            
            let signal =  el.mul(
                el.adsr(a,d,s,r,voice.gate),
                getOsc(voice.freq,this.osc1.type),
              ) 

            let filtered = el.svf( {mode : mode}, cutoffRef, rezoRef, signal);


            // let filtered = getFilter( el.mul(
            //     getENV(voice.gate,this.env1.adsr),
            //     getOsc(voice.freq,this.osc1.type)
            //     ) 
            // )
            
            
        
            return filtered
          
    },
    noteEvent(event,frequency,note,octave){
        if(this.init.setup){

            if(event === 'noteOn'){

                this.synth.voices.state[0].setFreqRef({value: frequency})
                this.synth.voices.state[0].setGateRef({value: 1})
                this.synth.voices.state[0].note = note
            }else if(event === 'noteOff'){
                this.synth.voices.state[0].setGateRef({value: 0})
            }
        }
    },
    updateLFO1(payload){
        this.lfo1 = payload
    },
    updateOsc1(name,value){
        console.log(name)
        switch(name){
            case 'mode' :
                break;
            case 'level' :
                this.osc1.level = value
                break;
            case 'pan' :
                this.osc1.pan = value 
                break;
            case 'trans' :
                break;
            case 'detune' :
                break;
            
        }
    },
    updateOsc2(payload){
        this.osc2 = payload
    },
    updateEnv1(name,value) {
        this.env1.adsr[name].value = value
        name !== 'delay' ?  this.env1.adsr[name].setRef({value: value}) : null
       
    },
    updateKeyPlay(payload){
        this.keyboard.keyPlay = payload
    },
    updateFilter1(payload,name){
        
        switch(name){
            case 'mode':
                this.filter1.mode = payload
                break;
            case 'cutoff':
                this.filter1.cutoff = payload
                let newCutoff = mapper(payload,0,100,20,10000);
                this.filter1.setCutRef({value: newCutoff})
                break;
            case 'resonance':
                this.filter1.resonance = payload
                let newRezo = payload / 10;
                this.filter1.setRezRef({value: newRezo})
                break;
            default : 
            break;
        }
        

        

        
        // changeRezo(payload.resonance)
    }

})


function mapper(value, x1, y1, x2, y2){
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}