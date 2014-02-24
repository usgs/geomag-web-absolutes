/* global define, describe, it */
define([
	'chai',

	'mvc/Model',
	'geomag/Measurement',
	'geomag/MeasurementView',
	'geomag/Observation'
], function (
	chai,

	Model,
	Measurement,
	MeasurementView,
	Observation
) {
	'use strict';

	var expect = chai.expect;
	var viewOptions = {
		el: document.createElement('tr'),
		measurement: new Model({type: Measurement.FIRST_MARK_UP}),
		observation: new Observation()
	};

	describe('MeasurementView Unit Tests', function () {

		describe('Constructor', function () {
			var m = new MeasurementView(viewOptions);

			it('should be an instance of a MeasurementView', function () {
				expect(m).to.be.an.instanceOf(MeasurementView);
			});
		});

	});

});
