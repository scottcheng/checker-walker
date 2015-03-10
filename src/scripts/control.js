import d3 from 'd3';

import board from './board';

import { INTERVAL, DEFAULT_SIZE } from './constants';

class Control {
  initiate() {
    this.playBtn = d3.select('#play-pause-btn')
      .on('click', () => {
        if (this.playing) {
          this._pause();
        }
        else {
          this._play();
        }
      });
    d3.select('#reset-btn')
      .on('click', () => {
        this._reset();
      });

    this._reset();
  }

  _play() {
    if (this.isOff) { return; }

    this.playing = true;
    this._render();
    this._tick();
  }

  _pause() {
    if (this.isOff) { return; }

    this.playing = false;
    this._render();
  }

  _reset() {
    this.isOff = false;
    this._pause();
    board.initiate(DEFAULT_SIZE);
  }

  _tick() {
    if (!this.playing) { return; }

    const result = board.walk();

    if (result !== 'off') {
      window.setTimeout(this._tick.bind(this), INTERVAL);
    }
    else {
      this.isOff = true;
      this._render();
    }
  }

  _render() {
    this.playBtn.classed({
      playing: this.playing,
      disabled: this.isOff,
    });
  }
}

export default new Control;
