import d3 from 'd3';

import board from './board';

import { INTERVAL, DEFAULT_SIZE, MAX_SIZE } from './constants';

class Control {
  initiate() {
    this.size = DEFAULT_SIZE;

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

    this.rowsInput = d3.select('#board-size-rows')
      .on('keydown', this._sizeInputKeydown.bind(this))
      .on('blur', this._updateSize.bind(this));
    this.columnsInput = d3.select('#board-size-columns')
      .on('keydown', this._sizeInputKeydown.bind(this))
      .on('blur', this._updateSize.bind(this));

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
    window.clearTimeout(this.tickTimeout);
    this._render();
  }

  _reset() {
    this.isOff = false;
    this._pause();
    board.initiate(this.size);
  }

  _tick() {
    if (!this.playing) { return; }

    const result = board.walk();

    if (result !== 'off') {
      this.tickTimeout = window.setTimeout(this._tick.bind(this), INTERVAL);
    }
    else {
      this.isOff = true;
      this._render();
    }
  }

  _sizeInputKeydown() {
    // Blur (and thus update) on enter
    if (d3.event.keyCode === 13) {
      d3.event.target.blur();
    }
  }

  _updateSize() {
    const rows = +this.rowsInput.property('value');
    const columns = +this.columnsInput.property('value');

    if (!Number.isInteger(rows) || !Number.isInteger(columns)) {
      this._render();
      return;
    }
    if (rows === this.size.rows && columns === this.size.columns) { return; }

    this.size = {
      rows: Math.max(1, Math.min(MAX_SIZE.rows, rows)),
      columns: Math.max(1, Math.min(MAX_SIZE.columns, columns)),
    };
    this._reset();
  }

  _render() {
    this.playBtn.classed({
      playing: this.playing,
      disabled: this.isOff,
    });

    this.rowsInput.property('value', this.size.rows);
    this.columnsInput.property('value', this.size.columns);
  }
}

export default new Control;
