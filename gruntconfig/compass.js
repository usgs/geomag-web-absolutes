'use strict';

var config = require('./config');

var compass = {
  src: {
    options: {
      cssDir: config.build + '/' + config.src,
      environment: 'development',
      sassDir: config.src,
      specify: [
        config.src + '/geomag-baseline-calculator.scss'
      ]
    }
  }
};

module.exports = compass;
