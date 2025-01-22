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
            level : 50,
            levelRef : null,
            setLevelRef : null,
            pan : 50,
            panRef : null,
            setPanRef : null,
            trans : 12,
            tune : 0,
            unison : {
                mixValue : 100,
                unisonMix : null,
                setUnisonMix : null,
                number : 10,
                numRef : null,
                setNumRef : null,
                detune : 10,
                detuneRef : null,
                setDetuneRef : null,
                wide: 10,
                wideRef : null,
                setWideRef : null
            }
            
        },
        osc2 : {
            name : 'osc2',
            mode : 'triangle',
            level : 0,
            levelRef : null,
            setLevelRef : null,
            pan : 50,
            panRef : null,
            setPanRef : null,
            trans : 12,
            tune : 0,
            unison : {
                mixValue : 50,
                unisonMix : null,
                setUnisonMix : null,
                number : 10,
                numRef : null,
                setNumRef : null,
                detune : 10,
                detuneRef : null,
                setDetuneRef : null,
                wide: 10,
                wideRef : null,
                setWideRef : null
            }
        }
    },
    filters: {
        filter1 : {
            name : 'filter1',
            mode : "lowpass",
            filterRef : null,
            setFilterRef : null,
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
            mix : 100,
            mixMin : 0,
            mixMax: 100,
            mixRef : null,
            setMixRef : null
        },
        filter2 : {
            name : 'filter2',
            mode : "highpass",
            filterRef : null,
            setFilterRef : null,
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
                value : 0,
                ref : null,
                setRef : null,
                curve :50,
                minmax : { min: 0.01,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },
              decay : {
                name:'decay',
                value : 25,
                ref : null,
                setRef : null,
                curve :50,
                minmax : { min: 0.01,max: 2},
                step: 0.01,
                show : true,
                soft : 4
              },  
              sustain:{
                name:'sustain',
                value :15,
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
                value : 10,
                ref : null,
                setRef : null,
                curve : 50,
                minmax : { min: 0.01,max: 2},
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
        this.synth.voices.state = []
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
                    key: `v${i+1}`,
                    unison : []
                })
            
        }

        this.synth.voices.state.forEach((e,i)=>{

            for(let i=-5;i<6;i++){

                let cent = (440 * 1.059) - 440 / 100
                let cents = mapper(i,-5,5,-100,100)
                let detune = 440 - cents 
                let panning = mapper(i,-5,5,-1,1)
                panning = Math.trunc(panning * 100) / 100
                
                let [unisonGate,unisonSetGate]  = this.init.core.createRef("const", {value: 0}, [])
                let [unisonFreq, unisonSetFreq] = this.init.core.createRef("const", {value: detune}, [])
                let [unisonPan,unisonSetPan]    = this.init.core.createRef("const", {value : panning},[])
                
                e.unison.push(
                    {
                        unisonGate : unisonGate,
                        unisonSetGate : unisonSetGate,
                        unisonFreq : unisonFreq,
                        unisonSetFreq : unisonSetFreq,
                        unisonPan : unisonPan,
                        unisonSetPan : unisonSetPan
                    }
                )
            }

            
        })

        //oscilators
        Object.keys(this.oscilators).forEach((n)=>{

            let newPan = mapper(this.oscilators[n].pan,0,100,-1,1)
            let level = mapper(this.oscilators[n].level,0,100,0,1)
            let unisonMixValue = mapper(this.oscilators[n].unison.mixValue,0,100,0,1)

            let [levelRef, setLevelRef] = this.init.core.createRef("const", {value: level}, [])
            let [panRef, setPanRef] = this.init.core.createRef("const", {value: newPan}, [])

            let [unisonMix, setUnisonMix] = this.init.core.createRef("const", {value: unisonMixValue}, [])

            this.oscilators[n].levelRef = levelRef
            this.oscilators[n].setLevelRef = setLevelRef
            this.oscilators[n].panRef = panRef
            this.oscilators[n].setPanRef = setPanRef
            this.oscilators[n].unison.unisonMix = unisonMix
            this.oscilators[n].unison.setUnisonMix = setUnisonMix      
        })



        //setsup refs for only the first envelope!
        Object.keys(this.env1.adsr).forEach((n)=> {

            let envValue = mapper(this.env1.adsr[n].value,0,100,this.env1.adsr[n].minmax.min,this.env1.adsr[n].minmax.max)

            let [ref, setRef] = this.init.core.createRef("const", {value: envValue}, [])
            this.env1.adsr[n].ref =  ref   
            this.env1.adsr[n].setRef = setRef
          
          });
        
        //filters setup
        for(let i=1;i<3;i++){
            // let [modeRef, setModeRef] = el.ref({ key: 'mode', defaultValue: 0 })//this.init.core.createRef("parameter", {value: 0}, [])  
            // this.filters['filter'+i].modeRef = modeRef
            // this.filters['filter'+i].setModeRef = setModeRef  

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
            
            
            // let [filterRef, setFilterRef] = this.init.core.createRef("svf", {mode: 'lowpass'},cutRef , rezRef,[]);
            // this.filters['filter'+i].filterRef = filterRef
            // this.filters['filter'+i].setFilterRef = setFilterRef 
        }  
        //filters setup take 2

        
        


        
        this.render()
        this.init.setup ? this.init.setup++ : this.init.setup = 1
    },
    render(){

        // let myrender = this.synth.voices.state.map( (voice) => this.synthVoice(voice) )

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
            

             // oscilator 1

            let Osc1_signal =  el.mul(
                el.adsr(a,d,s,r,voice.gate),
                getOsc(voice.freq,this.oscilators.osc1.mode),
              ) 

            //unison attempt

            let unisonMix = this.oscilators.osc1.unison.unisonMix
          

            let Osc1_unison_signal = el.mul( el.adsr(a,d,s,r,voice.unison[0].unisonGate), getOsc(voice.unison[0].unisonFreq,this.oscilators.osc1.mode) )
            
            let Osc1_unison_stereo = {
                left :  el.mul( el.sub(1,voice.unison[0].unisonPan ) , Osc1_unison_signal ),
                right : el.mul( el.add(1,voice.unison[0].unisonPan ) , Osc1_unison_signal )
            }
            
            voice.unison.forEach((e,i)=>{
                if(i !== 0){

                    let newIsgnal = el.mul( el.adsr(a,d,s,r, e.unisonGate ), getOsc(e.unisonFreq, this.oscilators.osc1.mode) )
                    Osc1_unison_stereo.left  =  el.div ( el.add ( Osc1_unison_stereo.left , el.mul( el.sub(1,e.unisonPan ) , newIsgnal )) , 2 )
                    Osc1_unison_stereo.right =  el.div ( el.add ( Osc1_unison_stereo.right , el.mul( el.add(1,e.unisonPan ) , newIsgnal )) , 2 )

                }
            })
             
            let Osc1_unison_stereo_left = el.mul( el.div(unisonMix,2), Osc1_unison_stereo.left)
            let Osc1_unison_stereo_right = el.mul( el.div(unisonMix,2), Osc1_unison_stereo.right)
         

            //stereo signal

            let levelRef1 = this.oscilators.osc1.levelRef
            let panRef1 = this.oscilators.osc1.panRef

            let osc1_stereo = { 
                left:   el.mul( el.sub(1,panRef1 ) , el.mul( el.div(levelRef1,2), el.add( Osc1_signal , Osc1_unison_stereo_left ) )  ), 
                right:  el.mul( el.add(1,panRef1 ) , el.mul( el.div(levelRef1,2), el.add( Osc1_signal , Osc1_unison_stereo_right ))  )
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
            

            let mode1     = this.filters.filter1.mode
            let cutoffRef1 = this.filters.filter1.cutRef
            let rezoRef1   = this.filters.filter1.rezRef
            let mixRef1    = this.filters.filter1.mixRef

            
            // let [filter1Ref,setFilter1Ref] = this.init.core.createRef("svf", {mode: this.filters.filter1.mode}, [cutoffRef1, rezoRef1, ])


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

                // console.log(frequency)

                if(this.synth.voices.currentVoice < this.synth.voices.state.length){

                    let currentvoice = this.synth.voices.state[this.synth.voices.currentVoice]
                    currentvoice.setFreqRef({value: frequency})
                    currentvoice.setGateRef({value: 1})

                    currentvoice.unison.forEach((e,i)=>{
                        e.unisonSetGate({value: 1 })
                    })


                    currentvoice.note = note

                    this.synth.voices.activeVoices[note] = currentvoice

                    this.synth.voices.currentVoice += 1
                }
                
            }else if(event === 'noteOff'){
                
                if(Object.keys(this.synth.voices.activeVoices).includes(note)){
                    let currentvoice = this.synth.voices.activeVoices[note]
                    currentvoice.setGateRef({value: 0})

                    currentvoice.unison.forEach((e,i)=>{
                        e.unisonSetGate({value: 0 })
                    })

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
    updateOsc(oscilator,name,payload){
        
        switch(name){
            case 'mode' :
                this.oscilators[oscilator].mode = payload
                this.render()
                break;
            case 'level' :
                this.oscilators[oscilator].level = payload

                payload = mapper(payload,0,100,0,1)
                this.oscilators[oscilator].setLevelRef({value: payload})
                break;
            case 'pan' :
                this.oscilators[oscilator].pan = payload

                payload = mapper(payload,0,100,-1,1)
                this.oscilators[oscilator].setPanRef({value: payload})
                
                break;
            case 'trans' :
                break;
            case 'detune' :
                break;
            
        }
    },
    updateEnv1(name,payload) {
        this.env1.adsr[name].value = payload

        let min = this.env1.adsr[name].minmax.min
        let max = this.env1.adsr[name].minmax.max
        payload = mapper(payload,0,100,min,max)
        console.log(payload)
        name !== 'delay' ?  this.env1.adsr[name].setRef({value: payload}) : null
       
    },
    updateKeyPlay(payload){
        this.keyboard.keyPlay = payload
    },
    updateFilter(filter,name,payload){
        switch(name){
            case 'mode':
                this.filters[filter].mode = payload
                // this.filters[filter].setModeRef({value: payload})
                this.render()
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