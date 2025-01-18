import WebRenderer from '@elemaudio/web-renderer';
import { el } from '@elemaudio/core';


let core;  // For the WebRenderer
let ctx;



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

        
    }
}



function alocateVoice(frequency,note){
    let index = voices.findIndex((e) => e.gate == 0 && e.note != note && e.freq != frequency)
    return index
}

export function noteEvent(event,frequency,note,octave){
    
    // console.log(event + '-' + note)
    if(event === 'noteOn'){
        for(let i = 0;i < voices.length;i++){
            if(voices[i].gate == 0){
                voices[i].gate = 1
                voices[i].freq = noteToFreq(note,octave)
                voices[i].note = note
                
                break
            }
        }
        render(voices)
    }else if(event === 'noteOff'){
        for(let i = 0;i < voices.length;i++){
            if(voices[i].freq == noteToFreq(note,octave)){
                voices[i].gate = 0
                // voices[i].freq = null
                // voices[i].note = null
                break
            }
        }
        render(voices)
    }
}

function synthVoice(voice) {
    return el.mul(
      el.const({ key: `${voice.key}:gate`, value: voice.gate }),
      el.cycle(el.const({ key: `${voice.key}:freq`, value: voice.freq })),
    );
  }


function render(voices){
    let v = voices[0]
    console.log()
    core.render(el.add( ...voices.map( (voice) => synthVoice(voice) )))
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

    return freq
}






export function playNote(frequency,note) {
    
    console.log('play : ' + alocateVoice(frequency,note))
    let freeVoice = alocateVoice(frequency,note)

    let v= voices[freeVoice]
    v.gate = 1
    v.freq = frequency
    v.note = note
    core.render( 
        el.mul( 
            el.const({ key : v.key+':gate', value : v.gate }), //gate
            el.cycle( el.const({ key: v.key+':freq', value : v.freq})) //cycle
            ) 
        )
  }
  
  
  export function stopAudio(frequency,note) {

    console.log('stop : ' + alocateVoice(frequency,note))

    let activeVoice = alocateVoice(frequency,note)

    let v= voices[activeVoice]
    v.gate = 0
    core.render( 
        el.mul( 
            el.const({ key : v.key+':gate', value : v.gate }), //gate
            el.cycle( el.const({ key: v.key+':freq', value : v.freq})) //cycle
            ) 
        )
  }