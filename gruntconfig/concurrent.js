'use strict';

var concurrent = {
  options: {
    limit: 8 // Best for minimum 4 core systems
  },

  browserify: [
    'browserify:index',
    'browserify:observation',
    'browserify:plot',
    'browserify:useradmin'
  ],
  compass: [
    'compass:index',
    'compass:login',
    'compass:observation',
    'compass:plot',
    'compass:useradmin'
  ],
  copy: [
    'copy:dev'
  ],

  test: [
    'browserify:bundle', // All source files, one bundle, with aliases
    'browserify:test'    // Test bootstrap and source
  ],
  copytest: [
    'copy:test'          // Static test content (HTML, etc...)
  ],

  uglify: [
    'uglify:index',
    'uglify:observation',
    'uglify:plot',
    'uglify:useradmin'
  ],
  cssmin: [
    'cssmin:index',
    'cssmin:login',
    'cssmin:observation',
    'cssmin:plot',
    'cssmin:useradmin'
  ]
};

module.exports = concurrent;
