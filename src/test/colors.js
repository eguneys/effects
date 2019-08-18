import { log, is } from 'testiz/browser';

import * as colors from '../colors';

export default function run() {

  const pal = colors.Palette;

  let r,g,b,a,h,s,l;

  log('rgba <-> rgba');
  [r, g, b, a] = colors.arr(pal.Blue);
  is('non destructive', colors.fromArr([r, g, b, a]), pal.Blue);

  log('hsl <-> rgba');
  [h,s,l,a] = colors.hsla(pal.Blue);
  is('non destructive', colors.hslToRgba(h, s, l, a), pal.Blue);


  const shifter = colors.shifter(pal.Blue);

  log('shifter lum');
  is('zero shift', shifter.lum(0), pal.Blue);
  is('one shift', shifter.lum(1), pal.Blue);
  is('half shift', shifter.lum(0.5), 0xffffffff);
  // is('quarter shift', shifter.lum(0.25), 0xff8080ff);

}
