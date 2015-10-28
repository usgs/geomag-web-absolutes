'use strict';


var config = {
  browserify: require('./browserify'),
  clean: require('./clean'),
  concurrent: require('./concurrent'),
  connect: require('./connect'),
  copy: require('./copy'),
  jshint: require('./jshint'),
  postcss: require('./postcss'),
  uglify: require('./uglify'),
  watch: require('./watch'),
  mocha_phantomjs: require('./mocha_phantomjs'),

  tasks: [
    'grunt-browserify',
    'grunt-concurrent',
    'grunt-connect-proxy',
    'grunt-contrib-clean',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-mocha-phantomjs',
    'grunt-postcss'
  ]
};


module.exports = config;
