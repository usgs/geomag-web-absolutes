/*global define*/
/*global describe*/
/*global it*/
/*global beforeEach, afterEach */
define([
	'chai',
	'sinon',
	'mvc/Model',
	'util/Util',

	'geomag/Reading',
	'geomag/Observation',
	'geomag/Measurement',
	'geomag/ObservationBaselineCalculator',
	'geomag/MagnetometerOrdinatesView'
], function (
	chai,
	sinon,
	Model,
	Util,

	Reading,
	Observation,
	Measurement,
	ObservationBaselineCalculator,
	MagnetometerOrdinatesView
){
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for MagnetometerOrdinatesView', function () {
		describe('view bindings', function(){
			var renderSpy,
			    reading,
			    calculator,
			    view,
			    observation,
			    readingMeasurements,
			    measurements;

			beforeEach(function(){
				renderSpy = sinon.spy(MagnetometerOrdinatesView.prototype, 'render');
				reading = new Reading();
				observation = new Observation();
				calculator = new ObservationBaselineCalculator();

				view = new MagnetometerOrdinatesView({
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

			afterEach(function() {
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

			it('should render when calculator changes', function (){
				calculator.trigger('change');
				expect(renderSpy.callCount).to.equal(2);
			});



		});
	});

});
