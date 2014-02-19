/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'mvc/Model',
	'util/Util',

	'geomag/Reading',
	'geomag/Observation',
	'geomag/MagnetometerOrdinatesView'
], function (
	chai,
	Model,
	Util,

	Reading,
	Observation,
	MagnetometerOrdinatesView
){
	'use strict';
	var expect = chai.expect;

	var testObservationBaselineCalculator = Util.extend(new Model(), {
		meanH: function() { return 1; },
		meanE: function() { return 1; },
		meanZ: function() { return 1; },
		meanF: function() { return 1; },
		scaleValue: function() { return 1; },
		magneticDeclination: function() { return 1; },
		horizontalComponent: function() { return 1; },
		verticalComponent: function() { return 1; },
		correctedF: function() { return 1; },
		baselineD: function() { return 1; },
		baselineE: function() { return 1; },
		baselineH: function() { return 1; },
		baselineZ: function() { return 1; }
	});

	describe('Unit tests for MagnetometerOrdinatesView class', function () {
		it('can be "require"d', function () {
			/*jshint -W030*/
			expect(MagnetometerOrdinatesView).to.not.be.undefined;
			/*jshint +W030*/
		});
		it( 'can update view', function () {
			var reading = new Reading(),
					observation = new Observation();

			var magnetometerOrdinatesView = new MagnetometerOrdinatesView({
							reading: reading,
							observation: observation,
							baselineCalculator: testObservationBaselineCalculator});
			expect(magnetometerOrdinatesView._hMean.textContent).to.equal(1);
		});

	});
});
