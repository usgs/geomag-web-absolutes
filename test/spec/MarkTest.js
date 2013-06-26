/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Mark'
], function (chai, Mark) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Mark" class', function () {

		describe('constructor()', function () {
			it('has a null id by default', function () {
				var mark = new Mark();
				expect(mark.get('id')).to.equal(null);
			});
		});

	});

});
