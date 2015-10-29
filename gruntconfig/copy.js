'use strict';

var config = require('./config');


var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    expand: true,
    src: [
      'conf/**/*',

      'htdocs/**/*',
      '!htdocs/**/*.scss', // Migrated using postcss
      '!htdocs/**/*.js',   // Migrated using browserify

      'lib/**/*'
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
