'use strict';

var config = require('./config');

var compass = {
  options: {
    environment: 'development',
    cssDir: config.build + '/' + config.src + '/htdocs/css',
    sassDir: config.src + '/htdocs/css'
  },

  index: {
    options: {
      specify: [config.src + '/htdocs/css/index.scss']
    }
  },

  login: {
    options: {
      specify: [config.src + '/htdocs/css/login.scss']
    }
  },

  observation: {
    options: {
      specify: [config.src + '/htdocs/css/observation.scss']
    }
  },

  useradmin: {
    options: {
      specify: [config.src + '/htdocs/css/useradmin.scss']
    }
  }
};

module.exports = compass;
