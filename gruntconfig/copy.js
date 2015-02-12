'use strict';

var config = require('./config');

var copy = {
  build: {
    expand: true,
    cwd: config.test,
    src: [
      'test.html'
    ],
    dest: config.build + '/' + config.test
  },
  app: {
    expand: true,
    options: {mode: true},
    cwd: config.src + '/htdocs',
    dest: config.dist + '/htdocs',
    src: [
      'img/**/*.{png,gif,jpg,jpeg}',
      '**/*.php'
    ]
  },
  conf: {
    expand: true,
    options: {mode: true},
    cwd: config.src + '/conf',
    dest: config.dist + '/conf',
    src: [
      'config.inc.php',
      'config.ini'
    ]
  },
  lib: {
    expand: true,
    options: {mode: true},
    cwd: config.src + '/lib',
    dest: config.dist + '/lib',
    src: [
      '**/*'
    ]
  }
};

module.exports = copy;
