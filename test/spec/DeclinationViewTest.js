/*global sinon, chai, describe, it*/
'use strict';

var DeclinationView = require('geomag/DeclinationView'),
    Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Observation = require('geomag/Observation'),
    Reading = require('geomag/Reading'),
    Util = require('util/Util');


var expect = chai.expect;

// dummy ObservationBaselineCalculator for testing
var testObservationBaselineCalculator = Util.extend(Model(), {
  magneticSouthMeridian: function() { return 1; },
  meanMark: function () { return 2; },
  magneticAzimuthMark: function () { return 3; },
  trueAzimuthOfMark: function () { return 4; },
  magneticDeclination: function () { return 5; },
  westUpMinusEastDown: function () { return 6; },
  eastUpMinusWestDown: function () { return 7; },
  meanF: function () { return 8; },
  pierCorrection: function () { return 9; },
  correctedF: function() { return 10; }
});

describe('Unit tests for DeclinationView class', function () {

  it('can be "require"d', function () {
    /*jshint -W030*/
    expect(DeclinationView).to.not.be.undefined;
    /*jshint +W030*/
  });

  describe('Initialize', function () {
    var i = 0,
        len = 0,
        reading = Reading(),
        measurements = reading.getMeasurements(),
        observation = Observation(),
        view;

    view = DeclinationView({
      reading: reading,
      observation: observation,
      baselineCalculator: testObservationBaselineCalculator
    });

    it('binds measurement change to render', function () {
      var spy = sinon.spy(view, 'render');

      var testmeasurements = [
          measurements[Measurement.FIRST_MARK_UP][0],
          measurements[Measurement.FIRST_MARK_DOWN][0],
          measurements[Measurement.WEST_DOWN][0],
          measurements[Measurement.EAST_DOWN][0],
          measurements[Measurement.WEST_UP][0],
          measurements[Measurement.EAST_UP][0],
          measurements[Measurement.SECOND_MARK_UP][0],
          measurements[Measurement.SECOND_MARK_DOWN][0]
      ];

      for (i = 0, len = testmeasurements.length; i < len; i++){
        testmeasurements[i].trigger('change');
        expect(spy.callCount).to.equal(i+1);
      }
    });

    // it('binds calculator change to render', function () {
    //   view.called = false;
    //   testObservationBaselineCalculator.trigger('change');
    //   expect(view.called).to.equal(true);
    // });

  });

  describe('Render', function () {
    var calculator = testObservationBaselineCalculator,
          view;

    it('updates view elements', function () {
      view = DeclinationView({
        reading: Reading(),
        observation: Observation(),
        baselineCalculator: calculator
      });

      // These are equal, this is probably bs.
      expect(view._magneticSouthMeridian.innerHTML).to.equal(
          Format.degreesAndDegreesMinutes(
              calculator.magneticSouthMeridian()));
      expect(view._meanMark.textContent).to.equal(
          Format.roundHalfToEven(calculator.meanMark(),3) + '°');
      expect(view._magneticAzimuthOfMark.textContent).to.equal(
          Format.roundHalfToEven(
              calculator.magneticAzimuthMark(),3) + '°');
      expect(view._trueAzimuthOfMark.textContent).to.equal('' +
          calculator.trueAzimuthOfMark() + '°');
      expect(view._magneticDeclination.innerHTML).to.equal(
          Format.degreesAndDegreesMinutes(
              calculator.magneticDeclination()));
      expect(view._westUpMinusEastDown.textContent).to.equal(
          Format.roundHalfToEven(
            (calculator.westUpMinusEastDown()*60),3) + '\'');
      expect(view._eastUpMinusWestDown.textContent).to.equal(
          Format.roundHalfToEven(
          (calculator.eastUpMinusWestDown()*60),3) + '\'');
    });

  });

});
