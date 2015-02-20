'use strict';

var BaselineCalculator = require('geomag/BaselineCalculator'),
    Measurement = require('geomag/Measurement'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  // model options
  pierCorrection: 0,
  trueAzimuthOfMark: 0
};


/**
 * Construct a new DeclinationSummaryView.
 *
 * @param options {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 */
var ObservationBaselineCalculator = function (options) {
  var _this,
      _initialize,

      _calculator;

    _this = Model(Util.extend({}, _DEFAULTS, options));

    _initialize = function (options) {
      // keep calculator outside model
      _calculator = options.calculator || BaselineCalculator();
    };

  /**
   * D Baseline
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} dBaseline
   */
  _this.dBaseline = function (reading) {
    return _calculator.dBaseline(
        _this.magneticDeclination(reading),
        _this.dComputed(reading)
    );
  };

  /**
   * D Computed
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} computedE
   */
  _this.dComputed = function (reading) {
    return _calculator.dComputed(
        _this.meanE(reading),
        _this.scaleValue(reading)
    );
  };

  /**
   * e
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} e
   */
  _this.eastUpMinusWestDown = function (reading){
    var measurements = reading.getMeasurements();

    return _calculator.eastUpMinusWestDown(
        measurements[Measurement.EAST_UP][0].get('angle'),
        measurements[Measurement.WEST_DOWN][0].get('angle')
    );
  };

  /**
   * E Baseline
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} eBaseline
   */
  _this.eBaseline = function (reading) {
    return _calculator.eBaseline(
        _this.dBaseline(reading),
        _this.scaleValue(reading)
    ); //
  };

  /**
   * F Corrected
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} fCorrected
   */
  _this.fCorrected = function (reading) {
    // dont need to check each measurement, use ns(ud)
    // (value will be null for measurement values that don't matter)

    return _calculator.fCorrected(
        _this.meanF(reading),
        _this.pierCorrection()
    );
  };

  /**
   * geographicMeridian
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} geographicMeridian
   */
  _this.geographicMeridian = function (reading) {
    // measurement.type (markup1, markup2)
    var measurements = reading.getMeasurements();

    return _calculator.geographicMeridian(
        measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
        measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
        _this.trueAzimuthOfMark()
    );
  };

  /**
   * getMeanValue
   *
   * @param {Object} reading, an observation reading
   * @param {String} channel, a measurement channel
   *
   * @return {Number} mean of the selected channel
   */
  _this.getMeanValue = function (reading, channel) {
    var measurements = reading.get('measurements'),
        total = 0,
        count = 0,
        value,
        i, len;

    if (measurements !== null) {
      measurements = measurements.data();
      for (i = 0, len = measurements.length; i < len; i++) {
        value = measurements[i].get(channel);
        if (value !== null) {
          total += value;
          count++;
        }
      }
    }

    if (count === 0) {
      return 0;
    }

    return total / count;
  };

  _this.getStats = function (data) {
    var mean = _calculator.mean.apply(_calculator, data),
        min = Math.min.apply(Math, data),
        max = Math.max.apply(Math, data),
        i = null,
        len = null,
        variance = 0,
        difference = null;

    for (i = 0, len = data.length; i < len; i++) {
      difference = mean - data[i];
      variance += difference * difference;
    }
    if (len === 0) {
      return {
        mean:NaN,
        min:NaN,
        max:NaN,
        stdDev: NaN
      };
    }
    variance /= len;

    return {
      mean: mean,
      min: min,
      max: max,
      stdDev: Math.sqrt(variance)
    };
  };

  /**
   * H Baseline
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} hBaseline
   */
  _this.hBaseline = function (reading) {
    return _calculator.hBaseline(
        _this.horizontalComponent(reading),
        _this.meanH(reading)
    );
  };

  /**
   * horizontalComponent
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} horizontalComponent
   */
  _this.horizontalComponent = function (reading) {
    return _calculator.horizontalComponent(
        _this.fCorrected(reading),
        _this.inclination(reading)
    );
  };

  /**
   * inclination
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} inclination
   */
  _this.inclination = function (reading) {
    var measurements = reading.getMeasurements();

    // measurement.type
    return _calculator.inclination(
        measurements[Measurement.SOUTH_DOWN][0].get('angle'),
        measurements[Measurement.SOUTH_UP][0].get('angle'),
        measurements[Measurement.NORTH_DOWN][0].get('angle'),
        measurements[Measurement.NORTH_UP][0].get('angle')
    );
  };

  /**
   * magneticAzimuthMark
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} magneticAzimuthMark
   */
  _this.magneticAzimuthMark = function (reading) {
    var measurements = reading.getMeasurements(),
        meanMark = null;

    meanMark = (
        measurements[Measurement.FIRST_MARK_UP][0].get('angle') +
        measurements[Measurement.FIRST_MARK_DOWN][0].get('angle') +
        measurements[Measurement.SECOND_MARK_UP][0].get('angle') +
        measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')) / 4;

    // meanMark = mark1/mark2(up/down) / 4
    return _calculator.magneticAzimuthMark(
        meanMark,
        _this.magneticSouthMeridian(reading)
    );
  };

  /**
   * magneticDeclination
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} magneticDeclination
   */
  _this.magneticDeclination = function (reading) {
    return _calculator.magneticDeclination(
        _this.magneticSouthMeridian(reading),
        _this.geographicMeridian(reading),
        reading.get('declination_shift')
    );
  };

  /**
   * magneticSouthMeridian
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} magneticSouthMeridian
   */
  _this.magneticSouthMeridian = function (reading) {
    var measurements = reading.getMeasurements();

    // measurement.type
    return _calculator.magneticSouthMeridian(
        measurements[Measurement.WEST_DOWN][0].get('angle'),
        measurements[Measurement.WEST_UP][0].get('angle'),
        measurements[Measurement.EAST_DOWN][0].get('angle'),
        measurements[Measurement.EAST_UP][0].get('angle')
    );
  };

  _this.meanE = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.mean(
      measurements[Measurement.WEST_DOWN][0].get('e'),
      measurements[Measurement.EAST_DOWN][0].get('e'),
      measurements[Measurement.WEST_UP][0].get('e'),
      measurements[Measurement.EAST_UP][0].get('e')
    );
  };

  _this.meanF = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.mean(
      measurements[Measurement.SOUTH_DOWN][0].get('f'),
      measurements[Measurement.NORTH_UP][0].get('f'),
      measurements[Measurement.SOUTH_UP][0].get('f'),
      measurements[Measurement.NORTH_DOWN][0].get('f')
    );
  };

  _this.meanH = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.mean(
      measurements[Measurement.SOUTH_DOWN][0].get('h'),
      measurements[Measurement.NORTH_UP][0].get('h'),
      measurements[Measurement.SOUTH_UP][0].get('h'),
      measurements[Measurement.NORTH_DOWN][0].get('h')
    );
  };

  /**
   * meanMark
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} meanMark
   */
  _this.meanMark = function (reading) {
    var measurements = reading.getMeasurements();

    // measurement.type
    return _calculator.mean(
        measurements[Measurement.FIRST_MARK_UP][0].get('angle'),
        measurements[Measurement.FIRST_MARK_DOWN][0].get('angle'),
        measurements[Measurement.SECOND_MARK_UP][0].get('angle'),
        measurements[Measurement.SECOND_MARK_DOWN][0].get('angle')
    );
  };

  _this.meanZ = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.mean(
      measurements[Measurement.SOUTH_DOWN][0].get('z'),
      measurements[Measurement.NORTH_UP][0].get('z'),
      measurements[Measurement.SOUTH_UP][0].get('z'),
      measurements[Measurement.NORTH_DOWN][0].get('z')
    );
  };

  /**
   * n
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} n
   */
  _this.northDownMinusSouthUp = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.northDownMinusSouthUp(
        measurements[Measurement.NORTH_DOWN][0].get('angle'),
        measurements[Measurement.SOUTH_UP][0].get('angle')
    );
  };

  /**
   * pierCorrection
   *
   * @return {Number} pierCorrection
   */
  _this.pierCorrection = function () {
    return _this.get('pierCorrection');
  };

  /**
   * scaleValue
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} scaleValue
   */
  _this.scaleValue = function (reading) {
    return _calculator.scaleValue(
        _this.horizontalComponent(reading)
    );
  };

  /**
   * s
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} s
   */
  _this.southDownMinusNorthUp = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.southDownMinusNorthUp(
        measurements[Measurement.SOUTH_DOWN][0].get('angle'),
        measurements[Measurement.NORTH_UP][0].get('angle')
    );
  };

  /**
   * trueAzimuthOfMark
   *
   * @return {Number} trueAzimuthOfMark
   */
  _this.trueAzimuthOfMark = function () {
    return _this.get('trueAzimuthOfMark');
  };

  /**
   * verticalComponent
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} verticalComponent
   */
  _this.verticalComponent = function (reading) {
    return _calculator.verticalComponent(
        _this.fCorrected(reading),
        _this.inclination(reading)
    );
  };

  /**
   * w
   *
   * @param {Object} reading, an observation reading
   *
   * @return {Number} w
   */
  _this.westUpMinusEastDown = function (reading) {
    var measurements = reading.getMeasurements();

    return _calculator.westUpMinusEastDown(
        measurements[Measurement.WEST_UP][0].get('angle'),
        measurements[Measurement.EAST_DOWN][0].get('angle')
    );
  };

  /**
   * Z Baseline
   *
   * @param {Object} reading, a reading from an observation
   *
   * @return {Number} zBaseline
   */
  _this.zBaseline = function (reading) {
    return _calculator.zBaseline(
        _this.verticalComponent(reading),
        _this.meanZ(reading)
    );
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservationBaselineCalculator;
