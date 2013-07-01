/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Measurement'
], function (chai, Measurement) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Measurement" class', function () {
		var testObject = {
				id: 1,
				reading_id: 1,
				type: 'west_up',
				time: 1372193224820,
				angle: 0.0
		};
		describe('constructor()', function () {
			it('evaluates to instanceof "Measurement"', function () {
				var measurement = new Measurement();
	expect(measurement instanceof Measurement );
			});


			it('works when passed a test object', function () {

				var measurement = new Measurement(testObject);
				expect(measurement.get('id')).to.equal(testObject.id);
				expect(measurement.get('reading_id')).to.equal(testObject.reading_id);
				expect(measurement.get('type')).to.equal(testObject.type);
				expect(measurement.get('time')).to.equal(testObject.time);
				expect(measurement.get('angle')).to.equal(testObject.angle);
			});
		});
	});
});
