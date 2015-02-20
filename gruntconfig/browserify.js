'use strict';

var config = require('./config'),
    cwd = process.cwd();

// Modules defined by this (geomag-baseline-calculator) package
var EXPORTS = [
  './' + config.src + '/htdocs/js/geomag/BaselineCalculator.js:geomag/BaselineCalculator',
  './' + config.src + '/htdocs/js/geomag/DeclinationSummaryView.js:geomag/DeclinationSummaryView',
  './' + config.src + '/htdocs/js/geomag/DeclinationView.js:geomag/DeclinationView',
  './' + config.src + '/htdocs/js/geomag/Formatter.js:geomag/Formatter',
  './' + config.src + '/htdocs/js/geomag/HorizontalIntensitySummaryView.js:geomag/HorizontalIntensitySummaryView',
  './' + config.src + '/htdocs/js/geomag/InclinationView.js:geomag/InclinationView',
  './' + config.src + '/htdocs/js/geomag/Instrument.js:geomag/Instrument',
  './' + config.src + '/htdocs/js/geomag/MagnetometerOrdinatesView.js:geomag/MagnetometerOrdinatesView',
  './' + config.src + '/htdocs/js/geomag/Mark.js:geomag/Mark',
  './' + config.src + '/htdocs/js/geomag/Measurement.js:geomag/Measurement',
  './' + config.src + '/htdocs/js/geomag/MeasurementView.js:geomag/MeasurementView',
  './' + config.src + '/htdocs/js/geomag/Observation.js:geomag/Observation',
  './' + config.src + '/htdocs/js/geomag/ObservationBaselineCalculator.js:geomag/ObservationBaselineCalculator',
  './' + config.src + '/htdocs/js/geomag/ObservationMetaView.js:geomag/ObservationMetaView',
  './' + config.src + '/htdocs/js/geomag/ObservationSummaryView.js:geomag/ObservationSummaryView',
  './' + config.src + '/htdocs/js/geomag/ObservationsView.js:geomag/ObservationsView',
  './' + config.src + '/htdocs/js/geomag/ObservationView.js:geomag/ObservationView',
  './' + config.src + '/htdocs/js/geomag/Pier.js:geomag/Pier',
  './' + config.src + '/htdocs/js/geomag/Reading.js:geomag/Reading',
  './' + config.src + '/htdocs/js/geomag/ReadingGroupView.js:geomag/ReadingGroupView',
  './' + config.src + '/htdocs/js/geomag/ReadingView.js:geomag/ReadingView',
  './' + config.src + '/htdocs/js/geomag/RealtimeData.js:geomag/RealtimeData',
  './' + config.src + '/htdocs/js/geomag/RealtimeDataFactory.js:geomag/RealtimeDataFactory',
  './' + config.src + '/htdocs/js/geomag/User.js:geomag/User',
  './' + config.src + '/htdocs/js/geomag/UserAdminView.js:geomag/UserAdminView',
  './' + config.src + '/htdocs/js/geomag/UserEditView.js:geomag/UserEditView',
  './' + config.src + '/htdocs/js/geomag/UserFactory.js:geomag/UserFactory',
  './' + config.src + '/htdocs/js/geomag/UsersView.js:geomag/UsersView',
  './' + config.src + '/htdocs/js/geomag/Validate.js:geomag/Validate',
  './' + config.src + '/htdocs/js/geomag/VerticalIntensitySummaryView.js:geomag/VerticalIntensitySummaryView',

  './node_modules/hazdev-webutils/src/util/Xhr.js:util/Xhr'
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
      alias: EXPORTS
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
