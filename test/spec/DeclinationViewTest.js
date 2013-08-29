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

		it('can be "require"d', function () {
			/*jshint -W030*/
			expect(DeclinationView).to.not.be.undefined;
			/*jshint +W030*/
		});

		it('can be instantiated', function () {
			var view = new DeclinationView({
				reading: new Reading()
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
	});

});
