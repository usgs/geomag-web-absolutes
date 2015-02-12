'use strict';

var config = require('./config');

// Modules defined by this (geomag-baseline-calculator) package
var EXPORTS = [
  'baselinecalculator/htdocs/js/geomag/BaselineCalculator',
  'baselinecalculator/htdocs/js/geomag/DeclinationSummaryView',
  'baselinecalculator/htdocs/js/geomag/DeclinationView',
  'baselinecalculator/htdocs/js/geomag/Formatter',
  'baselinecalculator/htdocs/js/geomag/HorizontalIntensitySummaryView',
  'baselinecalculator/htdocs/js/geomag/InclinationView',
  'baselinecalculator/htdocs/js/geomag/Instrument',
  'baselinecalculator/htdocs/js/geomag/MagnetometerOrdinatesView',
  'baselinecalculator/htdocs/js/geomag/Mark',
  'baselinecalculator/htdocs/js/geomag/Measurement',
  'baselinecalculator/htdocs/js/geomag/MeasurementView',
  'baselinecalculator/htdocs/js/geomag/Observation',
  'baselinecalculator/htdocs/js/geomag/ObservationBaselineCalculator',
  'baselinecalculator/htdocs/js/geomag/ObservationMetaView',
  'baselinecalculator/htdocs/js/geomag/ObservationSummaryView',
  'baselinecalculator/htdocs/js/geomag/ObservationsView',
  'baselinecalculator/htdocs/js/geomag/ObservationView',
  'baselinecalculator/htdocs/js/geomag/Pier',
  'baselinecalculator/htdocs/js/geomag/Reading',
  'baselinecalculator/htdocs/js/geomag/ReadingGroupView',
  'baselinecalculator/htdocs/js/geomag/ReadingView',
  'baselinecalculator/htdocs/js/geomag/RealtimeData',
  'baselinecalculator/htdocs/js/geomag/RealtimeDataFactory',
  'baselinecalculator/htdocs/js/geomag/User',
  'baselinecalculator/htdocs/js/geomag/UserAdminView',
  'baselinecalculator/htdocs/js/geomag/UserEditView',
  'baselinecalculator/htdocs/js/geomag/UserFactory',
  'baselinecalculator/htdocs/js/geomag/UsersView',
  'baselinecalculator/htdocs/js/geomag/Validate',
  'baselinecalculator/htdocs/js/geomag/VerticalIntensitySummaryView'
];


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src,
        process.cwd() + '/node_modules/hazdev-tablist/src/tablist',
        process.cwd() + '/node_modules/hazdev-webutils/src'
      ]
    }
  },

  source: {
    src: [],
    dest: config.build + '/' + config.src + '/geomag-baseline-calculator.js',
    options: {
      alias: EXPORTS.map(function (path) {
        return './' + config.src + '/' + path + '.js:' + path;
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
