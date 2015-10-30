'use strict';

var config = require('./config');

var gateway = require('gateway'),
    proxyMiddleware = require('grunt-connect-proxy/lib/utils').proxyRequest,
    rewriteModule = require('http-rewrite-middleware');

// var iniConfig = require('ini').parse(require('fs')
//     .readFileSync('./src/conf/config.ini', 'utf-8'));

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

var mountPHP = function (dir, options) {
  options = options || {
    '.php': 'php-cgi',
    'env': {
      'PHPRC': process.cwd() + '/node_modules/hazdev-template/dist/conf/php.ini'
    }
  };

  return gateway(require('path').resolve(dir), options);
};

var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      changeOrigin: true,
      context: '/map',
      host: 'geomag.usgs.gov',
      https: false,
      port: 80,
      xforward: false
    }
  ],

  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        'node_modules'
      ],
      livereload: true,
      middleware: function (connect, options) {
        var middlewares,
            paths = options.base,
            path,
            rewriteMiddleware;

        rewriteMiddleware = rewriteModule.getMiddleware(rewrites);
        middlewares = [proxyMiddleware, rewriteMiddleware, corsMiddleware];

        for (var i = 0; i < paths.length; i++) {
          path = paths[i];
          middlewares.push(mountPHP(path));
          middlewares.push(connect.static(path));
        }

        return middlewares;
      },
      open: 'http://localhost:' + config.buildPort + '/index.php',
      port: config.buildPort
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src + '/htdocs',
        'node_modules'
      ],
      middleware: function (connect, options) {
        var middlewares = [],
            paths = options.base,
            path;

        for (var i = 0; i < paths.length; i++) {
          path = paths[i];
          middlewares.push(mountPHP(path));
          middlewares.push(connect.static(path));
        }

        return middlewares;
      },
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  },

  dist: {
    options: {
      base: [
        config.dist + '/htdocs',
        'node_modules'
      ],
      keepalive: true,
      livereload: true,
      middleware: function (connect, options) {
        var middlewares,
            paths = options.base,
            path,
            rewriteMiddleware;

        rewriteMiddleware = rewriteModule.getMiddleware(rewrites);
        middlewares = [proxyMiddleware, rewriteMiddleware, corsMiddleware];

        for (var i = 0; i < paths.length; i++) {
          path = paths[i];
          middlewares.push(mountPHP(path));
          middlewares.push(connect.static(path));
        }

        return middlewares;
      },
      open: 'http://localhost:' + config.distPort + '/index.php',
      port: config.distPort
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      middleware: function (connect, options, middlewares) {
        middlewares.unshift(mountPHP(options.base[0]));
        return middlewares;
      },
      port: config.templatePort
    }
  }
};


module.exports = connect;
