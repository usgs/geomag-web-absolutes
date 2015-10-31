'use strict';

var config = require('./config');


var uglify = {
  index: {
    dest: config.dist + '/htdocs/js/index.js',
    src: [
      config.build + '/' + config.src + '/htdocs/js/index.js'
    ]
  },

  observation: {
    dest: config.dist + '/htdocs/js/observation.js',
    src: [
      config.build + '/' + config.src + '/htdocs/js/observation.js'
    ]
  },

  plot: {
    dest: config.dist + '/htdocs/js/plot.js',
    src: [
      config.build + '/' + config.src + '/htdocs/js/plot.js'
    ]
  },

  useradmin: {
    dest: config.dist + '/htdocs/js/useradmin.js',
    src: [
      config.build + '/' + config.src + '/htdocs/js/useradmin.js'
    ]
  }
};


module.exports = uglify;
