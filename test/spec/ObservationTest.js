/* global define, describe, it */
define([
	'chai',
	'geomag/Observation',
	'mvc/Model'
], function (
	chai,
	Observation,
	Model
) {
	'use strict';
	var expect = chai.expect;

	describe('Observation Unit Tests', function () {

		describe('Constructor', function () {
			var o = new Observation();

			it('should be an instance of an Observation', function () {
				expect(o).to.be.an.instanceOf(Observation);
			});

			it('should be an instance of a Model', function () {
				expect(o).to.be.an.instanceOf(Model);
			});

		});

	}); // END :: Observation Unit Tests

});
