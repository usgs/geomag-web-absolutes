'use strict';

var config = require('./config');

// Modules defined by this (geomag-baseline-calculator) package
var EXPORTS = [
  'geomag/BaselineCalculator',
  'geomag/DeclinationSummaryView',
  'geomag/DeclinationView',
  'geomag/Formatter',
  'geomag/HorizontalIntensitySummaryView',
  'geomag/InclinationView',
  'geomag/Instrument',
  'geomag/MagnetometerOrdinatesView',
  'geomag/Mark',
  'geomag/Measurement',
  'geomag/MeasurementView',
  'geomag/Observation',
  'geomag/ObservationBaselineCalculator',
  'geomag/ObservationMetaView',
  'geomag/ObservationSummaryView',
  'geomag/ObservationsView',
  'geomag/ObservationView',
  'geomag/Pier',
  'geomag/Reading',
  'geomag/ReadingGroupView',
  'geomag/ReadingView',
  'geomag/RealtimeData',
  'geomag/RealtimeDataFactory',
  'geomag/User',
  'geomag/UserAdminView',
  'geomag/UserEditView',
  'geomag/UserFactory',
  'geomag/UsersView',
  'geomag/Validate',
  'geomag/VerticalIntensitySummaryView'
];


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src + '/htdocs/js',
        process.cwd() + '/node_modules/hazdev-tablist/src',
        process.cwd() + '/node_modules/hazdev-webutils/src'
      ]
    }
  },

  index: {
    src: [config.src + '/htdocs/js/index.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/index.js'
  },

  observation: {
    src: [config.src + '/htdocs/js/observation.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/observation.js'
  },

  useradmin: {
    src: [config.src + '/htdocs/js/useradmin.js'],
    dest: config.build + '/' + config.src + '/htdocs/js/useradmin.js'
  },

  source: {
    src: [],
    dest: config.build + '/' + config.test + '/geomag-baseline-calculator.js',
    options: {
      alias: EXPORTS.map(function (path) {
        return './' + config.src + '/htdocs/js/' + path + '.js:' + path;
      })
    }
  },

  test: {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: EXPORTS
    }
  }
};

module.exports = browserify;
