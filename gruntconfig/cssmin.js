'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    dest: config.dist + '/geomag-baseline-calculator.css',
    src: [config.build + '/' + config.src + '/geomag-baseline-calculator.css']
  }
};

module.exports = cssmin;
