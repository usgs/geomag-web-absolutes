'use strict';

var config = require('./config');

var gateway = require('gateway'),
    proxyMiddleware = require('grunt-connect-proxy/lib/utils').proxyRequest,
    rewriteModule = require('http-rewrite-middleware');

var rewrites = [
  // Template
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
];


// middleware to send CORS headers
var corsMiddleware = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'accept,origin,authorization,content-type');
  return next();
};

var addMiddleware = function (connect, options, middlewares) {
  middlewares.unshift(
    proxyMiddleware,
    rewriteModule.getMiddleware(rewrites),
    corsMiddleware,
    gateway(options.base[0], {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    })
  );
  return middlewares;
};


var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/map',
      headers: {
        host: 'geomag.usgs.gov'
      },
      host: 'geomag.usgs.gov',
      port: 80
    }
  ],

  build: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        'node_modules'
      ],
      livereload: config.livereloadPort,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.buildPort + '/index.php',
      port: config.buildPort
    }
  },

  dist: {
    options: {
      base: [
        config.dist + '/htdocs',
        'node_modules'
      ],
      keepalive: true,
      livereload: config.livereloadPort,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.distPort + '/index.php',
      port: config.distPort
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        config.build + '/' + config.test,
        'node_modules'
      ],
      middleware: addMiddleware,
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  },


  template: {
    options: {
      base: [
        'node_modules/hazdev-template/dist/htdocs'
      ],
      middleware: addMiddleware,
      port: config.templatePort
    }
  }
};


module.exports = connect;
