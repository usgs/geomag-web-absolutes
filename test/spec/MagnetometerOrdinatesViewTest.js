/*global chai, sinon, describe, it, beforeEach, afterEach */
'use strict';

var Format = require('geomag/Formatter'),
    MagnetometerOrdinatesView = require('geomag/MagnetometerOrdinatesView'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Observation = require('geomag/Observation'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    Reading = require('geomag/Reading'),
    Util = require('util/Util');


var expect = chai.expect;

describe('Unit tests for MagnetometerOrdinatesView', function () {

  describe('View', function () {
    var renderSpy,
        reading,
        calculator,
        view,
        observation,
        readingMeasurements,
        measurements;

    beforeEach(function () {
      renderSpy = sinon.spy(MagnetometerOrdinatesView.prototype, 'render');
      reading = Reading();
      observation = Observation();
      calculator = ObservationBaselineCalculator();

      view = MagnetometerOrdinatesView({
        reading: reading,
        observation: observation,
        baselineCalculator: calculator
      });

      readingMeasurements = view._reading.getMeasurements();
      measurements = [
        readingMeasurements[Measurement.WEST_DOWN][0],
        readingMeasurements[Measurement.EAST_DOWN][0],
        readingMeasurements[Measurement.WEST_UP][0],
        readingMeasurements[Measurement.EAST_UP][0],
        readingMeasurements[Measurement.SOUTH_DOWN][0],
        readingMeasurements[Measurement.NORTH_UP][0],
        readingMeasurements[Measurement.SOUTH_UP][0],
        readingMeasurements[Measurement.NORTH_DOWN][0]
      ];
    });

    afterEach(function () {
      renderSpy.restore();
      reading = null;
      view = null;
      observation = null;
      calculator = null;
    });

    it('should render when measurement changes', function () {
      var i = null,
          len = null;

      for (i = 0, len = measurements.length; i < len; i++) {
        measurements[i].trigger('change');
        // +2 because view renders during instantiation and loop
        // index starts at 0
        expect(renderSpy.callCount).to.equal(i+2);
      }
    });

    it('should render when calculator changes', function () {
      calculator.trigger('change');
      expect(renderSpy.callCount).to.equal(2);
    });
  });

  describe('Values', function () {
    var reading,
        calculator,
        view,
        observation;

    function format4 (number) {return number.toFixed(4);}

    calculator = ObservationBaselineCalculator();

    //Stub function in ObservationBaselineCalculator.
    sinon.stub(calculator,
        'meanH', function () {return 1;});
    sinon.stub(calculator,
        'meanE', function () {return 2;});
    sinon.stub(calculator,
        'dComputed', function () {return 2;});
    sinon.stub(calculator,
        'meanZ', function () {return 3;});
    sinon.stub(calculator,
        'meanF', function () {return 4;});

    sinon.stub(calculator,
        'horizontalComponent', function () {return 5;});
    sinon.stub(calculator,
        'magneticDeclination', function () {return 6;});
    sinon.stub(calculator,
        'verticalComponent', function () {return 7;});
    sinon.stub(calculator,
        'fCorrected', function () {return 8;});

    sinon.stub(calculator,
        'hBaseline', function () {return 9;});
    sinon.stub(calculator,
        'eBaseline', function () {return 10;});
    sinon.stub(calculator,
        'dBaseline', function () {return 11;});
    sinon.stub(calculator,
        'zBaseline', function () {return 12;});
    sinon.stub(calculator,
        'scaleValue', function () {return 14;});

    reading = Reading();
    observation = Observation();

    view = MagnetometerOrdinatesView({
      reading: reading,
      observation: observation,
      baselineCalculator: calculator
    });

    it('updates view elements for hMean', function () {
      expect(view._hMean.innerHTML).to.equal(Format.nanoteslas(1));
    });
    it('updates view elements for eMean', function () {
      expect(view._eMean.innerHTML).to.equal(Format.nanoteslas(2));
    });
    it('updates view elements for dMean', function () {
      expect(view._dMean.innerHTML).to.equal(Format.minutes(2*60));
    });
    it('updates view elements for zMean', function () {
      expect(view._zMean.innerHTML).to.equal(Format.nanoteslas(3));
    });
    it('updates view elements for fMean', function () {
      expect(view._fMean.innerHTML).to.equal(Format.nanoteslas(4));
    });

    it('updates view elements for absoluteH', function () {
      expect(view._absoluteH.innerHTML).to.equal(Format.nanoteslas(5));
    });
    it('updates view elements for absoluteD', function () {
      expect(view._absoluteD.innerHTML).to.equal(Format.minutes(6*60));
    });
    it('updates view elements for absoluteZ', function () {
      expect(view._absoluteZ.innerHTML).to.equal(Format.nanoteslas(7));
    });
    it('updates view elements for absoluteF', function () {
      expect(view._absoluteF.innerHTML).to.equal(Format.nanoteslas(8));
    });

    it('updates view elements for hBaseline', function () {
      expect(view._hBaseline.innerHTML).to.equal(Format.nanoteslas(9));
    });
    it('updates view elements for eBaseline', function () {
      expect(view._eBaseline.innerHTML).to.equal(Format.nanoteslas(10));
    });
    it('updates view elements for dBaseline', function () {
      expect(view._dBaseline.innerHTML).to.equal(Format.minutes(11*60));
    });
    it('updates view elements for zBaseline', function () {
      expect(view._zBaseline.innerHTML).to.equal(Format.nanoteslas(12));
    });

    it('updates view elements for scaleValue', function () {
      expect(view._scaleValue.textContent).to.equal(
        'Ordinate Mean D is calculated using ' +
        '(Corrected F * scaleValue / 60), where scaleValue = ' +
        format4(14));
    });

    calculator.meanH.restore();
    calculator.meanE.restore();
    calculator.dComputed.restore();
    calculator.meanZ.restore();
    calculator.meanF.restore();
    calculator.horizontalComponent.restore();
    calculator.magneticDeclination.restore();
    calculator.verticalComponent.restore();
    calculator.fCorrected.restore();
    calculator.hBaseline.restore();
    calculator.dBaseline.restore();
    calculator.eBaseline.restore();
    calculator.zBaseline.restore();
    calculator.scaleValue.restore();
  });

});
