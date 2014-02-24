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

		describe('_dmsToDecimal', function () {
			var m = new MeasurementView(viewOptions);

			it('parses DMS properly', function () {
				// Edge case
				expect(m._dmsToDecimal(0, 0, 0)).to.equal(0.0);
				// All whole numbers
				expect(m._dmsToDecimal(29, 59, 60)).to.equal(30.0);
				// Decimal degree value
				expect(m._dmsToDecimal(29.5, 29, 60)).to.equal(30.0);
				// Decimal minute value
				expect(m._dmsToDecimal(0, 29.5, 30)).to.equal(0.5);
				// Decimal degree and minute value
				expect(m._dmsToDecimal(29.5, 29.5, 30)).to.equal(30.0);

				// Some tests from real observations
				expect(m._dmsToDecimal(120, 0, 36)).to.equal(120.010);
			});
		});

		describe('_decimalToDms', function () {
			var m = new MeasurementView(viewOptions);

			it('parses decimals properly', function () {
				// Edge case
				expect(m._decimalToDms(0.0)).to.deep.equal([0, 0, 0]);
				expect(m._decimalToDms(30.0)).to.deep.equal([30, 0, 0]);
				expect(m._decimalToDms(30.5)).to.deep.equal([30, 30, 0]);
				expect(m._decimalToDms(0.5)).to.deep.equal([0, 30, 0]);

				// Some tests from real observations
				expect(m._decimalToDms(120.010)).to.deep.equal([120, 0, 36]);
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
