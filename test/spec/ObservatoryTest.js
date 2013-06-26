/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Observatory',
	'spec/ObservatoryFeed'
], function (chai, Observatory, ObservatoryFeed) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Observatory" class', function () {

		describe('constructor()', function () {
			it('id attribute matches test data', function () {
				var observatory = new Observatory(ObservatoryFeed.observatories[0]);
				expect(observatory.get('id')).to.equal('example_obs_001');
			});
		});

	});

});
