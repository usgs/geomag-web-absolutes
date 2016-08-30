'use strict';

var config = require('./config');


var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    expand: true,
    options: {
      mode: true
    },
    src: [
      'conf/**/*',

      'htdocs/**/*',
      '!htdocs/**/*.scss', // Migrated using postcss
      '!htdocs/**/*.js',   // Migrated using browserify

      'lib/**/*',
      'htdocs/js/example-url.js'
    ]
  },

  test: {
    cwd: config.test,
    dest: config.build + '/' + config.test,
    expand: true,
    src: [
      'test.html',
      'lib/**/*'
    ]
  },

  dist: {
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    expand: true,
    options: {
      mode: true
    },
    src: [
      'conf/**/*',

      'htdocs/**/*',
      '!htdocs/**/*.scss', // Migrated using postcss
      '!htdocs/**/*.js',   // Migrated using browserify

      'lib/**/*'
    ]
  }
};


module.exports = copy;
