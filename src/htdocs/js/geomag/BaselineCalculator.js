'use strict';

var getScaleValueCoefficient = function () {
  return 3437.7468;
};

var _SCALE_VALUE_COEFFICIENT = getScaleValueCoefficient();


var BaselineCalculator = function () {
  var _this;

  _this = {};

  /**
   * D Baseline
   *
   * @param magneticDeclination {Number} Decimal degrees
   * @param dComputed {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.dBaseline = function (magneticDeclination, dComputed) {
    return (magneticDeclination - dComputed);
  };

  /**
   * Computed D
   *
   * @param meanE {Number} nT
   * @param scaleValue {Number} No units
   *
   * @return {Number} Decimal degrees
   */
  _this.dComputed = function (eMean, scaleValue) {
    return (eMean * scaleValue / 60.0);
  };

  /**
   * East
   *
   * @param eastUp {Number} Decimal degrees
   * @param westDown {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.eastUpMinusWestDown = function (eastUp, westDown) {
    return (eastUp - westDown);
  };

  /**
   * E Baseline
   *
   * @param dBaseline {Number} Decimal degrees
   * @param scaleValue {Number}
   *
   * @return {Number} nT
   */
  _this.eBaseline = function (dBaseline, scaleValue) {
    return (dBaseline * 60.0 / scaleValue);
  };

  /**
   * F Corrected
   *
   * @param fmean {Number} nT
   * @param pierCorrection {Number} nT
   *
   * @return {Number} nT
   */
  _this.fCorrected = function (fMean, pierCorrection) {
    return (fMean + pierCorrection);
  };

  /**
   * Geographic Meridian
   *
   * @param markUp1 {Number} Decimal degrees
   * @param markUp2 {Number} Decimal degrees
   * @param trueAzimuthMark {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.geographicMeridian = function (markUp1, markUp2, trueAzimuthMark) {
    return (_this.mean(markUp1, markUp2) - trueAzimuthMark);
  };

  /**
   * H Baseline
   *
   * @param hAbsolute {Number} nT
   * @param hComputed {Number} nT
   *
   * @return {Number} nT
   */
  _this.hBaseline = function (hAbsolute, hComputed) {
    return (hAbsolute - hComputed);
  };

  /**
   * Horizontal Component
   *
   * @param correctedF {Number} nT
   * @param inclination {Number} Decimal degrees
   *
   * @return {Number} nT
   */
  _this.horizontalComponent = function (correctedF, inclination) {
    return (correctedF * Math.cos(_this.toRadians(inclination)));
  };

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
  _this.inclination = function (southDown, southUp, northDown, northUp) {
    return ((southDown + northUp) - (southUp + northDown) + 360.0) / 4.0;
  };

  /**
   * Magnetic Azimuth of the Mark
   *
   * @param meanMark {Number} Decimal degrees
   * @param magneticSouthMeridian {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.magneticAzimuthMark = function (meanMark, magneticSouthMeridian) {
    return (meanMark + 90.0 - magneticSouthMeridian);
  };

  /**
   * Magnetic Declination
   *
   * @param magneticSouthMeridian {Number} Decimal degrees
   * @param geographicMeridian {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.magneticDeclination =
        function (magneticSouthMeridian, geographicMeridian, shift) {
    var magneticDecl = magneticSouthMeridian - geographicMeridian;
    while (magneticDecl > 90.0) {
      magneticDecl -= 180.0;
    }
    while (magneticDecl <= -90) {
      magneticDecl += 180.0;
    }
     // Apply the declination shift if there is one
    if (typeof shift !== 'undefined' && shift !== null) {
      magneticDecl += shift;
    }
     return (magneticDecl);
  };

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
  _this.magneticSouthMeridian = function (westDown, westUp, eastDown, eastUp) {
    return _this.mean(westDown, westUp, eastDown, eastUp);
  };

  /**
   * Helper method to compute the mean of up numeric values. If any given
   * value is not numeric, it is excluded from the mean.
   *
   * @param <variable> {Numeric}
   *      This method accepts a variable number of parameters. Each parameter
   *      should be numeric. Non-numeric parameters are excluded from the
   *      computed mean.
   */
  _this.mean = function () {
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
      return '&ndash;';
    }
  };

  /**
   * North
   *
   * @param northDown {Number} Decimal degrees
   * @param southUp {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.northDownMinusSouthUp = function (northDown, southUp) {
    return (northDown - southUp - 180.0);
  };

  /**
   * Scale Value
   *
   * @param absoluteH {Number} nT
   *
   * @return {Number} No units
   */
  _this.scaleValue = function (absoluteH) {
    if (!absoluteH) {
      return 1;
    }

    return (_SCALE_VALUE_COEFFICIENT / absoluteH);
  };

  /**
   * South
   *
   * @param southDown {Number} Decimal degrees
   * @param northUp {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.southDownMinusNorthUp = function (southDown, northUp) {
    return (southDown - northUp - 180.0);
  };

  /**
   * Converts degrees to radians.
   *
   * @param degrees {Number} Decimal degrees
   *
   * @return {Number} Radians
   */
  _this.toRadians = function (degrees) {
    return ((degrees * Math.PI) / 180);
  };

  /**
   * Vertical Component
   *
   * @param correctedF {Number} nT
   * @param inclination {Number} Decimal degrees
   *
   * @return {Number} nT
   */
  _this.verticalComponent = function (correctedF, inclination) {
    return (correctedF * Math.sin(_this.toRadians(inclination)));
  };

  /**
   * West
   *
   * @param westUp {Number} Decimal degrees
   * @param eastDown {Number} Decimal degrees
   *
   * @return {Number} Decimal degrees
   */
  _this.westUpMinusEastDown = function (westUp, eastDown) {
    return (westUp - eastDown);
  };

  /**
   * Baseline Z
   *
   * @param zAbsolute {Number} nT
   * @param zComputed {Number} nT
   *
   * @return {Number} nT
   */
  _this.zBaseline = function (zAbsolute, zComputed) {
    return (zAbsolute - zComputed);
  };

  /**
   * Clean up private variables, methods, and remove event listeners.
   */
  _this.destroy = function () {
    _this = null;
  };

  // Expose some static values
  BaselineCalculator._SCALE_VALUE_COEFFICIENT = _SCALE_VALUE_COEFFICIENT;


  return _this;
};

module.exports =  BaselineCalculator;
