/* global chai, sinon, describe, it, beforeEach, afterEach, observationId, REALTIME_DATA_URL */
'use strict';

var Observation = require('geomag/Observation'),
    ObservationView = require('geomag/ObservationView'),
    RealtimeDataFactory = require('geomag/RealtimeDataFactory');


var expect = chai.expect;

describe('ObservationViewTest', function () {
  var renderSpy,
      view,
      observation;

  beforeEach(function () {
    observation = Observation();
    view = ObservationView({
      el: document.querySelector('.observation-view-wrapper'),
      observationId: observationId,
      realtimeDataFactory: RealtimeDataFactory({
        url: REALTIME_DATA_URL
      })
    });

    renderSpy = sinon.spy(view, 'render');
  });

  afterEach(function () {
    renderSpy.restore();
    view = null;
    observation = null;
  });

  describe('Proper event bindings', function () {

    it('should render when annotation changes', function () {
      observation.set({'annotation':'This is an annotation test'});
      var annotation =
          view.el.querySelector('.annotation > textarea').innerHTML;

      expect(annotation).to.equal('This is an annotation test');
    });

  });

});
