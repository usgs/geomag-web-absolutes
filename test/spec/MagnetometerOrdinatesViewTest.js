/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'geomag/MagnetometerOrdinatesView',
	'geomag/BaselineCalculator.js'
], function (
	chai,
	MagnetometerOrdinatesView
){
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for MagnetometerOrdinatesView class', function () {
			it('can be "require"d', function () {
			/*jshint -W030*/
			expect(MagnetometerOrdinatesView).to.not.be.undefined;
			/*jshint +W030*/
		});
	});
});
