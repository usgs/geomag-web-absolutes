/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Reading',
	'mvc/Model'
], function (chai, Reading, Model ) {
	'use strict';
	var expect = chai.expect;


	/*var TEST_READING_DATA = {
		'id': 'example_obs_001',
		'measurements': new Collection([
			{
				'id': 'test_pier_1'
			},
			{
				'id': 'test_pier_2'
			}
		]),
		'default_pier_id': null
	}; */




	describe('Unit tests for the "Reading" class', function () {

		describe('constructor()', function () {
			it('calls Model constructor', function () {
				var reading = new Reading();
				expect( reading ).to.be.an.instanceOf(Reading);
				expect( reading ).to.be.an.instanceOf(Model);
			});
		});

	});

});
