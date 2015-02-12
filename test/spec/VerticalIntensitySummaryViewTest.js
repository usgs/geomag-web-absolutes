/* global define, describe, it, beforeEach, afterEach */
define([
  'chai',
  'sinon',

  'geomag/ObservationBaselineCalculator',
  'geomag/Reading',
  'geomag/VerticalIntensitySummaryView',
  'geomag/ObservatoryFactory'
], function (
  chai,
  sinon,

  ObservationBaselineCalculator,
  Reading,
  VerticalIntensitySummaryView,
  ObservatoryFactory
) {
  'use strict';


  var expect = chai.expect;

  var getClickEvent = function () {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
    return clickEvent;
  };

  describe('VerticalIntensitySummaryViewTest', function () {
    describe('model bindings', function () {
      var renderSpy,
          reading,
          calculator,
          view,
          measurements,
          factory;

      beforeEach(function () {
        renderSpy = sinon.spy(VerticalIntensitySummaryView.prototype, 'render');
        reading = new Reading();
        calculator = new ObservationBaselineCalculator();
        factory = new ObservatoryFactory();
        view = new VerticalIntensitySummaryView({
          el: document.createElement('tr'),
          reading: reading,
          calculator: calculator,
          factory:factory
        });
        measurements = factory.getHorizontalIntensityMeasurements(reading);
      });

      afterEach(function () {
        renderSpy.restore();
        reading = null;
        view = null;
        calculator = null;
        measurements = null;
      });

      it('should render when measurement changes', function () {
        var i = null,
            len = null,
            count = 0;

        for (i = 0, len = measurements.length; i < len; i++) {
          count = renderSpy.callCount;
          measurements[i].trigger('change');
          // +2 because view renders during instantiation and loop
          // index starts at 0
          expect(renderSpy.callCount).to.equal(count + 1);
        }
      });

      it('should render when reading vertical_intensity_valid changes',
          function () {
        reading.trigger('change:vertical_intensity_valid');
        expect(renderSpy.callCount).to.equal(2);
      });

      it('should render when calculator changes', function () {
        calculator.trigger('change');
        expect(renderSpy.callCount).to.equal(2);
      });

      it('should not render when reading changes', function () {
        reading.trigger('change');
        expect(renderSpy.callCount).to.equal(1);
      });
    });

    describe('event bindings', function () {
      it('Should toggle valid state', function () {
        var view,
            checkBox,
            checkBoxBefore,
            checkBoxAfter,
            reading = new Reading(),
            calculator = new ObservationBaselineCalculator();

        view = new VerticalIntensitySummaryView({
          el: document.createElement('tr'),
          reading: reading,
          calculator: calculator
        });

        checkBox = view._el.querySelector('.valid > input');
        checkBoxBefore = checkBox.checked;
        checkBoxAfter = checkBoxBefore;

        checkBox.dispatchEvent(getClickEvent());

        checkBoxAfter = checkBox.checked;
        expect(checkBoxBefore).to.not.equal(checkBoxAfter);
        expect(checkBoxAfter).to.be.equal(false);
      });
    });
  });
});
