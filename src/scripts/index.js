import $ from 'jquery';

import control from './control';
import board from './board';
import boardView from './boardView';

$(() => {
  board.initiate({ columns: 8, rows: 5});
});
