/* global define, describe, it, beforeEach, afterEach */
define([
	'chai',
	'sinon',

	'geomag/ObservationSummaryView',
	'geomag/Observation',
	'geomag/ObservationBaselineCalculator'
], function (
	chai,
	sinon,

	ObservationSummaryView,
	Observation,
	ObservationBaselineCalculator
) {
	'use strict';

	var expect = chai.expect;

	describe('OvservationSummaryViewTest', function () {
		var renderSpy;
		var calculator;
		var view;
		var observation;

		beforeEach(function () {
			renderSpy = sinon.spy(ObservationSummaryView.prototype, 'render');
			calculator = new ObservationBaselineCalculator();
			observation = new Observation();
			view = new ObservationSummaryView({
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

		describe('constructor', function () {
			it('Is an instance of ObservationSummaryView', function () {
				var o = new ObservationSummaryView({
					observation: new Observation(),
					baselineCalculator: new ObservationBaselineCalculator()
				});
				/* jshint -W030 */
				expect(o).to.be.an.instanceOf(ObservationSummaryView);
				/* jshint +W030 */
			});
		});

		describe.only('Proper event bindings', function () {
			it('should render when Pier temp changes', function () {
				observation.set({'pier_temperature':40});
				var pierTemperature =
						parseInt(view._el.querySelector('.pier-temp-value').innerHTML, 10);
				expect(pierTemperature).to.equal(40);
			});

			it('should render when annotation changes', function () {
				observation.set({'annotation':'This is an annotation test'});
				var annotation =
						view._el.querySelector('.reviewer > textarea').innerHTML;
				expect(annotation).to.equal('This is an annotation test');
			});

			it('should render when measurement changes', function () {
				var changeCount = 1;

				observation.eachMeasurement(function (measurement) {
					measurement.trigger('change');
					expect(renderSpy.callCount).to.equal(++changeCount);
				});
			});
				/*
				var i = null,
				    len = null,
				    readings = new Reading(),
				    measurements,
				    Measurements;
				calculator.trigger('change');
				expect(renderSpy.callCount).to.equal(2);

				for (i = 0, len = readings.length; i < len; i++) {
					measurements.reading.getMeasurements();

					measurements[Measurements.WEST_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.EAST_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.WEST_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.EAST_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.SOUTH_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.NORTH_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.SOUTH_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.NORTH_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.FIRST_MARK_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.FIRST_MARK_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.SECOND_MARK_UP][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));

					measurements[Measurements.SECOND_MARK_DOWN][0].trigger('change');
					expect(renderSpy.callCount).to.equal(3 + (i * 12));
				}
				*/
		});
	});
});