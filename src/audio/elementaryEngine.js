import WebRenderer from '@elemaudio/web-renderer';
import { el } from '@elemaudio/core';
import {store} from '../store/store.js'

let core;  // For the WebRenderer
let ctx;

let cutoffRef
let setCutoffFreqRef
let rezoRef
let setRezoRef

let voices = [
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v1'},
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v2'},
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v3'},
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v4'},
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v5'},
    {gate: 0, note: null, freq: 440, tc: 0.5, key: 'v6'}
];


export async function initializeEngine() {

    if (!ctx || !core) {
        ctx = new AudioContext();
        core = new WebRenderer();

        const node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        })

        node.connect(ctx.destination);

        console.log("Audio system initialized!");

        createRefs()
        render(voices)
    }
}

function createRefs(){
    let freq = mapper(store.filter1.cutoff,0,100,20,20000);
    let rez = store.filter1.resonance / 10;

    [cutoffRef, setCutoffFreqRef] = core.createRef("const", {value: freq}, []);

    [rezoRef,setRezoRef] = core.createRef("const", {value: rez}, [])

}   
export function changeCutOff(newValue){
    let newCutoff = mapper(newValue,0,100,20,10000);
    
    setCutoffFreqRef({value: newCutoff})
    cutoffRef.props.value = newCutoff
    
}
export function changeRezo(newValue){
    let newRezo = newValue / 10;
    setRezoRef({value: newRezo})
    rezoRef.props.value = newRezo
}



export function noteEvent(event,frequency,note,octave){
    
    
    if(event === 'noteOn'){
        for(let i = 0;i < voices.length;i++){
            if(voices[i].gate == 0){
                voices[i].gate = 1
                voices[i].freq = frequency
                voices[i].note = note
                
                break
            }
        }
        
    }else if(event === 'noteOff'){
        for(let i = 0;i < voices.length;i++){
            if(voices[i].freq == frequency){
                voices[i].gate = 0
                // voices[i].freq = null
                // voices[i].note = null
                break
            }
        }
    }
    render(voices)
}

function synthVoice(voice) {

    let gate = el.const({ key: `${voice.key}:gate`, value: voice.gate })
    let freq = el.const({ key: `${voice.key}:freq`, value: voice.freq })
    let filtered = getFilter( el.mul(getENV(gate),getOsc(freq)) )
    
    // return el.mul(
    //     getENV(gate),
    //     getOsc(freq),
    //   )

    return filtered
  }


function render(voices){
    
    
    core.render( el.add( ...voices.map( (voice) => synthVoice(voice) )) )
}

function getOsc(freq){
    let osc1 = store.osc1.type
    const resetSignal = el.train(1);
    let oscReturn
    
    switch (osc1){
        case 'sine': 
            
            oscReturn =  el.cycle(freq)
            break;
        case 'square':
            // oscReturn = el.phasor(freq)
            oscReturn =  el.blepsquare(freq)
            break;
        case 'triangle': 
            // oscReturn = el.phasor(freq)
            oscReturn =  el.bleptriangle(freq)
            break;
        case 'sawtooth': 
            oscReturn =  el.blepsaw(freq)
            break;
        default:
            oscReturn =  el.cycle(freq)
            break;
    }
    return oscReturn
}

function getENV(gate){
    let a = store.env1.adsr.attack.value
    let d = store.env1.adsr.decay.value
    let s = store.env1.adsr.sustain.value
    let r = store.env1.adsr.release.value

    // return el.smooth(
    //     el.select(
    //         gate, //acording to wether this is 1 or 0
    //         el.tau2pole(0.1), //if its 1, go to 1 over 0.1 seconds
    //         el.tau2pole(0.8) // if its 0, got to 0 over 0.8 seconds
    //     ),
    //     gate
    // )

    return el.adsr(a,d,s,r,gate)
}

function getFilter(signal){
    let mode = store.filter1.type
    

    let filtered = el.svf( {mode : mode}, cutoffRef, rezoRef, signal) 
    
    return filtered

}

function noteToFreq(note,octave){
    
    const noteOffsets = {
        C: -9,
        Cs: -8,
        D: -7,
        Ds: -6,
        E: -5,
        F: -4,
        Fs: -3,
        G: -2,
        Gs: -1,
        A: 0,
        As: 1,
        B: 2,
    }
    note.includes('#') ? note = note.split('#')[0] + 's' : null
    const referenceFrequency = 440; 
    const semitoneOffset = noteOffsets[note] + (octave - 4) * 12;
    const freq = referenceFrequency * Math.pow(2, semitoneOffset / 12);
    console.log(freq)
    return freq
}

function mapper(value, x1, y1, x2, y2){
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

// function alocateVoice(frequency,note){
//     let index = voices.findIndex((e) => e.gate == 0 && e.note != note && e.freq != frequency)
//     return index
// }


// export function playNote(frequency,note) {
    
//     console.log('play : ' + alocateVoice(frequency,note))
//     let freeVoice = alocateVoice(frequency,note)

//     let v= voices[freeVoice]
//     v.gate = 1
//     v.freq = frequency
//     v.note = note
//     core.render( 
//         el.mul( 
//             el.const({ key : v.key+':gate', value : v.gate }), //gate
//             el.cycle( el.const({ key: v.key+':freq', value : v.freq})) //cycle
//             ) 
//         )
//   }
  
  
//   export function stopAudio(frequency,note) {

//     console.log('stop : ' + alocateVoice(frequency,note))

//     let activeVoice = alocateVoice(frequency,note)

//     let v= voices[activeVoice]
//     v.gate = 0
//     core.render( 
//         el.mul( 
//             el.const({ key : v.key+':gate', value : v.gate }), //gate
//             el.cycle( el.const({ key: v.key+':freq', value : v.freq})) //cycle
//             ) 
//         )
//   }