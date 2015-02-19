'use strict';

var Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULT_OPTIONS = {
  'baselineCalculator': null,
  'reading': null
};


  /**
   * Construct a new DeclinationView.
   *
   * @param option {Object}
   *        view options.
   * @param option.baselineCalculator {geomag.ObservationBaselineCalculator}
   *        the calculator to use.
   * @param option.reading {geomag.Reading}
   *        the reading to display.
   */
var DeclinationView = function (options) {
  var _this,
      _initialize,

      _options;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    var el = _this.el;

    _options = Util.extend({}, _DEFAULT_OPTIONS, options);

    _this._reading = _options.reading;
    _this._calculator = _options.baselineCalculator;
    _this._measurements = _this._reading.getMeasurements();

    el.classList.add('declination-view');
    el.innerHTML = [
      '<dl>',
        '<dt class="mag-s-meridian">Magnetic South Meridian</dt>',
        '<dd class="mag-s-meridian-value">&ndash;</dd>',
        '<dt class="mean-mark">Mean Mark</dt>',
        '<dd class="mean-mark-value">&ndash;</dd>',
        '<dt class="mag-az-of-mark">Magnetic Azimuth of Mark</dt>',
        '<dd class="mag-az-of-mark-value">&ndash;</dd>',
        '<dt class="true-az-of-mark">True Azimuth of Mark</dt>',
        '<dd class="true-az-of-mark-value">&ndash;</dd>',
        '<dt class="mag-declination">Magnetic Declination</dt>',
        '<dd class="mag-declination-value">&ndash;</dd>',

        '<dt class="west-up-minus-east-down">(WU - ED) * 60</dt>',
        '<dd class="west-up-minus-east-down-value">&ndash;</dd>',
        '<dt class="east-up-minus-west-down">(EU - WD) * 60</dt>',
        '<dd class="east-up-minus-west-down-value">&ndash;</dd>',
      '</dl>'
    ].join('');

    // save references to elements that will be updated during render
    _this._magneticSouthMeridian = el.querySelector('.mag-s-meridian-value');
    _this._meanMark = el.querySelector('.mean-mark-value');
    _this._magneticAzimuthOfMark = el.querySelector('.mag-az-of-mark-value');
    _this._trueAzimuthOfMark = el.querySelector('.true-az-of-mark-value');
    _this._magneticDeclination = el.querySelector('.mag-declination-value');

    _this._westUpMinusEastDown =
        el.querySelector('.west-up-minus-east-down-value');
    _this._eastUpMinusWestDown =
        el.querySelector('.east-up-minus-west-down-value');

    // when reading changes render view
    _options.reading.on('change', 'render', _this);

    // also render when any related inputs change
    _this._measurements[Measurement.FIRST_MARK_UP][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.FIRST_MARK_DOWN][0].on(
        'change', 'render', _this);

    _this._measurements[Measurement.WEST_DOWN][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.EAST_DOWN][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.WEST_UP][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.EAST_UP][0].on(
        'change', 'render', _this);

    _this._measurements[Measurement.SECOND_MARK_UP][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.SECOND_MARK_DOWN][0].on(
        'change', 'render', _this);

    // watches for changes in pier/mark
    _this._calculator.on('change', 'render', _this);

    // render current reading
    _this.render();
  };

  /**
   * Update view based on current reading values.
   */
  _this.render = function () {
    var calculator = _this._calculator,
        reading = _this._reading;

    _this._magneticSouthMeridian.innerHTML =
        Format.degreesAndDegreesMinutes(calculator.magneticSouthMeridian(reading));
    _this._meanMark.innerHTML = Format.degrees(calculator.meanMark(reading));
    _this._magneticAzimuthOfMark.innerHTML =
        Format.degrees(calculator.magneticAzimuthMark(reading));
    _this._trueAzimuthOfMark.innerHTML =
        Format.rawDegrees(calculator.trueAzimuthOfMark());
    _this._magneticDeclination.innerHTML =
        Format.degreesAndDegreesMinutes(calculator.magneticDeclination(reading));

    _this._westUpMinusEastDown.innerHTML =
        Format.minutes(calculator.westUpMinusEastDown(reading)*60);
    _this._eastUpMinusWestDown.innerHTML =
        Format.minutes(calculator.eastUpMinusWestDown(reading)*60);
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = DeclinationView;
