/*global define*/
/*global describe*/
/*global it*/

define([
	'chai',
	'geomag/DeclinationView'
], function (
	chai,
	DeclinationView
) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for DeclinationView class', function () {

		it('can be "require"d', function() {
			/*jshint -W030*/
			expect(DeclinationView).to.not.be.undefined;
			/*jshint +W030*/
		});

	});

});
