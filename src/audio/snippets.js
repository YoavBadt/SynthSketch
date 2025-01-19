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






    useEffect(() => {
        let core = renderContext.renderer;
    
        if (core) {
          let monoOut = el.add(...voiceState.voices.map(function(v, i) {

            let gate = el.const({key: `${v.key}:gate`, value: v.gate});

            let env = el.smooth(el.tau2pole(0.2), el.meter({name: 'gate'}, gate));

            let mapTo = (x, min, max) => el.add(min, el.mul(x, max - min));
    
            
            
            return el.lowpass(
              el.add(
                mapTo(el.meter({name: 'env'}, env), 100, 1800),
                mapTo(el.mul(0.5, el.add(1, el.cycle(0.5))), 100, 1800),
              ),
              0.717,
              el.mul(0.2, env, el.add(
                el.blepsaw(el.smooth(el.tau2pole(0.01), el.const({key: `${v.key}:freq:1`, value: v.freq}))),
                el.blepsaw(el.smooth(el.tau2pole(0.01), el.const({key: `${v.key}:freq:2`, value: v.freq * 1.01}))),
              ))
            );

          }));//end of ADD - monoOut returns el.lowpass
    
          let [yl, yr] = srvb({name: 'vrb'}, 0.5, 0.7, 0.5, monoOut, monoOut)
    
          let [ol, or] = [
            el.add(monoOut, el.mul(0.3, yl)),
            el.add(monoOut, el.mul(0.3, yr)),
          ];
    
          console.log(core.render(ol, or));
        }
      }, [voiceState]);