    // async init(){
    //     let node = await core.initialize(ctx, {
    //         numberOfInputs: 0,
    //         numberOfOutputs: 1,
    //         outputChannelCount: [1],
    //     })
    //     node.connect(ctx.destination);
        
        
    // },
    // synth(vs){
      
    // },
    // updateVoices(voices,e){
        
    // },
    // play(e,freq){

    //     [this.gate,this.setGate] = core.createRef("const", {value:1}, [])

    //     let env = el.smooth( el.select( this.gate,el.tau2pole(0.5),el.tau2pole(1) ), this.gate )
    //     let out = el.mul(0.2, env, el.saw(freq) )
    //     let filter = el.bandpass( 1200 , 1.0, out)
    //     // let newCutoff = 500

    //     // setCutoffFreq({value: newCutoff});
    //     // let vs = this.updateVoices(this.voices,e)
    //     core.render( filter  )
    // },
    // stop(){
    //     this.setGate({value: 0})
    // }