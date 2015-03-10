import board from './board';

import { INTERVAL, DEFAULT_SIZE } from './constants';

class Control {
  initiate() {
    board.initiate(DEFAULT_SIZE);
  }

  _start() {
    this._tick();
  }

  _pause() {

  }

  _reset() {

  }

  _tick() {
    const result = board.walk();

    if (result !== 'off') {
      window.setTimeout(this._tick.bind(this), INTERVAL);
    }
  }
}

export default new Control;
