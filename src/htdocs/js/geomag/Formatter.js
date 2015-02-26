'use strict';

var _CELSIUS = '°C',
    _DEFAULT_DIGITS = 3,
    _DEGREES = '°',
    _FAHRENHEIT = '°F',
    _MINUTES = '\'',
    _NANOTESLAS = 'nT';


var _units = function (units) {
  return ['<span class="units">', units, '</span>'].join('');
};

/**
 * Date to String
 *
 * @param time {Date|Integer}
 *      Date or millisecond epoch timestamp.
 *
 * @return {String}
 *      A string formatted as UTC "YYYY-MM-DD".
 */
var date = function (time) {
  var y, m, d;

  if (!(time instanceof Date)) {
    time = new Date(time);
  }

  y = time.getUTCFullYear();
  m = time.getUTCMonth() + 1;
  d = time.getUTCDate();

  return [y, (m<10?'-0':'-'), m, (d<10?'-0':'-'), d].join('');
};

/**
 * Date Time to String
 *
 * @param date time {Date|Integer}
 *      Date or millisecond epoch timestamp.
 *
 * @return {String}
 *      A string formatted as UTC "YYYY-MM-DD HH:mm:ss".
 */
var dateTime = function (time) {
  if (!(time instanceof Date)) {
    time = new Date(time);
  }

  return date(time) + ' ' + time(time);
};

/**
 * Round a value to the closest even Number
 *
 * @param value {Number}
 *      The value to be rounded.
 *
 * @return {Number}
 *      The rounded number.
 */
var roundToEven = function (value) {
  return Math.round(value / 2) * 2;
};

/**
 * Truncate a number, because javascript developers forgot that
 * floor only works for positive numbers.
 *
 * @param value {Number}
 *      The value to be truncated.
 *
 * @return {Number}
 *      The truncated number.
 */
var truncate = function (value) {
  return value > 0 ? Math.floor(value) : Math.ceil(value);
};

/**
 * Round a value at x digits past the decimal to the closest
 * even number, if the value is exactly a half.
 *
 * @param value {Number}
 *      The value to be rounded.
 *
 * @return {Number}
 *      If the number is a half, return closest even number.
 */
var roundHalfToEven = function (value, digits) {
  if (typeof digits === 'undefined') {
    digits = 0;
  }

  var EPSILON = 0.001,
      n = Math.pow(10, digits),
      powValue = value * n,
      diff = powValue - truncate(powValue);

  if (Math.abs(diff - 0.5) < EPSILON) {
    return (roundToEven(powValue) / n).toFixed(digits);
  }
  return value.toFixed(digits);
};

/**
 * Degrees, as a temperature, no rounding
 *
 * @param temperature {Number|String}
 *
 * @return formatted number with units
 *    {Float} Temperature degrees
 */
var rawCelsius = function (temperature) {
  var buf = [];

  if (isNaN(temperature)) {
    return '&ndash;';
  }

  buf.push(
    '<span class="temperature">',
    temperature, _units(_CELSIUS),
    '</span>');

  return buf.join('');
};

/**
 * Degrees, as an angle, no rounding
 *
 * @param angle {Number|String}
 *
 * @return formatted number with units
 *    {Float} Angle degrees
 */
var rawDegrees = function (angle) {
  var buf = [];

  if (isNaN(angle)) {
    return '&ndash;';
  }

  buf.push(
      '<span class="deg">',
        angle, _units(_DEGREES),
      '</span>');

  return buf.join('');
};

/**
 * Degrees, as a temperature, no rounding
 *
 * @param temperature {Number|String}
 *
 * @return formatted number with units
 *    {Float} Temperature degrees
 */
var rawFahrenheit = function (temperature) {
  var buf = [];

  if (isNaN(temperature)) {
    return '&ndash;';
  }

  buf.push(
    '<span class="temperature">',
    temperature, _units(_FAHRENHEIT),
    '</span>');

  return buf.join('');
};

/**
 * Minutes, as an angle
 *
 * @param angle {Number|String}
 *
 * @return formatted number with units
 *    {Float} Angle minutes, 2 decimal places
 */
var rawMinutes = function (angle) {
  var buf = [];

  if (isNaN(angle)) {
    return '&ndash;';
  }

  buf.push(
      '<span class="minutes">',
        angle, _units(_MINUTES),
      '</span>');

  return buf.join('');
};

/**
 * nT (nano-teslas), no rounding
 *
 * @param {Number} nT
 *
 * @return formatted number with units
 *    {Float} nT
 */
var rawNanoteslas = function (nT) {
  var buf = [];

  if (isNaN(nT)) {
    return '&ndash;';
  }

  buf.push(
      '<span class="nano-teslas">',
        nT, _units(_NANOTESLAS),
      '</span>');

  return buf.join('');
};

/**
 * Decimal angle to degrees, minutes, seconds
 *
 * @param angle {Number} Decimal degrees
 *
 * @return {Array of Integers}
 *
 * @see MeasurementViewTest#degree_inversion_check
 */
var decimalToDms = function (angle) {
  var degrees = parseInt(angle, 10),
      minutes = (angle - degrees) * 60,
      seconds = Math.round((minutes - parseInt(minutes, 10)) * 60, 10);

  minutes = parseInt(minutes, 10);

  // Correct any errors due to floating point
  if (seconds >= 60) {
    minutes += parseInt(seconds / 60, 10);
    seconds = seconds % 60;
  }

  return [degrees, minutes, seconds];
};

/**
 * Degrees, as an angle
 *
 * @param angle {Number} Decimal degrees
 * @param digits {Integer} Numbers after decimal place
 *
 * @return formatted number with units
 *    {Float} Angle degrees with (digits) decimal places
 */
var degrees = function (angle, digits) {
  if (isNaN(angle)) {
    return '&ndash;';
  }

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  return rawDegrees(roundHalfToEven(angle,digits));
};

/**
 * Minutes, as an angle
 *
 * @param angle {Number} Decimal minutes
 * @param digits {Integer} Numbers after decimal place
 *
 * @return formatted number with units
 *    {Float} Angle minutes with (digits) decimal places
 */
var minutes = function (angle, digits) {
  if (isNaN(angle)) {
    return '&ndash;';
  }

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  if (isNaN(angle)) {
    return '&ndash;';
  } else {
    return rawMinutes(roundHalfToEven(angle,digits));
  }
};

/**
 * Degrees Minutes, as an angle
 *
 * @param angle {Number} Decimal degrees
 * @param digits {Integer} Numbers after decimal place
 *
 * @return 2 formatted numbers with units separated by a space
 *    {Int} Angle degrees
 *    {Float} Decimal angle minutes with (digits) decimal places
 */
var degreesMinutes = function (angle, digits) {
  var buf = [],
      degrees,
      localMinutes;

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  degrees = parseInt(angle, 10);
  localMinutes = (angle - degrees) * 60;

  if (isNaN(degrees) || isNaN(localMinutes)) {
    buf.push('&ndash;');
  } else {
    buf.push(
        rawDegrees(degrees),
        '&nbsp;',
        minutes(localMinutes, digits));
  }
  return buf.join('');
};

/**
 * Degrees and Degrees Minutes, as an angle
 *
 * @param angle {Number} Decimal degrees
 * @param digits {Integer} Numbers after decimal place
 *
 * @return 3 formatted numbers with units
 *    {Float} Decimal angle degrees with (digits) decimal places
 *    {Int} Angle degrees
 *    {Float} Decimal angle minutes with (digits) decimal places
 */
var degreesAndDegreesMinutes = function (angle, digits) {
  var buf = [];

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  buf.push(
      degrees(angle, digits),
      '<span class="degrees-minutes">',
        degreesMinutes(angle, digits),
      '</span>');

  return buf.join('');
};

/**
 * Degrees, minutes, seconds to decimal angle
 *
 * @param degs {Number}
 *        The degree portion of the angle value. If this is a decimal,
 *        then the fractional portion is converted to minutes.
 * @param mins {Number}
 *        The minutes portion of the angle value. If this is a decimal,
 *        then the fractional portion is converted to seconds.
 * @param secs {Integer}
 *        The seconds portion of the angle value.
 *
 * @return {Decimal}
 *        The decimal degrees for the given DMS value.
 *
 * @see MeasurementViewTest#degree_inversion_check
 */
var dmsToDecimal = function (degs, mins, secs) {
  return (parseInt(secs, 10) / 3600) + (parseFloat(mins) / 60) +
      parseFloat(degs);
};

/**
 * Degrees, as a temperature
 *
 * @param temperature {Number} Decimal degrees
 * @param digits {Integer} Numbers after decimal place
 *
 * @return formatted number with units
 *    {Float} Temperature degrees with (digits) decimal places
 */
var celsius = function (temperature, digits) {
  if (isNaN(temperature) || (temperature === null)) {
    return '&ndash;';
  }

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }
  return rawCelsius(roundHalfToEven(temperature,digits));
};

/**
 * Degrees, as a temperature
 *
 * @param temperature {Number} Decimal degrees
 * @param digits {Integer} Numbers after decimal place
 *
 * @return formatted number with units
 *    {Float} Temperature degrees with (digits) decimal places
 */
var fahrenheit = function (temperature, digits) {
  if (isNaN(temperature) || (temperature === null)) {
    return '&ndash;';
  }

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  return rawCelsius(roundHalfToEven(temperature,digits));
};

/**
 * nT (nano-teslas)
 *
 * @param {Number} nT
 * @param digits {Integer} Numbers after decimal place
 *
 * @return formatted number with units
 *    {Float} nT with (digits) decimal places
 */
var nanoteslas = function (nT, digits) {
  if (isNaN(nT)) {
    return '&ndash;';
  }

  if (typeof digits === 'undefined') {
    digits = _DEFAULT_DIGITS;
  }

  if (isNaN(nT)) {
    return '&ndash;';
  } else {
    return rawNanoteslas(roundHalfToEven(nT, digits));
  }
};

/**
 * Parse a date string into an epoch timestamp.
 *
 * @param date {String}
 *        UTC date in format 'YYYY-MM-DD'.
 * @return {Number} corresponding epoch timestamp (for 00:00:00), or null.
 */
var parseDate = function (date) {
  if (date !== '') {
    var parts = date.split('-');
    return Date.UTC(parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10));
  }
  return null;
};

/**
 * Relative Time
 *
 * @param time {String}
 *      The formatted time string to parse. The date for the returned time
 *      is inherited from the observation "begin" attribute.
 * @param offset {Date|Number}
 *      Base time as Date object or millisecond epoch time stamp.
 *      Default is new date if not specified.
 *      Only uses UTC year month and day from this offset.
 *
 * @return {Integer}
 *      The millisecond timestamp since the epoch.
 */
var parseRelativeTime = function (relativeTime, offset) {
  var timeString = relativeTime.replace(/[^\d]/g, ''),
      calculatedTime = 0,
      hours = 0,
      minutes = 0,
      seconds = 0;

  // Offset should default to 0 if it doesn't exist
  if (typeof offset === 'undefined' || offset === null) {
    offset = new Date();
  } else if (!(offset instanceof Date)) {
    offset = new Date(offset);
  }

  // Parse time string
  if (timeString.length === 4) {
    // HHMM
    hours = parseInt(timeString.substr(0, 2), 10);
    minutes = parseInt(timeString.substr(2, 2), 10);
  } else if (timeString.length === 5) {
    // HMMSS
    hours = parseInt(timeString.substr(0, 1), 10);
    minutes = parseInt(timeString.substr(1, 2), 10);
    seconds = parseInt(timeString.substr(3, 2), 10);
  } else if (timeString.length === 6) {
    // HHMMSS
    hours = parseInt(timeString.substr(0, 2), 10);
    minutes = parseInt(timeString.substr(2, 2), 10);
    seconds = parseInt(timeString.substr(4, 2), 10);
  } else {
    throw new Error('Unexpected time string');
  }

  calculatedTime = Date.UTC(offset.getUTCFullYear(),
        offset.getUTCMonth(), offset.getUTCDate(),
        hours, minutes, seconds, 0);

  return calculatedTime;
};

/**
 * Time to String
 *
 * @param time {Date|Integer}
 *      Date or millisecond epoch timestamp.
 *
 * @return {String}
 *      A string formatted as UTC "HH:MM:SS".
 */
var time = function (time) {
  var h, m, s;

  if (!(time instanceof Date)) {
    time = new Date(time);
  }

  h = time.getUTCHours();
  m = time.getUTCMinutes();
  s = time.getUTCSeconds();

  return [(h<10?'0':''), h, (m<10?':0':':'), m, (s<10?':0':':'), s].join('');
};

var Formatter = {
  _units: _units,
  celsius: celsius,
  date: date,
  dateTime: dateTime,
  decimalToDms: decimalToDms,
  degrees: degrees,
  degreesAndDegreesMinutes: degreesAndDegreesMinutes,
  degreesMinutes: degreesMinutes,
  dmsToDecimal: dmsToDecimal,
  fahrenheit: fahrenheit,
  minutes: minutes,
  nanoteslas: nanoteslas,
  parseDate: parseDate,
  parseRelativeTime: parseRelativeTime,
  rawCelsius: rawCelsius,
  rawDegrees: rawDegrees,
  rawFahrenheit: rawFahrenheit,
  rawMinutes: rawMinutes,
  rawNanoteslas: rawNanoteslas,
  roundHalfToEven: roundHalfToEven,
  roundToEven: roundToEven,
  time: time,
  truncate: truncate
};

module.exports = Formatter;
