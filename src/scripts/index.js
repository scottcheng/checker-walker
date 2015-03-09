import $ from 'jquery';
import d3 from 'd3';

$(() => {
  const SQUARE_WIDTH = 60;

  const board = d3.select('#board');
  const boardBorder = board
    .append('rect')
    .attr('id', 'border');
  const rowsWrapper = board
    .append('g')
    .attr('id', 'rows');
  const columnsWrapper = board
    .append('g')
    .attr('id', 'columns');
  const arrowsWrapper = board
    .append('g')
    .attr('id', 'arrows');
  const piece = board
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

  const boardPadding = 10;

  const rows = 4;
  const columns = 6;

  const boardWidth = columns * SQUARE_WIDTH;
  const boardHeight = rows * SQUARE_WIDTH;

  const arrows = d3.range(rows * columns).map((i) => {
    return {
      x: i % columns,
      y: Math.floor(i / columns),
      direction: Math.floor(Math.random() * 4),
      active: false,
    }
  });

  board
    .attr('width', boardWidth + boardPadding * 2)
    .attr('height', boardHeight + boardPadding * 2);

  boardBorder
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('x', boardPadding)
    .attr('y', boardPadding)
    .attr('width', boardWidth)
    .attr('height', boardHeight);

  rowsWrapper
    .selectAll('line')
    .data(d3.range(1, rows))
    .enter()
      .append('line')
      .classed('grid', true)
      .attr('x1', boardPadding)
      .attr('y1', (i) => SQUARE_WIDTH * i + boardPadding)
      .attr('x2', boardWidth + boardPadding)
      .attr('y2', (i) => SQUARE_WIDTH * i + boardPadding);

  columnsWrapper
    .selectAll('line')
    .data(d3.range(1, columns))
    .enter()
      .append('line')
      .classed('grid', true)
      .attr('x1', (i) => SQUARE_WIDTH * i + boardPadding)
      .attr('y1', boardPadding)
      .attr('x2', (i) => SQUARE_WIDTH * i + boardPadding)
      .attr('y2', boardHeight + boardPadding);

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
      .attr('x', (d) => (d.x + .7) * SQUARE_WIDTH + boardPadding)
      .attr('y', (d) => (d.y + .3) * SQUARE_WIDTH + boardPadding);

  const position = { x: 0, y: 0 };
  piece.attr('transform', `translate(
    ${(position.x + .5) * SQUARE_WIDTH + boardPadding},
    ${(position.y + .5) * SQUARE_WIDTH + boardPadding})`);
  arrowsWrapper
    .selectAll('text')
    .data(arrows.map((d) => {
      return {
        x: d.x,
        y: d.y,
        direction: d.direction,
        active: d.x === position.x && d.y === position.y,
      }
    }))
    .classed('active', (d) => d.active);
});
