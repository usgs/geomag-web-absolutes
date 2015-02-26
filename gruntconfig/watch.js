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
      'concurrent:browserify',
      'concurrent:test',
      'mocha_phantomjs'
    ]
  },
  test: {
    files: [
      config.test + '/**/*.js',
    ],
    tasks: [
      'jshint:test',
      'concurrent:test',
    ]
  },

  php: {
    files: [
      config.src + '/**/*.php'
    ],
    tasks: [
      'concurrent:copy'
    ]
  },
  html: {
    files: [
      config.test + '/*.html'
    ],
    tasks: [
      'concurrent:copytest'
    ]
  },

  scss: {
    files: [
      config.src + '/htdocs/css/**/*.scss'
    ],
    tasks: [
      'concurrent:compass'
    ]
  },

  reload: {
    files: [
      config.build + '/**/*'
    ],
    options: {
      livereload: true
    }
  },

  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: ['jshint:gruntfile']
  }
};

module.exports = watch;
