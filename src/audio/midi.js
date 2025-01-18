import { WebMidi } from "webmidi";

export async function MidiInit(){
    try {
        await WebMidi.enable();
    }catch(err){
        console.error("WebMidi init:", err)
    }
}


export class Midi {
    noteEmitter;
    selectedInput;
   
    constructor(noteEmitter) {
      this.noteEmitter = noteEmitter;
      this.selectedInput = null;
    }
   
    async WebMidiInit(displayControllers) {
        try {
        await WebMidi.enable();
        // displayControllers(this.#getInputNames(), this.selectedInput?.name);
    
        WebMidi.addListener("connected", () => {
            // displayControllers(this.#getInputNames(), this.selectedInput?.name);
        });
    
        WebMidi.addListener("disconnected", () => {
            // displayControllers(this.#getInputNames(), this.selectedInput?.name);
        });
        } catch (err) {
        console.error("WebMidi could not be initialized:", err);
        }
    }
}