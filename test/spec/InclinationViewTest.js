/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'geomag/InclinationView',
	'geomag/Reading'
], function (
	chai,
	InclinationView,
	Reading
) {

	'use strict';
	var expect = chai.expect;


	describe('Unit tests for the "InclinationView" class', function () {

		var testBaselineCalculator = {
			inclination : function () { return 1; },
			horizontalComponent : function () { return 2; },
			verticalComponent : function () { return 3; },
			southDownMinusNorthUp : function () { return 4; },
			northDownMinusSouthUp : function () { return 5; }
		};

		it('can be required', function () {
			/*jshint -W030*/
			expect(InclinationView).to.not.be.undefined;
			/*jshint +W030*/
		});


		it('can be instantiated', function () {
			var reading = new Reading();
			var view = new InclinationView({
					baselineCalculator: testBaselineCalculator,
					reading: reading
			});

			/*jshint -W030*/
			expect(view._options).to.not.be.undefined;
			expect(view._inclination).to.not.be.undefined;
			expect(view._horizontalComponent).to.not.be.undefined;
			expect(view._verticalComponent).to.not.be.undefined;
			expect(view._southDownMinusNorthUp).to.not.be.undefined;
			expect(view._northDownMinusSouthUp).to.not.be.undefined;
			/*jshint +W030*/
		});


		it('updates the view during a render', function () {
			var reading = new Reading();
			var view = new InclinationView({
					baselineCalculator: testBaselineCalculator,
					reading: reading
			});

			/*jshint -W030*/
			expect(Number(view._inclination.innerHTML)).to.equal(testBaselineCalculator.inclination());
			expect(Number(view._horizontalComponent.innerHTML)).to.equal(testBaselineCalculator.horizontalComponent());
			expect(Number(view._verticalComponent.innerHTML)).to.equal(testBaselineCalculator.verticalComponent());
			expect(Number(view._southDownMinusNorthUp.innerHTML)).to.equal(testBaselineCalculator.southDownMinusNorthUp());
			expect(Number(view._northDownMinusSouthUp.innerHTML)).to.equal(testBaselineCalculator.northDownMinusSouthUp());
			/*jshint +W030*/
		});

	});


});