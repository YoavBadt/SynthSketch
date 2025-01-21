import { reactive } from 'vue'
import WebRenderer from '@elemaudio/web-renderer';
import { el } from '@elemaudio/core';

import { getOsc } from '../audio/elementaryEngine.js'


export const store = reactive({
    
    keyPlay : '',
    globalMouseDown : false,
    
    gridSize : 16,
    init : {
        core : null,
        ctx : null,
        setup : false
    },
    synth : {
        NUM_VOICES : 3,
        voices : {
            state : [],
            activeVoices : {},
            currentVoice : 0
        }
          
        
    },
    oscilators : {  
        osc1 : {
            name : 'osc1',
            mode : 'square',
            level : 0.5,
            levelRef : null,
            setLevelRef : null,
            pan : 0.5,
            panRef : null,
            setPanRef : null,
            trans : 12,
            tune : 0
        },
        osc2 : {
            name : 'osc2',
            mode : 'triangle',
            level : 0.5,
            levelRef : null,
            setLevelRef : null,
            pan : 0.5,
            panRef : null,
            setPanRef : null,
            trans : 12,
            tune : 0
        }
    },
    filters: {
        filter1 : {
            name : 'filter1',
            mode : "lowpass",
            modeRef:null,
            setModeRef : null,
            cutoff : 50,
            cutRef : null,
            setCutRef : null,
            cutMin: 0,
            cutMax:100,
            resonance : 70,
            rezRef: null,
            setRezRef:null,
            resMin: 0,
            resMax: 100,
            mix : 0,
            mixMin : 0,
            mixMax: 100,
            mixRef : null,
            setMixRef : null
        },
        filter2 : {
            name : 'filter2',
            mode : "highpass",
            modeRef:null,
            setModeRef : null,
            cutoff : 20,
            cutRef : null,
            setCutRef : null,
            cutMin: 0,
            cutMax:100,
            resonance : 100,
            rezRef: null,
            setRezRef:null,
            resMin: 0,
            resMax: 100,
            mix : 0,
            mixMin : 0,
            mixMax: 100,
            mixRef : null,
            setMixRef : null
        },
    },
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
        let numVoices = 5
        for(let i = 0;i < numVoices;i++){
            let [gateRef, setGateRef] = this.init.core.createRef("const", {value: 0}, [])
            let [freqRef, setFreqRef] = this.init.core.createRef("const", {value: 440}, [])
            this.synth.voices.state.push(
                {
                    gate: gateRef,
                    setGateRef : setGateRef, 
                    freq: freqRef,
                    setFreqRef : setFreqRef, 
                    note: null,
                    tc: 0.5,
                    key: `v${i+1}`
                })
            
        }

        //oscilators
        Object.keys(this.oscilators).forEach((n)=>{

            let newPan = mapper(this.oscilators[n].pan,0,1,-1,1)

            let [levelRef, setLevelRef] = this.init.core.createRef("const", {value: this.oscilators[n].level}, [])
            let [panRef, setPanRef] = this.init.core.createRef("const", {value: newPan}, []) 
            this.oscilators[n].levelRef = levelRef
            this.oscilators[n].setLevelRef = setLevelRef
            this.oscilators[n].panRef = panRef
            this.oscilators[n].setPanRef = setPanRef      
        })



        //setsup refs for only the first envelope!
        Object.keys(this.env1.adsr).forEach((n)=> {
            let [ref, setRef] = this.init.core.createRef("const", {value: this.env1.adsr[n].value}, [])
            this.env1.adsr[n].ref =  ref   
            this.env1.adsr[n].setRef = setRef
          
          });
        
        //filters setup
        for(let i=1;i<3;i++){
            let [modeRef, setModeRef] = this.init.core.createRef("const", {value: this.filters['filter'+i].mode}, [])  
            this.filters['filter'+i].modeRef = modeRef
            this.filters['filter'+i].setModeRef = setModeRef  

            let initCutoff = mapper(this.filters['filter'+i].cutoff,0,100,20,10000); //this is needs to be investigates!!!

            let [cutRef, setCutRef] = this.init.core.createRef("const", {value: initCutoff}, [])  
            this.filters['filter'+i].cutRef = cutRef
            this.filters['filter'+i].setCutRef = setCutRef
            
            let initRezo = this.filters['filter'+i].resonance / 10; //so does this!!!

            let [rezRef, setRezRef] = this.init.core.createRef("const", {value: initRezo}, [])  
            this.filters['filter'+i].rezRef = rezRef
            this.filters['filter'+i].setRezRef = setRezRef 

            let initMix = this.filters['filter'+i].mix / 100
            let [mixRef, setMixRef] = this.init.core.createRef("const", {value: initMix}, [])  
            this.filters['filter'+i].mixRef = mixRef
            this.filters['filter'+i].setMixRef = setMixRef   
        }  
        
        
        this.render()
        this.init.setup ? this.init.setup++ : this.init.setup = 1
    },
    render(){

        let myrender = this.synth.voices.state.map( (voice) => this.synthVoice(voice) )

        // this.init.core.render(
        //     this.synthVoice(this.synth.voices.state[0]).left,
        //     this.synthVoice(this.synth.voices.state[0]).right
        // )

        this.init.core.render( 
            el.add( ...this.synth.voices.state.map( (voice) => this.synthVoice(voice).left ) ),
            el.add( ...this.synth.voices.state.map( (voice) => this.synthVoice(voice).right ) ) 
            
        )
    },
    synthVoice(voice){

            // let gate = el.const({ key: `${voice.key}:gate`, value: voice.gate })
            // let freq = el.const({ key: `${voice.key}:freq`, value: voice.freq })
            

            let a = this.env1.adsr.attack.ref
            let d = this.env1.adsr.decay.ref
            let s = this.env1.adsr.sustain.ref
            let r = this.env1.adsr.release.ref
            
            let Osc1_signal =  el.mul(
                el.adsr(a,d,s,r,voice.gate),
                getOsc(voice.freq,this.oscilators.osc1.mode),
              ) 
            
            let levelRef1 = this.oscilators.osc1.levelRef
            let panRef1 = this.oscilators.osc1.panRef

            let osc1_stereo = { 
                left:   el.mul( el.sub(1,panRef1 ) , el.mul( el.div(levelRef1,2), Osc1_signal)  ), 
                right:  el.mul( el.add(1,panRef1 ) , el.mul( el.div(levelRef1,2), Osc1_signal)  )
            }

            //oscilator 2
            let Osc2_signal = el.mul(
                el.adsr(a,d,s,r,voice.gate),
                getOsc(voice.freq,this.oscilators.osc2.mode),
            ) 

            let levelRef2 = this.oscilators.osc2.levelRef
            let panRef2 = this.oscilators.osc2.panRef

            let osc2_stereo = { 
                left:   el.mul( el.sub(1,panRef2 ) , el.mul( el.div(levelRef2,2), Osc2_signal)  ), 
                right:  el.mul( el.add(1,panRef2) , el.mul( el.div(levelRef2,2), Osc2_signal)  )
            }

            let signal = {
                left:  el.div( el.add(osc1_stereo.left, osc2_stereo.left),2) ,
                right: el.div( el.add(osc1_stereo.right, osc2_stereo.right),2)
            }
            

            let mode1      = this.filters.filter1.mode
            let cutoffRef1 = this.filters.filter1.cutRef
            let rezoRef1   = this.filters.filter1.rezRef
            let mixRef1    = this.filters.filter1.mixRef

            let filterSignal1 =  {
                left: el.svf( {mode : mode1}, cutoffRef1, rezoRef1, signal.left) ,
                right: el.svf( {mode : mode1}, cutoffRef1, rezoRef1, signal.right)
            }
               
            let mixed1 = {
                left:   el.add(el.mul(el.sub(1, mixRef1), signal.left),el.mul(mixRef1, filterSignal1.left)) ,    
                right : el.add(el.mul(el.sub(1, mixRef1), signal.right),el.mul(mixRef1, filterSignal1.right))
            }
            

            let mode2      = this.filters.filter2.mode
            let cutoffRef2 = this.filters.filter2.cutRef
            let rezoRef2   = this.filters.filter2.rezRef
            let mixRef2    = this.filters.filter2.mixRef

            let filterSignal2 = {
                left: el.svf( {mode : mode2}, cutoffRef2, rezoRef2, signal.left),
                right: el.svf( {mode : mode2}, cutoffRef2, rezoRef2, signal.right)
            }
            

            let mixed2 = {
                left: el.add(el.mul(el.sub(1, mixRef2), signal.left),el.mul(mixRef2, filterSignal2.left)),
                right: el.add(el.mul(el.sub(1, mixRef2), signal.right),el.mul(mixRef2, filterSignal2.right))
            }
            


            // let filtered = getFilter( el.mul(
            //     getENV(voice.gate,this.env1.adsr),
            //     getOsc(voice.freq,this.osc1.type)
            //     ) 
            // )

            let bothMixed = {
                left: el.add(mixed1.left,mixed2.left),
                right: el.add(mixed1.right,mixed2.right)
            }
            
        
            return bothMixed
          
    },
    noteEvent(event,frequency,note,octave){
        if(this.init.setup){

            if(event === 'noteOn'){


                if(this.synth.voices.currentVoice < this.synth.voices.state.length){

                    let currentvoice = this.synth.voices.state[this.synth.voices.currentVoice]
                    currentvoice.setFreqRef({value: frequency})
                    currentvoice.setGateRef({value: 1})
                    currentvoice.note = note

                    this.synth.voices.activeVoices[note] = currentvoice

                    this.synth.voices.currentVoice += 1
                }
                
            }else if(event === 'noteOff'){
                
                if(Object.keys(this.synth.voices.activeVoices).includes(note)){
                    let currentvoice = this.synth.voices.activeVoices[note]
                    currentvoice.setGateRef({value: 0})
                    delete this.synth.voices.activeVoices[note]
                
                    // let index = this.synth.voices.currentVoice
                    // index - 1 < 0 ? index = 0 : index -= 1
                    this.synth.voices.currentVoice = Object.keys(this.synth.voices.activeVoices).length 
                }
                
                
                // this.synth.voices.state[0].setGateRef({value: 0})
            }
        }
    },
    updateLFO1(payload){
        this.lfo1 = payload
    },
    updateOsc(oscilator,name,value){
        
        switch(name){
            case 'mode' :
                this.oscilators[oscilator].mode = value
                this.synthSetup()
                break;
            case 'level' :
                this.oscilators[oscilator].level = value
                this.oscilators[oscilator].setLevelRef({value: value})
                break;
            case 'pan' :
                this.oscilators[oscilator].pan = value
                value = mapper(value,0,1,-1,1)
                
                this.oscilators[oscilator].setPanRef({value: value})
                
                break;
            case 'trans' :
                break;
            case 'detune' :
                break;
            
        }
    },

    updateEnv1(name,value) {
        this.env1.adsr[name].value = value
        name !== 'delay' ?  this.env1.adsr[name].setRef({value: value}) : null
       
    },
    updateKeyPlay(payload){
        this.keyboard.keyPlay = payload
    },
    updateFilter(filter,payload,name){
        
        switch(name){
            case 'mode':
                this.filters[filter].mode = payload
                this.synthSetup()
                break;
            case 'cutoff':
                this.filters[filter].cutoff = payload
                let newCutoff = mapper(payload,0,100,20,10000);
                this.filters[filter].setCutRef({value: newCutoff})
                break;
            case 'resonance':
                this.filters[filter].resonance = payload
                let newRezo = payload / 10;
                this.filters[filter].setRezRef({value: newRezo})
                break;
            case 'mix' :
                this.filters[filter].mix = payload
                let newMix = payload / 100;
                this.filters[filter].setMixRef({value: newMix})
            default : 
            break;
        }
        

        

        
        // changeRezo(payload.resonance)
    }

})


function mapper(value, x1, y1, x2, y2){
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}