import d3 from 'd3';

import view from './boardView';

class Board {
  initiate({ rows, columns }) {
    this.rows = rows;
    this.columns = columns;

    this.arrows = d3.range(this.rows * this.columns).map((i) => {
      return {
        x: i % columns,
        y: Math.floor(i / columns),
        // 0: up, 1: right, 2: down, 3: left
        direction: Math.floor(Math.random() * 4),
        visited: false,
      };
    });

    this.position = {
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows),
    };

    view.initiate({
      rows: this.rows,
      columns: this.columns,
      arrows: this.arrows,
      position: this.position,
    });
  }

  walk() {
    // TODO
  }

  _getArrow({ x, y }) {
    return this.arrows[x * this.columns + y];
  }

  _getNextPosition(position) {
    const arrow = this._getArrow(position);
    let { x, y } = position;
    if (arrow.direction === 0) {
      y--;
    }
    else if (arrow.direction === 1) {
      x++;
    }
    else if (arrow.direction === 2) {
      y++;
    }
    else {
      x--;
    }
    return { x, y };
  }

  _isOff({ x, y }) {
    return x < 0 || x >= this.columns || y < 0 || y >= this.rows;
  }
};

export default new Board;
