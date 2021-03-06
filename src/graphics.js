import * as u from './util';

export default function Graphics(state, ctx) {
  const { width, height } = state.game;
  const halfw = width / 2,
        halfh = height / 2;

  const pagesize = width * height;

  this.buffers = {
    Screen: 0,
    Effects: pagesize,
    Buffer: pagesize * 2,
    Background: pagesize * 3,
    Midground: pagesize * 4,
    Foreground: pagesize * 5,
    Sprites: pagesize * 7,
    Ui: pagesize * 8,
    Collision: pagesize * 9,
  };

  const b = this.buffers;


  const colors = [
    0xff080606,
    0xff131014,
    0xff25173B,
    0xff2D1773,
    0xff2A20B4,
    0xff233EDF,
    0xff0A6AFA,
    0xff1BA3F9,
    0xff41D5FF,
    0xff40FCFF,
    0xff64F2D6,
    0xff43DB9C,
    0xff35C159,
    0xff2EA014,
    0xff3E7A1A,
    0xff3B5224,

    0xff202012,
    0xff643414,
    0xffC45C28,
    0xffDE9F24,
    0xffC7D620,
    0xffDBFCA6,
    0xffFFFFFF,
    0xffC0F3FE,
    0xffB8D6FA,
    0xff97A0F5,
    0xff736AE8,
    0xff9B4ABC,
    0xff803A79,
    0xff533340,
    0xff342224,
    0xff1A1C22,

    0xff282b32,
    0xff3b4171,
    0xff4775bb,
    0xff63a4db,
    0xff9cd2f4,
    0xffeae0da,
    0xffd1b9b3,
    0xffaf938b,
    0xff8d756d,
    0xff62544a,
    0xff413933,
    0xff332442,
    0xff38315b,
    0xff52528e,
    0xff6a75ba,
    0xffa3b5e9,

    0xffffe6e3,
    0xfffbbfb9,
    0xffe49b84,
    0xffbe8d58,
    0xff857d47,
    0xff4e6723,
    0xff648432,
    0xff8daf5d,
    0xffbadc92,
    0xffe2f7cd,
    0xffaad2e4,
    0xff8bb0c7,
    0xff6286a0,
    0xff556779,
    0xff444e5a,
    0xff343942,
    0xff000000
  ];

  const palDefault = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64];

  let pal = palDefault;

  this.renderTarget = b.Screen;
  this.renderSource = b.Page1;

  const imageData = ctx.getImageData(0, 0, width, height);

  let buf = new ArrayBuffer(imageData.data.length);
  let buf8 = new Uint8ClampedArray(buf);
  let data = new Uint32Array(buf);

  let ram = new Uint8ClampedArray(0x80000);

  this.clear = (color) => {
    ram.fill(color, this.renderTarget, this.renderTarget + pagesize);
  };


  this.pset = (x, y, color) => {
    x = u.clamp(x | 0, 0, width);
    y = u.clamp(y | 0, 0, height);
    ram[this.renderTarget + y * width + x] = color;
  };

  const spr = (sx = 0, sy = 0, sw = 16, sh = 16, x=0, y=0, flipx = false, flipy = false) => {
    
    for (let i = 0; i < sh; i++) {
      for (let j = 0; j < sw; j++) {

        if (y+i < height && x+j < width && y+i > -1 && x+j > -1) {

          if (!flipx & !flipy) {
            let iTarget = this.renderTarget + ((y + i)*width+x+j),
                iSource = this.renderSource + ((sy + i)*width+sx+j);

            if (ram[iSource] > 0) {
              ram[iTarget] = pal[ram[iSource]];
            }
          }
        }
      }
    }

  };


  this.line = (x1, y1, x2, y2, color) => {
    let dy = y2 - y1,
        dx = x2 - x1,
        stepx = 1,
        stepy = 1,
        fraction;

    if (dy < 0) {
      dy = -dy;
      stepy = -1;
    }
    if (dx < 0) {
      dx = -dx;
      stepx = -1;
    }
    dy <<= 1;
    dx <<= 1;

    this.pset(x1, y1, color);

    if (dx > dy) {
      fraction = dy - (dx >> 1);

      while (x1 != x2) {
        if (fraction >= 0) {
          y1 += stepy;
          fraction -= dx;
        }
        x1 += stepx;
        fraction += dy;
        this.pset(x1, y1, color);
      }
    } else {
      fraction = dx - (dy >> 1);
      while (y1 != y2) {
        if (fraction >= 0) {
          x1 += stepx;
          fraction -= dy;
        }
        y1 += stepy;
        fraction += dx;
        this.pset(x1, y1, color);
      }
    }

  };

  this.circle = (xm, ym, r, color) => {
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      this.pset(xm-x, ym+y, color);
      this.pset(xm-y, ym-x, color);
      this.pset(xm+x, ym-y, color);
      this.pset(xm+y, ym+x, color);
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
      
    } while (x < 0);

  };

  this.fillCircle = (xm, ym, r, color) => {
    if (r < 0) return;
    xm = xm|0; ym = ym|0; r = r|0; color = color|0;
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      this.line(xm-x, ym-y, xm+x, ym-y, color);
      this.line(xm-x, ym+y, xm+x, ym+y, color);
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
    } while (x < 0);
  };

  const fillRect = (x1, y1, x2, y2, color) => {
    let i = Math.abs(y2 - y1);

    this.line(x1, y1, x2, y1, color);

    if (i > 0) {
      while (--i) {
        this.line(x1, y1 + i, x2, y1 + i, color);
      }
    }
    this.line(x1, y2, x2, y2, color);
  };

  this.fr = (x, y, w, h, color) => {
    let x1 = x|0,
        y1 = y|0,
        x2 = (x+w)|0,
        y2 = (y+h)|0;

    let i = Math.abs(y2 - y1);
    this.line(x1, y1, x2, y1, color);

    if (i > 0) {
      while (--i) {
        this.line(x1, y1+i, x2, y1+i, color);
      }
    }
    this.line(x1, y2, x2, y2, color);    
  };

  const checker = (nRow, nCol, color) => {
    let w = width,
        h = height,
        x = 0,
        y = 0;

    w /= nCol;
    h /= nRow;

    for (let i = 0; i < nRow; ++i) {
      for (let j = 0, col = nCol / 2; j < col; ++j) {
        x = 2 * j * w + (i % 2 ? 0 : w);
        y = i * h;
        fillRect(x, y, x + w, y + h, color);
      }
    }
  };

  this.render = () => {

    let i = 0x10000;

    while (i--) {
      data[i] = colors[pal[ram[i]]];
    }    

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
  };
}
