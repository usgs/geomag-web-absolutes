/* global define, describe, it */
define([
	'chai',
	'geomag/Instrument',
	'mvc/Model'
], function (
	chai,
	Instrument,
	Model
) {
	'use strict';
	var expect = chai.expect;

	describe('Instrument Unit Tests', function () {

		describe('Constructor', function () {
			var i = new Instrument();

			it('should be an instance of an Instrument', function () {
				expect(i).to.be.an.instanceOf(Instrument);
			});

			it('should be an instance of a Model', function () {
				expect(i).to.be.an.instanceOf(Model);
			});

		}); // END :: Constructor

	}); // END :: Instrument Unit Tests
});
