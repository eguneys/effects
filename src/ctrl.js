import makePlay from './ctrl/play';


export default function ctrl(state, ctx) {
  this.ctx = ctx;
  this.data = state;

  this.play = new makePlay(this, ctx);

  this.update = delta => {

    this.data.game.tick += delta;

    this.play.update(delta);
    
  };
}
