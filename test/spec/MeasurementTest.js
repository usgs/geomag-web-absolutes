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

		describe('constructor()', function () {
			it('works when no values are given', function () {
				var measurement = new Measurement();
        expect(measurement instanceof Measurement );
			});
		});
		describe('constructor(options)', function () {
			it('works when passed a test object', function () {
				var testObject = {
						id: 1,
						reading_id: 1,
						type: 'west_up',
						time: 1372193224820,
						angle: 0.0
				};
				var measurement = new Measurement(testObject);
				expect(measurement.get('id')).to.equal(1);
				expect(measurement.get('reading_id')).to.equal(1);
				expect(measurement.get('type')).to.equal('west_up');
				expect(measurement.get('time')).to.equal(1372193224820);
				expect(measurement.get('angle')).to.equal(0.0);
			});
		});

	});

});
