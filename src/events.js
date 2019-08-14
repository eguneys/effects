import { Moves } from './ctrl';

export function bindDocument(ctrl) {
  const unbinds = [];

  const onKeyDown = startMove(ctrl);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));

  return () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function startMove(ctrl) {
  return function(e) {
    switch(e.code) {
    case 'Space':
      ctrl.spaceHit();
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}
