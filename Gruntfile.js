'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');


  // Load grunt tasks
  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);


  // creates distributable version of library
  grunt.registerTask('build', [
    'clean',
    'dev',
    'copy:dist',
    'postcss',
    'uglify'
  ]);

  // default task useful during development
  grunt.registerTask('default', [
    'jshint:dev',
    'browserify:index',
    'browserify:observation',
    'browserify:plot',
    'browserify:useradmin',
    'postcss',
    'copy:dev',
    'configureProxies:dev',
    'connect:build',

    'jshint:test',
    'browserify:bundle', // All source files, one bundle, with aliases
    'browserify:test',   // Test bootstrap and source
    'copy:test',         // Static test content (HTML, etc...)
    'connect:test',
    'mocha_phantomjs',

    'watch'
  ]);

  // builds development version of library
  grunt.registerTask('dev', [
    'jshint:dev',
    'browserify:index',
    'browserify:observation',
    'browserify:plot',
    'browserify:useradmin',
    'postcss',
    'copy:dev'
  ]);

  // starts distribution server and preview
  grunt.registerTask('dist', [
    'build',
    'configureProxies:dist',
    'connect:dist'
  ]);

  // runs tests against development version of library
  grunt.registerTask('test', [
    'dev',
    'jshint:test',
    'browserify:bundle', // All source files, one bundle, with aliases
    'browserify:test',   // Test bootstrap and source
    'copy:test',         // Static test content (HTML, etc...)
    'connect:test',
    'mocha_phantomjs'
  ]);
};
