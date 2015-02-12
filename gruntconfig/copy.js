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
  }
};

module.exports = copy;
