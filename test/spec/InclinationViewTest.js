/*global sinon, chai, describe, it*/
'use strict';

var Format = require('geomag/Formatter'),
    InclinationView = require('geomag/InclinationView'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Observation = require('geomag/Observation'),
    Reading = require('geomag/Reading'),
    Util = require('util/Util');


var expect = chai.expect;

// dummy ObservationBaselineCalculator for testing
var testObservationBaselineCalculator = Util.extend(Model(), {
  inclination: function() { return 1; },
  horizontalComponent: function () { return 2; },
  verticalComponent: function () { return 3; },
  southDownMinusNorthUp: function () { return 4; },
  northDownMinusSouthUp: function () { return 5; }
});


describe('Unit tests for InclinationView class', function () {

  it('can be "require"d', function () {
    /*jshint -W030*/
    expect(InclinationView).to.not.be.undefined;
    /*jshint +W030*/
  });

  describe('Initialize', function () {
    var i = 0,
        len = 0,
        reading = Reading(),
        measurements = reading.getMeasurements(),
        observation = Observation(),
        view;

    view = InclinationView({
      reading: reading,
      observation: observation,
      baselineCalculator: testObservationBaselineCalculator
    });

    it('binds measurement change to render', function () {
      var spy = sinon.spy(view, 'render');

      var testmeasurements = [
          measurements[Measurement.SOUTH_DOWN][0],
          measurements[Measurement.NORTH_UP][0],
          measurements[Measurement.SOUTH_UP][0],
          measurements[Measurement.NORTH_DOWN][0]
      ];

      for (i = 0, len = testmeasurements.length; i < len; i++){
        testmeasurements[i].trigger('change');
        expect(spy.callCount).to.equal(i+1);
      }
    });
  });

  describe('Render', function () {

    it('updates view elements', function () {
      var calculator = testObservationBaselineCalculator,
          view;

      view = InclinationView({
        reading: Reading(),
        observation: Observation(),
        baselineCalculator: calculator
      });

      expect(view._inclinationAngle.innerHTML).to.equal(
          Format.degreesAndDegreesMinutes(calculator.inclination()));
      expect(view._horizontalComponent.textContent).to.equal(
          calculator.horizontalComponent().toFixed(3) + 'nT');
      expect(view._verticalComponent.textContent).to.equal(
          calculator.verticalComponent().toFixed(3) + 'nT');

      expect(view._southDownMinusNorthUp.textContent).to.equal(
          (calculator.southDownMinusNorthUp()*60).toFixed(3) + '\'');
      expect(view._northDownMinusSouthUp.textContent).to.equal(
          (calculator.northDownMinusSouthUp()*60).toFixed(3) + '\'');
    });

  });

});
