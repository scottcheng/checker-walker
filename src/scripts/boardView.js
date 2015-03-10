import d3 from 'd3';

import { SQUARE_WIDTH } from './constants';

const BOARD_PADDING = SQUARE_WIDTH;

class BoardView {
  initiate({ rows, columns, arrows, position }) {
    this.container = d3.select('#board-section').classed('finished', false);
    const board = d3.select('#board');
    board.selectAll('*').remove();

    const boardBorder = board
      .append('rect')
      .attr('id', 'border');
    const rowsWrapper = board
      .append('g')
      .attr('id', 'rows');
    const columnsWrapper = board
      .append('g')
      .attr('id', 'columns');
    const arrowsWrapper = this.arrowsWrapper = board
      .append('g')
      .attr('id', 'arrows');
    const piece = this.piece = board
      .append('g')
      .attr('id', 'piece');
    piece
      .append('circle')
      .classed('piece', true)
      .attr('r', SQUARE_WIDTH / 4);
    piece
      .append('circle')
      .classed('piece-shadow', true)
      .attr('r', SQUARE_WIDTH / 4);

    const boardWidth = columns * SQUARE_WIDTH;
    const boardHeight = rows * SQUARE_WIDTH;

    board
      .attr('width', boardWidth + BOARD_PADDING * 2)
      .attr('height', boardHeight + BOARD_PADDING * 2);

    boardBorder
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('x', BOARD_PADDING)
      .attr('y', BOARD_PADDING)
      .attr('width', boardWidth)
      .attr('height', boardHeight);

    rowsWrapper
      .selectAll('line')
      .data(d3.range(1, rows))
      .enter()
        .append('line')
        .classed('grid', true)
        .attr('x1', BOARD_PADDING)
        .attr('y1', (i) => SQUARE_WIDTH * i + BOARD_PADDING)
        .attr('x2', boardWidth + BOARD_PADDING)
        .attr('y2', (i) => SQUARE_WIDTH * i + BOARD_PADDING);

    columnsWrapper
      .selectAll('line')
      .data(d3.range(1, columns))
      .enter()
        .append('line')
        .classed('grid', true)
        .attr('x1', (i) => SQUARE_WIDTH * i + BOARD_PADDING)
        .attr('y1', BOARD_PADDING)
        .attr('x2', (i) => SQUARE_WIDTH * i + BOARD_PADDING)
        .attr('y2', boardHeight + BOARD_PADDING);

    arrowsWrapper
      .selectAll('text')
      .data(arrows)
      .enter()
        .append('text')
        .classed('arrow', true)
        .text((d) => {
          if (d.direction === 0) {
            return '\ue606';
          }
          if (d.direction === 1) {
            return '\ue605';
          }
          if (d.direction === 2) {
            return '\ue603';
          }
          return '\ue604';
        })
        .attr('x', (d) => (d.x + .7) * SQUARE_WIDTH + BOARD_PADDING)
        .attr('y', (d) => (d.y + .3) * SQUARE_WIDTH + BOARD_PADDING);

    this.moveTo({ x: position.x, y: position.y, arrows }, { initializing: true });
  }

  moveTo({ x, y, arrows }, { initializing } = {}) {
    const pieceTransform = `translate(
      ${(x + .5) * SQUARE_WIDTH + BOARD_PADDING},
      ${(y + .5) * SQUARE_WIDTH + BOARD_PADDING})`;
    if (initializing) {
      this.piece
        .attr('transform', `${pieceTransform} scale(0)`)
        .transition()
        .duration(500)
        .ease(d3.ease('elastic'))
        .attr('transform', pieceTransform);
    }
    else {
      this.piece
        .transition()
        .attr('transform', pieceTransform);
    }

    this.arrowsWrapper
      .selectAll('text')
      .data(arrows.map((d) => {
        return {
          x: d.x,
          y: d.y,
          direction: d.direction,
          active: d.x === x && d.y === y,
          visited: d.visited,
        };
      }))
      .classed({
        active: (d) => d.active,
        visited: (d) => d.visited,
      });
  }

  finish(result) {
    this.container.classed({
      finished: true,
      loop: result === 'loop',
      off: result === 'off',
    });
  }
}

export default new BoardView;
