import * as u from './util';

export default function Graphics(state, ctx) {
  const { width, height } = state.game;

  this.raw = (f) => f(ctx);

  this.render = () => {
    
  };

}
