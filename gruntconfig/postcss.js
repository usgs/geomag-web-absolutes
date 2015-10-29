'use strict';

var autoprefixer = require('autoprefixer'),
    calc = require('postcss-calc'),
    cssnano = require('cssnano'),
    precss = require('precss');

var config = require('./config');


var postcss = {
  build: {
    cwd: config.src + '/htdocs',
    dest: config.build + '/' + config.src + '/htdocs',
    expand: true,
    ext: '.css',
    options: {
      processors: [
        precss(),
        calc(),
        autoprefixer({'browsers': 'last 3 versions'})
      ]
    },
    src: [
      '**/*.scss',
      '!**/_*.scss'
    ]
  },

  dist: {
    cwd: config.build + '/' + config.src + '/htdocs',
    dest: config.dist + '/htdocs',
    expand: true,
    options: {
      processors: [
        cssnano({zindex: false})
      ]
    },
    src: [
      '**/*.css'
    ]
  }
};


module.exports = postcss;
