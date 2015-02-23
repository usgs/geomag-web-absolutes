'use strict';

var config = require('./config');

var uglify = {
  dist: {
    src: config.build + '/' + config.src + '/geomag-baseline-calculator.js',
    dest: config.dist + '/geomag-baseline-calculator.js'
  }
};

module.exports = uglify;
