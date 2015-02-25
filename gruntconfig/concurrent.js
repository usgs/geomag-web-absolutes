'use strict';

var concurrent = {
  dev: [
    'browserify:index',
    'browserify:observation',
    'browserify:plot',
    'browserify:useradmin',

    'compass:index',
    'compass:login',
    'compass:observation',
    'compass:plot',
    'compass:useradmin',

    'copy:dev'
  ],

  test: [
    'browserify:bundle', // All source files, one bundle, with aliases
    'browserify:test',   // Test bootstrap and source
    'copy:test'          // Static test content (HTML, etc...)
  ]
};

module.exports = concurrent;
