'use strict';

var config = require('./config');

var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src,
        process.cwd() + '/node_modules/hazdev-webutils/src',
        process.cwd() + '/node_modules/hazdev-tablist/src/tablist'
      ]
    }
  },

  source: {
    src: [],
    dest: config.build + '/' + config.src + '/geomag-baseline-calculator.js',
    options: {
      alias: [
        './' + config.src + '/baselinecalculator/BaselineCalculator.js:baselinecalculator/BaselineCalculator'
      ]
    }
  },

  test: {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: [
        'baselinecalculator/BaselineCalculator'
      ]
    }
  }
};

module.exports = browserify;
