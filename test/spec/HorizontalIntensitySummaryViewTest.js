/* global define, describe, it, beforeEach, afterEach */
define([
	'chai',
	'sinon',

	'geomag/Reading',
	'geomag/ObservationBaselineCalculator',
	'geomag/HorizontalIntensitySummaryView'
], function (
	chai,
	sinon,

	Reading,
	ObservationBaselineCalculator,
	HorizontalIntensitySummaryView
) {
	'use strict';


	var expect = chai.expect;

	var getClickEvent = function () {
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
		return clickEvent;
	};

	describe('HorizontalIntensitySummaryViewTest', function () {
		describe('model bindings', function () {
			var renderSpy,
			    reading,
			    calculator,
			    view,
			    measurements;

			beforeEach(function () {
				renderSpy =
						sinon.spy(HorizontalIntensitySummaryView.prototype, 'render');
				reading = new Reading();
				calculator = new ObservationBaselineCalculator();
				view = new HorizontalIntensitySummaryView({
					el: document.createElement('tr'),
					reading: reading,
					calculator: calculator
				});
				measurements = view._getHorizontalIntensityMeasurements();
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
				    len = null;

				for (i = 0, len = measurements.length; i < len; i++) {
					measurements[i].trigger('change');
					// +2 because view renders during instantiation and loop
					// index starts at 0
					expect(renderSpy.callCount).to.equal(i + 2);
				}
			});

			it('should render when reading horizontal_intensity_valid changes',
					function () {
				reading.trigger('change:horizontal_intensity_valid');
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

				view = new HorizontalIntensitySummaryView({
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