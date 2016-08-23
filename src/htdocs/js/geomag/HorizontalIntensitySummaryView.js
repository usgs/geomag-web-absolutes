'use strict';

var Format = require('geomag/Formatter'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  factory: null
};

var _ID_SET = 0;


/**
 * Construct a new HorizontalIntensitySummaryView.
 *
 * @param option {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param options.factory {geomag.ObservatoryFactory}
 *        the factory to use.
 * @parem options.reading {geomag.Reading}
 *        the reading to display.
 */
var HorizontalIntensitySummaryView = function (options) {
  var _this,
      _initialize,

      _absValue,
      _baselineValues,
      _calculator,
      _endTime,
      _factory,
      _measurements,
      _name,
      _ord,
      _reading,
      _startTime,
      _valid,

      _onChange;


  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    var el = _this.el,
        i = null,
        len = null,
        set = ++_ID_SET;

    options = Util.extend({}, _DEFAULTS, options);
    _calculator = options.calculator;
    _factory = options.factory || ObservatoryFactory();
    _reading = options.reading;

    el.innerHTML = [
      '<th class="name" scope="row"></th>',
      '<td class="valid">',
        '<input type="checkbox" id="valid-horizontal-', set, '" />',
        '<label for="valid-horizontal-', set, '"></label>',
      '</td>',
      '<td class="start-time"></td>',
      '<td class="end-time"></td>',
      '<td class="abs-value"></td>',
      '<td class="ord"></td>',
      '<td class="baseline-values"></td>'
    ].join('');

    // save references to elements that will be updated during render
    _name = el.querySelector('.name');
    _valid = el.querySelector('.valid > input');
    _startTime = el.querySelector('.start-time');
    _endTime = el.querySelector('.end-time');
    _absValue = el.querySelector('.abs-value');
    _ord = el.querySelector('.ord');
    _baselineValues = el.querySelector('.baseline-values');

    _measurements = _factory.getHorizontalIntensityMeasurements(_reading);

    _valid.addEventListener('change', _onChange);

    _reading.on('change:horizontal_intensity_valid', 'render', _this);

    // watches for changes in pier/mark
    _calculator.on('change', 'render', _this);

    for (i = 0, len = _measurements.length; i < len; i ++){
      _measurements[i].on('change', 'render', _this);
    }

    _this.render();
  };

  _onChange = function () {
    _reading.set({
      horizontal_intensity_valid: (_valid.checked ? 'Y' : 'N')
    });
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Remove event listeners
        _valid.removeEventListener('change', _onChange);

        // Clean up private method
        _onChange = null;

        // Clean up private methods
        _absValue = null;
        _baselineValues = null;
        _calculator = null;
        _endTime = null;
        _factory = null;
        _measurements = null;
        _name = null;
        _ord = null;
        _reading = null;
        _startTime = null;
        _valid = null;
      },
      // parent class destroy method
      _this.destroy);

  _this.render = function () {
    var endTime,
        inclinations,
        isValid,
        measurements,
        startTime,
        times;

    startTime = null;
    endTime = null;
    measurements = _reading.get('measurements').data();
    inclinations = _factory.getInclinations(measurements);

    _name.innerHTML = _reading.get('set_number');

    isValid = (_reading.get('horizontal_intensity_valid') === 'Y');
    _valid.checked = isValid;
    if (isValid) {
      _this.el.classList.remove('rejected');
    } else {
      _this.el.classList.add('rejected');
    }

    times = _factory.getMeasurementValues(inclinations, 'time');
    if (times.length > 0) {
      startTime = Math.min.apply(null, times);
      endTime = Math.max.apply(null, times);
    }
    _startTime.innerHTML = Format.time(startTime);
    _endTime.innerHTML = Format.time(endTime);

    _absValue.innerHTML =
        Format.nanoteslas(_calculator.horizontalComponent(_reading));
    _ord.innerHTML =
        Format.nanoteslas(_calculator.meanH(_reading));
    _baselineValues.innerHTML =
        Format.nanoteslas(_calculator.hBaseline(_reading));
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = HorizontalIntensitySummaryView;
