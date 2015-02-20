'use strict';

var config = require('./config');

var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    src: [
      'conf/**/*',

      'htdocs/**/*',
      '!htdocs/**/*.scss', // Migrated using compass
      '!htdocs/**/*.js',   // Migrated using browserify

      'lib/**/*'
    ]
  },

  test: {
    cwd: config.test,
    dest: config.build + '/' + config.test,
    src: [
      'test.html',
      'lib/**/*'
    ]
  }
};

module.exports = copy;
