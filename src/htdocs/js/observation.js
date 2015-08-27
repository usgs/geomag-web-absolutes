/* global observationId, REALTIME_DATA_URL */
'use strict';

var Calculator = require('geomag/ObservationBaselineCalculator'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    ObservationView = require('geomag/ObservationView'),
    RealtimeDataFactory = require('geomag/RealtimeDataFactory');


var calculator = Calculator();

ObservationView({
  calculator: calculator,
  el: document.querySelector('.observation-view-wrapper'),
  factory: ObservatoryFactory({
    calculator: calculator
  }),
  observationId: observationId,
  realtimeDataFactory: RealtimeDataFactory({
    url: REALTIME_DATA_URL
  })
});
