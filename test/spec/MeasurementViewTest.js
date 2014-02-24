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

		// These are currently passing but take a long time (~10 sec) to complete.
		// We should re-check this test any time the _dmsToDecimal or _decimalToDms
		// methods are updated
		describe.skip('degree_inversion_check', function () {
			var m = new MeasurementView(viewOptions);

			it('gives back original input', function () {
				var deg, min, sec, result;

				for (deg = 0; deg < 360; deg++) {
					for (min = 0; min < 60; min++) {
						for (sec = 0; sec < 60; sec++) {
							result = m._dmsToDecimal(deg, min, sec);
							expect(m._decimalToDms(result)).to.deep.equal([deg, min, sec]);
						}
					}
				}
			});
		});
	});
});
