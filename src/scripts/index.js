import $ from 'jquery';

import control from './control';

$(() => {
  control.initiate();
  window.setTimeout(control._start.bind(control), 500);
});
