import {el} from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
 
const ctx = new AudioContext();
const core = new WebRenderer();
 
(async function main() {
  let node = await core.initialize(ctx, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });
 
  node.connect(ctx.destination);
 
  let stats = await core.render(el.cycle(440), el.cycle(441));
  console.log(stats);
})();