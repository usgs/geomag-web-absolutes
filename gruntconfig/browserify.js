'use strict';

var config = require('./config'),
    srcDir = './' + config.src + '/htdocs/js/';

// Modules defined by this (geomag-baseline-calculator) package
var EXPORTS = [
  srcDir + 'geomag/BaselineCalculator.js:geomag/BaselineCalculator',
  srcDir + 'geomag/DeclinationSummaryView.js:geomag/DeclinationSummaryView',
  srcDir + 'geomag/DeclinationView.js:geomag/DeclinationView',
  srcDir + 'geomag/Formatter.js:geomag/Formatter',
  srcDir + 'geomag/HorizontalIntensitySummaryView.js:geomag/HorizontalIntensitySummaryView',
  srcDir + 'geomag/InclinationView.js:geomag/InclinationView',
  srcDir + 'geomag/Instrument.js:geomag/Instrument',
  srcDir + 'geomag/MagnetometerOrdinatesView.js:geomag/MagnetometerOrdinatesView',
  srcDir + 'geomag/Mark.js:geomag/Mark',
  srcDir + 'geomag/Measurement.js:geomag/Measurement',
  srcDir + 'geomag/MeasurementView.js:geomag/MeasurementView',
  srcDir + 'geomag/Observation.js:geomag/Observation',
  srcDir + 'geomag/ObservationBaselineCalculator.js:geomag/ObservationBaselineCalculator',
  srcDir + 'geomag/ObservationMetaView.js:geomag/ObservationMetaView',
  srcDir + 'geomag/ObservationSummaryView.js:geomag/ObservationSummaryView',
  srcDir + 'geomag/ObservationsView.js:geomag/ObservationsView',
  srcDir + 'geomag/ObservationView.js:geomag/ObservationView',
  srcDir + 'geomag/Pier.js:geomag/Pier',
  srcDir + 'geomag/Reading.js:geomag/Reading',
  srcDir + 'geomag/ReadingGroupView.js:geomag/ReadingGroupView',
  srcDir + 'geomag/ReadingView.js:geomag/ReadingView',
  srcDir + 'geomag/RealtimeData.js:geomag/RealtimeData',
  srcDir + 'geomag/RealtimeDataFactory.js:geomag/RealtimeDataFactory',
  srcDir + 'geomag/User.js:geomag/User',
  srcDir + 'geomag/UserAdminView.js:geomag/UserAdminView',
  srcDir + 'geomag/UserEditView.js:geomag/UserEditView',
  srcDir + 'geomag/UserFactory.js:geomag/UserFactory',
  srcDir + 'geomag/UsersView.js:geomag/UsersView',
  srcDir + 'geomag/Validate.js:geomag/Validate',
  srcDir + 'geomag/VerticalIntensitySummaryView.js:geomag/VerticalIntensitySummaryView',

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


  bundle: {
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
