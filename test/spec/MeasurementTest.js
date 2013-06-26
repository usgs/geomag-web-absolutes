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
			it('has a null id by default', function () {
				var measurement = new Measurement();
				expect(measurement.get('id')).to.equal(null);
			});
		});
		describe('constructor(id, reading_id, type, time, angle)', function () {
			it('test contructor values', function () {
				var measurement = new Measurement({'id':1, 'reading_id':1, 'type':'west_up', 'time':1372193224820, 'angle':0.0});
				expect(measurement.get('id')).to.equal(1);
				expect(measurement.get('reading_id')).to.equal(1);
				expect(measurement.get('type')).to.equal('west_up');
				expect(measurement.get('time')).to.equal(1372193224820);
				expect(measurement.get('angle')).to.equal(0.0);
			});
		});

	});

});
