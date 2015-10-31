'use strict';

var config = require('./config');


var watch = {
  scripts: {
    files: [
      config.src + '/htdocs/js/**/*.js',
      config.test + '/**/*.js'
    ],
    tasks: [
      'jshint:dev',
      'browserify',
      'mocha_phantomjs'
    ]
  },

  test: {
    files: [
      config.test + '/**/*.js',
    ],
    tasks: [
      'jshint:test',
      'browserify:bundle', // All source files, one bundle, with aliases
      'browserify:test'    // Test bootstrap and source
    ]
  },

  php: {
    files: [
      config.src + '/**/*.php'
    ],
    tasks: [
      'copy:dev'
    ]
  },

  html: {
    files: [
      config.test + '/*.html'
    ],
    tasks: [
      'copy:test'
    ]
  },

  scss: {
    files: [
      config.src + '/**/*.scss'
    ],
    tasks: [
      'postcss'
    ]
  },

  reload: {
    files: [
      config.build + '/**/*'
    ],
    options: {
      livereload: config.livereloadPort
    }
  },

  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: [
      'jshint:gruntfile'
    ]
  }
};


module.exports = watch;
