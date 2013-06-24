/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Observatory'
], function (chai, Observatory) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Observatory" class', function () {

		describe('constructor()', function () {
			it('has a null id by default', function () {
				var observatory = new Observatory();
				expect(observatory.get('id')).to.equal(null);
			});
		});

	});

});
