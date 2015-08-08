/* global chai, sinon, describe, it, beforeEach, afterEach */
'use strict';

var DeclinationSummaryView = require('geomag/DeclinationSummaryView'),
    Calculator = require('geomag/ObservationBaselineCalculator'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Reading = require('geomag/Reading');


var expect = chai.expect;

var getClickEvent = function () {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
  return clickEvent;
};

var changeSelectValue = function (element, value) {
  var e = document.createEvent('HTMLEvents');

  e.initEvent('change', true, true);

  element.value = value;
  element.dispatchEvent(e);
};

describe('DeclinationSummaryViewTest', function () {

  describe('model bindings', function () {
    var renderSpy,
        reading,
        calculator,
        view,
        measurements,
        factory;

    beforeEach(function () {
      reading = Reading();
      calculator = Calculator();
      factory = ObservatoryFactory();
      view = DeclinationSummaryView({
        el: document.createElement('tr'),
        reading: reading,
        calculator: calculator,
        factory: factory
      });
      measurements = factory.getDeclinationMeasurements(reading);

      renderSpy = sinon.spy(view, 'render');
    });

    afterEach(function () {
      renderSpy.restore();
      reading = null;
      view = null;
      calculator = null;
      measurements = null;
      factory = null;
    });

    it('should render when measurement changes', function () {
      var i = null,
          len = null;

      for (i = 0, len = measurements.length; i < len; i++) {
        measurements[i].trigger('change');
        expect(renderSpy.callCount).to.equal(i + 1);
      }
    });

    it('should render when reading declination_valid changes', function () {
      reading.trigger('change:declination_valid');
      expect(renderSpy.callCount).to.equal(1);
    });

    it('should render when reading shift changes', function () {
      reading.trigger('change:declination_shift');
      expect(renderSpy.callCount).to.equal(1);
    });

    it('should render when calculator changes', function () {
      calculator.trigger('change');
      expect(renderSpy.callCount).to.equal(1);
    });

    it('it should not render when reading changes', function () {
      reading.trigger('change');
      expect(renderSpy.callCount).to.equal(0);
    });
  });

  describe('event bindings', function () {
    it('Should toggle valid state', function () {
      var view,
          checkBox,
          checkBoxBefore,
          checkBoxAfter,
          reading = Reading(),
          calculator = Calculator();

      view = DeclinationSummaryView({
        el: document.createElement('tr'),
        reading: reading,
        calculator: calculator
      });

      checkBox = view.el.querySelector('.valid > input');
      checkBoxBefore = checkBox.checked;
      checkBoxAfter = checkBoxBefore;

      checkBox.dispatchEvent(getClickEvent());

      checkBoxAfter = checkBox.checked;
      expect(checkBoxBefore).to.not.equal(checkBoxAfter);
      expect(checkBoxAfter).to.be.equal(false);
    });

    it('Should set shift +/- 180', function () {
      var calculator = Calculator(),
          dropDown,
          el = document.createElement('tr'),
          view,
          reading = Reading();

      view = DeclinationSummaryView({
        el: el,
        reading: reading,
        calculator: calculator
      });

      dropDown = view.el.querySelector('.shift > select');

      expect(reading.get('declination_shift')).to.equal(0);
      changeSelectValue(dropDown, '-180');
      expect(reading.get('declination_shift')).to.equal(-180);
      changeSelectValue(dropDown, '180');
      expect(reading.get('declination_shift')).to.equal(180);
    });
  });
});
