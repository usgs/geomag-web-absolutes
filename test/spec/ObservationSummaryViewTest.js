/* global define, describe, it */
define([
	'chai',

	'geomag/ObservationSummaryView',
	'geomag/Observation',
	'geomag/ObservationBaselineCalculator'
], function (
	chai,

	ObservationSummaryView,
	Observation,
	ObservationBaselineCalculator
) {
	'use strict';

	var expect = chai.expect;

	describe('Unit test for ObservationSummaryView', function () {
		describe('constructor', function () {
			it('Is an instance of ObservationSummaryView', function () {
				var O = new ObservationSummaryView({
					observation: new Observation(),
					baselineCalculator: new ObservationBaselineCalculator()
				});
				/* jshint -W030 */
				expect(O).to.be.an.instanceOf(ObservationSummaryView);
				/* jshint +W030 */
			});
		});
	});

});