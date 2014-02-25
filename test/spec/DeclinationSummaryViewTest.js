/* global define, describe, it, beforeEach, afterEach */
define([
	'chai',
	'sinon',

	'geomag/Reading',
	'geomag/ObservationBaselineCalculator',
	'geomag/DeclinationSummaryView'
], function (
	chai,
	sinon,

	Reading,
	ObservationBaselineCalculator,
	DeclinationSummaryView
) {
	'use strict';


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
			    measurements;

			beforeEach(function () {
				renderSpy = sinon.spy(DeclinationSummaryView.prototype, 'render');
				reading = new Reading();
				calculator = new ObservationBaselineCalculator();
				view = new DeclinationSummaryView({
					el: document.createElement('tr'),
					reading: reading,
					calculator: calculator
				});
				measurements = view._getDeclinationMeasurements();
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

			it('should render when reading declination_valid changes', function () {
				reading.trigger('change:declination_valid');
				expect(renderSpy.callCount).to.equal(2);
			});

			it('should render when reading shift changes', function () {
				reading.trigger('change:declination_shift');
				expect(renderSpy.callCount).to.equal(2);
			});

			it('should render when calculator changes', function () {
				calculator.trigger('change');
				expect(renderSpy.callCount).to.equal(2);
			});

			it('it should not render when reading changes', function () {
				reading.trigger('change');
				expect(renderSpy.callCount).to.equal(1);
			});
		});

		describe('event bindings', function () {
			it('Should toggel valid state', function () {
				var view,
				    checkBox,
				    checkBoxBefore,
				    checkBoxAfter,
				    reading = new Reading(),
				    calculator = new ObservationBaselineCalculator();

				view = new DeclinationSummaryView({
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

			it('Should set shift +/- 180', function () {
				var view,
				    reading = new Reading(),
				    calculator = new ObservationBaselineCalculator();

				view = new DeclinationSummaryView({
					el: document.createElement('tr'),
					reading: reading,
					calculator: calculator
				});

				expect(reading.get('declination_shift')).to.equal(0);
				changeSelectValue(view._shift, '-180');
				expect(reading.get('declination_shift')).to.equal(-180);
				changeSelectValue(view._shift, '+180');
				expect(reading.get('declination_shift')).to.equal(180);

			});
		});
	});
});