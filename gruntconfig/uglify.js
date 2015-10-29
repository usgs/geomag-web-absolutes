'use strict';

var config = require('./config');


var uglify = {
  index: {
    src: [config.build + '/' + config.src + '/htdocs/js/index.js'],
    dest: config.dist + '/htdocs/js/index.js',
  },

  observation: {
    src: [config.build + '/' + config.src + '/htdocs/js/observation.js'],
    dest: config.dist + '/htdocs/js/observation.js'
  },

  plot: {
    src: [config.build + '/' + config.src + '/htdocs/js/plot.js'],
    dest: config.dist + '/htdocs/js/plot.js'
  },
  
  useradmin: {
    src: [config.build + '/' + config.src + '/htdocs/js/useradmin.js'],
    dest: config.dist + '/htdocs/js/useradmin.js'
  }
};


module.exports = uglify;
