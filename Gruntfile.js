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
    'cssmin',
    'uglify'
  ]);

  // default task useful during development
  grunt.registerTask('default', [
    'jshint:dev',
    'concurrent:dev',
    'connect:dev',

    'jshint:test',
    'concurrent:test',
    'connect:test',
    'mocha_phantomjs',
    
    'watch'
  ]);

  // builds development version of library
  grunt.registerTask('dev', [
    'jshint:dev',
    'concurrent:dev',
  ]);

  // starts distribution server and preview
  grunt.registerTask('dist', [
    'build',
    'connect:dist'
  ]);

  // runs tests against development version of library
  grunt.registerTask('test', [
    'dev',
    'jshint:test',
    'concurrent:test',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
