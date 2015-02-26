'use strict';

var config = require('./config');

var cssmin = {
  index: {
    src: [config.build + '/' + config.src + '/htdocs/css/index.css'],
    dest: config.dist + '/htdocs/css/index.css'
  },

  login: {
    src: [config.build + '/' + config.src + '/htdocs/css/login.css'],
    dest: config.dist + '/htdocs/css/login.css'
  },

  observation: {
    src: [config.build + '/' + config.src + '/htdocs/css/observation.css'],
    dest: config.dist + '/htdocs/css/observation.css'
  },

  plot: {
    src: [config.build + '/' + config.src + '/htdocs/css/plot.css'],
    dest: config.dist + '/htdocs/css/plot.css'
  },

  useradmin: {
    src: [config.build + '/' + config.src + '/htdocs/css/useradmin.css'],
    dest: config.dist + '/htdocs/css/useradmin.css'
  }
};

module.exports = cssmin;
