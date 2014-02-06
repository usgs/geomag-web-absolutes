/*global define*/
/*global describe*/
/*global it*/
define([
	'chai',
	'geomag/DeclinationView',
	'geomag/Reading'
], function (
	chai,
	DeclinationView,
	Reading
) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for DeclinationView class', function () {

		// test ObservationBaselineCalculator for testing
		var testObservationBaselineCalculator = {
			magneticSouthMeridian: function() { return 1; },
			meanMark: function () { return 2; },
			magneticAzimuthMark: function () { return 3; },
			trueAzimuthOfMark: function () { return 4; },
			magneticDeclination: function () { return 5; },
			westUpMinusEastDown: function () { return 6; },
			eastUpMinusWestDown: function () { return 7; },
			fMean: function () { return 8; },
			pierCorrection: function () { return 9; },
			correctedF: function() { return 10; }
		};


		it('can be "require"d', function () {
			/*jshint -W030*/
			expect(DeclinationView).to.not.be.undefined;
			/*jshint +W030*/
		});

		it('can be instantiated', function () {
			var view = new DeclinationView({
				reading: new Reading(),
				baselineCalculator: testObservationBaselineCalculator
			});

			/*jshint -W030*/
			expect(view._options).to.not.be.undefined;
			expect(view._magneticSouthMeridian).to.not.be.undefined;
			expect(view._meanMark).to.not.be.undefined;
			expect(view._magneticAzimuthOfMark).to.not.be.undefined;
			expect(view._trueAzimuthOfMark).to.not.be.undefined;
			expect(view._magneticDeclination).to.not.be.undefined;
			expect(view._westUpMinusEastDown).to.not.be.undefined;
			expect(view._eastUpMinusWestDown).to.not.be.undefined;
			expect(view._fMean).to.not.be.undefined;
			expect(view._pierCorrection).to.not.be.undefined;
			expect(view._correctedF).to.not.be.undefined;
			/*jshint +W030*/
		});

		// TODO :: Enable this test once DeclinationView is truly implemented
		it.skip('updates view elements during render', function () {
			var reading = new Reading();
			var view = new DeclinationView({
				reading: reading,
				baselineCalculator: testObservationBaselineCalculator
			});

			expect(Number(view._magneticSouthMeridian.innerHTML)).to.equal(
					testObservationBaselineCalculator.magneticSouthMeridian());
			expect(Number(view._meanMark.innerHTML)).to.equal(
					testObservationBaselineCalculator.meanMark());
			expect(Number(view._magneticAzimuthOfMark.innerHTML)).to.equal(
					testObservationBaselineCalculator.magneticAzimuthMark());
			expect(Number(view._trueAzimuthOfMark.innerHTML)).to.equal(
					testObservationBaselineCalculator.trueAzimuthOfMark());
			expect(Number(view._magneticDeclination.innerHTML)).to.equal(
					testObservationBaselineCalculator.magneticDeclination());
			expect(Number(view._westUpMinusEastDown.innerHTML)).to.equal(
					testObservationBaselineCalculator.westUpMinusEastDown());
			expect(Number(view._eastUpMinusWestDown.innerHTML)).to.equal(
					testObservationBaselineCalculator.eastUpMinusWestDown());
			expect(Number(view._fMean.innerHTML)).to.equal(
					testObservationBaselineCalculator.fMean());
			expect(Number(view._pierCorrection.innerHTML)).to.equal(
					testObservationBaselineCalculator.pierCorrection());
			expect(Number(view._correctedF.innerHTML)).to.equal(
					testObservationBaselineCalculator.correctedF());
		});

	});

});
