/*global define*/
/*global describe*/
/*global it*/
define([
  'chai',
  'mvc/Model',
  'util/Util',

  'geomag/DeclinationView',
  'geomag/Formatter',
  'geomag/Measurement',
  'geomag/Observation',
  'geomag/Reading'
], function (
  chai,
  Model,
  Util,

  DeclinationView,
  Format,
  Measurement,
  Observation,
  Reading
) {
  'use strict';


  var expect = chai.expect;

  // dummy ObservationBaselineCalculator for testing
  var testObservationBaselineCalculator = Util.extend(new Model(), {
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

  // dummy Declination View that tracks whether its
  // render method has been called
  var TestDeclinationView = function (options) {
    this.called = false;
    DeclinationView.call(this, options);
  };
  TestDeclinationView.prototype = Object.create(DeclinationView.prototype);
  TestDeclinationView.prototype.render = function() {
    this.called = true;
  };

  var viewOptions = {
    reading: new Reading(),
    observation: new Observation(),
    baselineCalculator: testObservationBaselineCalculator
  };

  describe('Unit tests for DeclinationView class', function () {

    it('can be "require"d', function () {
      /*jshint -W030*/
      expect(DeclinationView).to.not.be.undefined;
      /*jshint +W030*/
    });

    it('can be instantiated', function () {
      var view = new DeclinationView({
        reading: new Reading(),
        baselineCalculator: testObservationBaselineCalculator
      });

      /*jshint -W030*/
      expect(view._options).to.not.be.undefined;
      expect(view._magneticSouthMeridian).to.not.be.undefined;
      expect(view._meanMark).to.not.be.undefined;
      expect(view._magneticAzimuthOfMark).to.not.be.undefined;
      expect(view._trueAzimuthOfMark).to.not.be.undefined;
      expect(view._magneticDeclination).to.not.be.undefined;
      expect(view._westUpMinusEastDown).to.not.be.undefined;
      expect(view._eastUpMinusWestDown).to.not.be.undefined;
      /*jshint +W030*/
    });

    describe('Constructor', function () {
      var m = new DeclinationView(viewOptions);

      it('should be an instance of a DeclinationView', function () {
        expect(m).to.be.an.instanceOf(DeclinationView);
      });

    });

    describe('Initialize', function () {
      var i = 0,
          len = 0,
          reading = new Reading(),
          measurements = reading.getMeasurements(),
          observation = new Observation(),
          view;

      view = new TestDeclinationView({
        reading: reading,
        observation: observation,
        baselineCalculator: testObservationBaselineCalculator
      });

      it('binds measurement change to render', function () {
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
          view.called = false;
          testmeasurements[i].trigger('change');
          expect(view.called).to.equal(true);
        }
      });

      it('binds calculator change to render', function () {
        view.called = false;
        testObservationBaselineCalculator.trigger('change');
        expect(view.called).to.equal(true);
      });

    });

    describe('Render', function () {
      var calculator = testObservationBaselineCalculator,
            view;

      it('updates view elements', function () {
        view = new DeclinationView({
          reading: new Reading(),
          observation: new Observation(),
          baselineCalculator: calculator
        });

        // These are equal, this is probably bs.
        expect(view._magneticSouthMeridian.innerHTML).to.equal(
            Format.degreesAndDegreesMinutes(
                calculator.magneticSouthMeridian()));
        expect(view._meanMark.textContent).to.equal(
            calculator.meanMark().toFixed(3) + '°');
        expect(view._magneticAzimuthOfMark.textContent).to.equal(
            calculator.magneticAzimuthMark().toFixed(3) + '°');
        expect(view._trueAzimuthOfMark.textContent).to.equal('' +
            calculator.trueAzimuthOfMark() + '°');
        expect(view._magneticDeclination.innerHTML).to.equal(
            Format.degreesAndDegreesMinutes(
                calculator.magneticDeclination()));

        expect(view._westUpMinusEastDown.textContent).to.equal(
            (calculator.westUpMinusEastDown()*60).toFixed(3) + '\'');
        expect(view._eastUpMinusWestDown.textContent).to.equal(
            (calculator.eastUpMinusWestDown()*60).toFixed(3) + '\'');
      });

    });

  });

});
