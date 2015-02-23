/* global observationId, REALTIME_DATA_URL */
'use strict';

var ObservationView = require('geomag/ObservationView'),
    RealtimeDataFactory = require('geomag/RealtimeDataFactory');


new ObservationView({
  el: document.querySelector('.observation-view-wrapper'),
  observationId: observationId,
  realtimeDataFactory: new RealtimeDataFactory({
    url: REALTIME_DATA_URL
  })
});
