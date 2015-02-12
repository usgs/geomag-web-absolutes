'use strict';

var config = require('./config');

var jshint = {
  options: {
    jshintrc: '.jshintrc'
  },
  example: [
    config.example + '/**/*.js'
  ],
  gruntfile: [
    'Gruntfile.js',
    'gruntconfig/**/*.js'
  ],
  scripts: [
    config.src + '/**/*.js',
  ],
  test: [
    config.test + '/**/*.js'
  ]
};

module.exports = jshint;
