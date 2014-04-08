/* global define */

define([
], function (
) {
	'use strict';

	var getScaleValueCoefficient = function () {
		return 3437.7468;
	};

	var NaN = parseFloat('notanumber'),
	    SCALE_VALUE_COEFFICIENT = getScaleValueCoefficient();

	var BaselineCalculator = function () {
	};

	BaselineCalculator.prototype = Object.create({

		/**
		 * Magnetic South Meridian
		 *
		 * @param westDown {Number} Decimal degrees
		 * @param westUp {Number} Decimal degrees
		 * @param eastDown {Number} Decimal degrees
		 * @param eastUp {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		magneticSouthMeridian: function (westDown, westUp, eastDown, eastUp) {
			return this._mean(westDown, westUp, eastDown, eastUp);
		},

		/**
		 * Magnetic Azimuth of the Mark
		 *
		 * @param meanMark {Number} Decimal degrees
		 * @param magneticSouthMeridian {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		magneticAzimuthMark: function (meanMark, magneticSouthMeridian) {
			return (meanMark + 90.0 - magneticSouthMeridian);
		},

		/**
		 * Geographic Meridian
		 *
		 * @param markUp1 {Number} Decimal degrees
		 * @param markUp2 {Number} Decimal degrees
		 * @param trueAzimuthMark {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		geographicMeridian: function (markUp1, markUp2, trueAzimuthMark) {
			return (this._mean(markUp1, markUp2) - trueAzimuthMark);
		},

		/**
		 * Magnetic Declination
		 *
		 * @param magneticSouthMeridian {Number} Decimal degrees
		 * @param geographicMeridian {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		magneticDeclination:
				function (magneticSouthMeridian, geographicMeridian, shift) {
			var magneticDecl = magneticSouthMeridian - geographicMeridian;
			while (magneticDecl >= 180.0) {
				magneticDecl -= 180.0;
			}
			while (magneticDecl < 0) {
				magneticDecl += 180.0;
			}

			// Apply the declination shift if there is one
			if (typeof shift !== 'undefined' && shift !== null) {
				magneticDecl += shift;
			}

			return (magneticDecl);
		},

		/**
		 * West
		 *
		 * @param westUp {Number} Decimal degrees
		 * @param eastDown {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		westUpMinusEastDown: function (westUp, eastDown) {
			return (westUp - eastDown);
		},

		/**
		 * East
		 *
		 * @param eastUp {Number} Decimal degrees
		 * @param westDown {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		eastUpMinusWestDown: function (eastUp, westDown) {
			return (eastUp - westDown);
		},

		/**
		 * F Corrected
		 *
		 * @param fmean {Number} nT
		 * @param pierCorrection {Number} nT
		 *
		 * @return {Number} nT
		 */
		fCorrected: function (fMean, pierCorrection) {
			return (fMean + pierCorrection);
		},


		/**
		 * Inclination
		 *
		 * @param southDown {Number} Decimal degrees
		 * @param southUp {Number} Decimal degrees
		 * @param northDown {Number} Decimal degrees
		 * @param northUp {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		inclination: function (southDown, southUp, northDown, northUp) {
			return ((southDown + northUp) - (southUp + northDown) + 360.0) / 4.0;
		},

		/**
		 * Horizontal Component
		 *
		 * @param correctedF {Number} nT
		 * @param inclination {Number} Decimal degrees
		 *
		 * @return {Number} nT
		 */
		horizontalComponent: function (correctedF, inclination) {
			return (correctedF * Math.cos(this._toRadians(inclination)));
		},

		/**
		 * Vertical Component
		 *
		 * @param correctedF {Number} nT
		 * @param inclination {Number} Decimal degrees
		 *
		 * @return {Number} nT
		 */
		verticalComponent: function (correctedF, inclination) {
			return (correctedF * Math.sin(this._toRadians(inclination)));
		},

		/**
		 * South
		 *
		 * @param southDown {Number} Decimal degrees
		 * @param northUp {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		southDownMinusNorthUp: function (southDown, northUp) {
			return (southDown - northUp - 180.0);
		},

		/**
		 * North
		 *
		 * @param northDown {Number} Decimal degrees
		 * @param southUp {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		northDownMinusSouthUp: function (northDown, southUp) {
			return (northDown - southUp - 180.0);
		},

		/**
		 * Scale Value
		 *
		 * @param absoluteH {Number} nT
		 *
		 * @return {Number} No units
		 */
		scaleValue: function (absoluteH) {
			if( absoluteH === 0 ) {
				return 1;
			}
			return (SCALE_VALUE_COEFFICIENT / absoluteH);
		},

		/**
		 * Computed D
		 *
		 * @param meanE {Number} nT
		 * @param scaleValue {Number} No units
		 *
		 * @return {Number} Decimal degrees
		 */
		dComputed: function (eMean, scaleValue) {
			return (eMean * scaleValue / 60.0);
		},

		/**
		 * H Baseline
		 *
		 * @param hAbsolute {Number} nT
		 * @param hComputed {Number} nT
		 *
		 * @return {Number} nT
		 */
		hBaseline: function (hAbsolute, hComputed) {
			return (hAbsolute - hComputed);
		},

		/**
		 * E Baseline
		 *
		 * @param dBaseline {Number} Decimal degrees
		 * @param scaleValue {Number}
		 *
		 * @return {Number} nT
		 */
		eBaseline: function (dBaseline, scaleValue) {
			return (dBaseline * 60.0 / scaleValue);
		},

		/**
		 * D Baseline
		 *
		 * @param magneticDeclination {Number} Decimal degrees
		 * @param dComputed {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		dBaseline: function (magneticDeclination, dComputed) {
			return (magneticDeclination - dComputed);
		},

		/**
		 * Baseline Z
		 *
		 * @param zAbsolute {Number} nT
		 * @param zComputed {Number} nT
		 *
		 * @return {Number} nT
		 */
		zBaseline: function (zAbsolute, zComputed) {
			return (zAbsolute - zComputed);
		},


		// --------------------------------------------------------------
		// Helper Methods
		// --------------------------------------------------------------

		/**
		 * Helper method to compute the mean of up numeric values. If any given
		 * value is not numeric, it is excluded from the mean.
		 *
		 * @param <variable> {Numeric}
		 *      This method accepts a variable number of parameters. Each parameter
		 *      should be numeric. Non-numeric parameters are excluded from the
		 *      computed mean.
		 */
		_mean: function () {
			var sum = 0.0,
			    count = 0,
			    numArgs = arguments.length,
			    valid = false,
			    i = 0;

			for (; i < numArgs; i++) {
				if (typeof arguments[i] === 'number') {
					valid = true;
					sum += arguments[i];
					count++;
				}
			}

			if (valid) {
				return (sum / count);
			} else {
				return NaN;
			}
		},

		/**
		 * Converts degrees to radians.
		 *
		 * @param degrees {Number} Decimal degrees
		 *
		 * @return {Number} Radians
		 */
		_toRadians: function (degrees) {
			return ((degrees * Math.PI) / 180);
		}
	});


	// Expose some static values
	BaselineCalculator.SCALE_VALUE_COEFFICIENT = SCALE_VALUE_COEFFICIENT;

	return BaselineCalculator;
});
