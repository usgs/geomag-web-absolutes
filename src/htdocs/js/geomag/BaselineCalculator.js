/* global define */

define([
], function (
) {
	'use strict';

	var NaN = parseFloat('notanumber'),
	    SCALE_VALUE_COEFFIFIENT = 3437.7468;

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
		 * Mean Mark
		 *
		 * @param markDown1 {Number} Decimal degrees
		 * @param markUp1 {Number} Decimal degrees
		 * @param markDown2 {Number} Decimal degrees
		 * @param markUp2 {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		meanMark: function (markDown1, markUp1, markDown2, markUp2) {
			return this._mean(markDown1, markUp1, markDown2, markUp2);
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
		magneticDeclination: function (magneticSouthMeridian, geographicMeridian) {
			var magneticDecl = magneticSouthMeridian - geographicMeridian;
			while (magneticDecl >= 180.0) {
				magneticDecl -= 180.0;
			}
			while (magneticDecl < 0) {
				magneticDecl += 180.0;
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
		w: function (westUp, eastDown) {
			return ((westUp - eastDown) * 60.0);
		},

		/**
		 * East
		 *
		 * @param eastUp {Number} Decimal degrees
		 * @param westDown {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		e: function (eastUp, westDown) {
			return ((eastUp - westDown) * 60.0);
		},

		/**
		 * Corrected F
		 *
		 * @param fmean {Number} nT
		 * @param pierCorrection {Number} nT
		 *
		 * @return {Number} nT
		 */
		correctedF: function (fmean, pierCorrection) {
			return (fmean + pierCorrection);
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
			return ((southDown + northUp) - (southUp + northDown) + 360.0) / 4.0
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
		s: function (southDown, northUp) {
			return ((southDown - northUp - 180.0) * 60.0);
		},

		/**
		 * North
		 *
		 * @param northDown {Number} Decimal degrees
		 * @param southUp {Number} Decimal degrees
		 *
		 * @return {Number} Decimal degrees
		 */
		n: function (northDown, southUp) {
			return ((northDown - southUp - 180.0) * 60.0);
		},


		/**
		 * Mean H
		 *
		 * @param h1 {Number} First H value
		 * @param h2 {Number} Second H value
		 * @param h3 {Number} Third H value
		 * @param h4 {Number} Fourth H value
		 *
		 * @return {Number} Average H value
		 */
		meanH: function (h1, h2, h3, h4) {
			return this._mean(h1, h2, h3, h4);
		},

		/**
		 * Mean E
		 *
		 * @param h1 {Number} First E value
		 * @param h2 {Number} Second E value
		 * @param h3 {Number} Third E value
		 * @param h4 {Number} Fourth E value
		 *
		 * @return {Number} Average E value
		 */
		meanE: function (e1, e2, e3, e4) {
			return this._mean(e1, e2, e3, e4);
		},

		/**
		 * Mean Z
		 *
		 * @param h1 {Number} First Z value
		 * @param h2 {Number} Second Z value
		 * @param h3 {Number} Third Z value
		 * @param h4 {Number} Fourth Z value
		 *
		 * @return {Number} Average Z value
		 */
		meanZ: function (z1, z2, z3, z4) {
			return this._mean(z1, z2, z3, z4);
		},

		/**
		 * Mean F
		 *
		 * @param h1 {Number} First F value
		 * @param h2 {Number} Second F value
		 * @param h3 {Number} Third F value
		 * @param h4 {Number} Fourth F value
		 *
		 * @return {Number} Average F value
		 */
		meanF: function (f1, f2, f3, f4) {
			return this._mean(f1, f2, f3, f4);
		},

		/**
		 * Absolute D
		 *
		 * @param magneticDeclination {Number} Decimal degrees
		 *
		 * @return {Number} Decimal minutes
		 */
		absoluteD: function (magneticDeclination) {
			return (magneticDeclination * 60);
		},

		/**
		 * Absolute H
		 *
		 * @param horizontalComponent {Number} nT
		 *
		 * @return {Number} nT
		 */
		absoluteH: function (horizontalComponent) {
			return horizontalComponent;
		},

		/**
		 * Absolute Z
		 *
		 * @param verticalComponent {Number} nT
		 *
		 * @return {Number} nT
		 */
		absoluteZ: function (verticalComponent) {
			return verticalComponent;
		},

		scaleValue: function (absoluteH) {
			return (SCALE_VALUE_COEFFIFIENT / absoluteH);
		},

		/**
		 * Computed H
		 *
		 * @param meanH {Number} nT
		 *
		 * @return {Number} nT
		 */
		computedH: function (meanH) {
			return meanH;
		},

		/**
		 * Computed E
		 *
		 * @param meanE {Number} Decimal minutes
		 * @param scaleValue {Number}
		 *
		 * @return {Number} Decimal minutes
		 */
		computedE: function (meanE, scaleValue) {
			return (meanE * scaleValue);
		},

		/**
		 * Computed Z
		 *
		 * @param meanZ {Number} nT
		 *
		 * @return {Number} nT
		 */
		computedZ: function (meanZ) {
			return meanZ;
		},

		/**
		 * Computed F
		 *
		 * @param meanF {Number} nT
		 *
		 * @return {Number} nT
		 */
		computedF: function (meanF) {
			return meanF;
		},


		/**
		 * Baseline D
		 *
		 * @param magneticDeclination {Number} Decimal degrees
		 * @param computedE {Number} Decimal minutes
		 *
		 * @return {Number} Decimal minutes
		 */
		baselineD: function (magneticDeclination, computedE) {
			return ((magneticDeclination * 60.0) - computedE);
		},

		/**
		 * Baseline H
		 *
		 * @param absoluteH {Number} nT
		 * @param computedH {Number} nT
		 *
		 * @return {Number} nT
		 */
		baselineH: function (absoluteH, computedH) {
			return (absoluteH - computedH);
		},

		/**
		 * Baseline Z
		 *
		 * @param absoluteZ {Number} nT
		 * @param computedZ {Number} nT
		 *
		 * @return {Number} nT
		 */
		baselineZ: function (absoluteZ, computedZ) {
			return (absoluteZ - computedZ);
		},

		/**
		 * D
		 *
		 * @param baselineD {Number} Decimal minutes
		 * @param scaleValue {Number}
		 *
		 * @return {Number} nT
		 */
		d: function (baselineD, scaleValue) {
			return (baselineD / scaleValue);
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
	BaselineCalculator.SCALE_VALUE_COEFFIFIENT = SCALE_VALUE_COEFFIFIENT;

	return BaselineCalculator;
});
