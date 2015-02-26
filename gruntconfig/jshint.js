'use strict';

var config = require('./config');

var jshint = {
  options: {
    jshintrc: '.jshintrc'
  },

  gruntfile: [
    'Gruntfile.js',
    'gruntconfig/**/*.js'
  ],

  dev: [
    config.src + '/**/*.js',
  ],

  test: [
    config.test + '/**/*.js'
  ]
};

module.exports = jshint;
