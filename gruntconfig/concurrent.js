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
  postcss: [
    // 'postcss:index',
    // 'postcss:login',
    // 'postcss:observation',
    // 'postcss:plot',
    // 'postcss:useradmin'
    'postcss'
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
  ]
};

module.exports = concurrent;
