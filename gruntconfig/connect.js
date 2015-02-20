'use strict';

var config = require('./config');

var connect = {
  proxies: [{
    context: '/map',
    host: 'geomag.usgs.gov',
    port: 80,
    https: false,
    changeOrigin: true,
    xforward: false
  }],
  rules: [
    {
      from: '^/theme/(.*)$',
      to: '/hazdev-template/dist/htdocs/$1'
    },
    {
      from: '^/webabsolutes/(.*)$',
      to: '/$1'
    },
    {
      from: '^/observation/(.*)$',
      to: '/observation.php?id=$1'
    },
    {
      from: '^/observatory/(.*)$',
      to: '/index.php?id=$1'
    }
  ],

  options: {
    hostname: '*'
  },
  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs'
      ],
      livereload: true,
      open: 'http://localhost:8000/index.php',
      port: 8000
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.build + '/' + config.test,
        'node_modules'
      ],
      open: 'http://localhost:8001/test.html',
      port: 8001
    }
  },
  dist: {
    options: {
      base: [
        config.dist + '/htdocs'
      ],
      keepalive: true,
      livereload: true,
      open: 'http://localhost:8002/index.php',
      port: 8002
    }
  }
};

module.exports = connect;
