/* global chai, sinon, describe, it, beforeEach, afterEach */
'use strict';

var Observation = require('geomag/Observation'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    ObservationSummaryView = require('geomag/ObservationSummaryView');


var expect = chai.expect;

describe('ObservationSummaryViewTest', function () {
  var renderSpy,
      calculator,
      view,
      observation;

  beforeEach(function () {
    renderSpy = sinon.spy(ObservationSummaryView.prototype, 'render');
    calculator = ObservationBaselineCalculator();
    observation = Observation();
    view = ObservationSummaryView({
      baselineCalculator: calculator,
      observation: observation
    });
  });

  afterEach(function () {
    renderSpy.restore();
    view = null;
    calculator = null;
    observation = null;
  });

  describe('Proper event bindings', function () {
    it('should render when Pier temp changes', function () {
      observation.set({'pier_temperature':40});
      var pierTemperature =
          view.el.querySelector('.pier-temp-value').innerHTML;

      expect(pierTemperature).to.equal(
          '<span class="temperature">' +
            '40.0<span class="units">°C</span>' +
          '</span>');
    });

    it('should render when annotation changes', function () {
      observation.set({'annotation':'This is an annotation test'});
      var annotation =
          view.el.querySelector('.reviewer > textarea').innerHTML;

      expect(annotation).to.equal('This is an annotation test');
    });

    it('should render when measurement changes', function () {
      var changeCount = 1;

      observation.eachMeasurement(function (measurement) {
        measurement.trigger('change');
        expect(renderSpy.callCount).to.equal(++changeCount);
      });
    });

    it('should render when calculator changes', function () {
      calculator.trigger('change');
      expect(renderSpy.callCount).to.equal(2);
    });
  });
});
