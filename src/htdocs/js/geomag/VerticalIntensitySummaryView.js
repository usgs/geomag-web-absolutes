'use strict';

var Format = require('geomag/Formatter'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  factory: ObservatoryFactory()
};


  /**
   * Construct a new VerticalIntensitySummaryView.
   *
   * @param options {Object}
   *        view options.
   * @param options.calculator {geomag.ObservationBaselineCalculator}
   *        the calculator to use.
   * @param options.factory {geomag.ObservatoryFactory}
   *        the factory to use.
   * @parem options.reading {geomag.Reading}
   *        the reading to display.
   */
var VerticalIntensitySummaryView = function (options) {
  var _this,
      _initialize,

      _absValue,
      _baselineValue,
      _calculator,
      _endTime,
      _factory,
      _measurements,
      _name,
      _options,
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
        len = null;

    _options = Util.extend({}, _DEFAULTS, options);
    _calculator = _options.calculator;
    _factory = _options.factory;
    _reading = _options.reading;

    el.innerHTML = [
      '<th class="name" scope="row"></th>',
      '<td class="valid"><input type="checkbox" /></td>',
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
    _baselineValue = el.querySelector('.baseline-values');

    _measurements = _factory.getVerticalIntensityMeasurements(_reading);

    _valid.addEventListener('change', _onChange);

    _reading.on('change:vertical_intensity_valid', 'render', _this);

    // watches for changes in pier/mark
    _calculator.on('change', 'render', _this);

    for (i = 0, len = _measurements.length; i < len; i++) {
      _measurements[i].on('change', 'render', _this);
    }

    _this.render();
  };

  _onChange = function () {
    _reading.set({
      vertical_intensity_valid: (_valid.checked ? 'Y' : 'N')
    });
  };


  _this.render = function () {
    var measurements = _reading.get('measurements').data(),
        startTime = null,
        endTime = null,
        times;

    _name.innerHTML = _reading.get('set_number');

    _valid.checked = (_reading.get('vertical_intensity_valid') === 'Y');

    times = _factory.getMeasurementValuesInclination(measurements, 'time');
    if (times.length > 0) {
      startTime = Math.min.apply(null, times);
      endTime = Math.max.apply(null, times);
    }
    _startTime.innerHTML = Format.time(startTime);
    _endTime.innerHTML = Format.time(endTime);

    _absValue.innerHTML =
        Format.nanoteslas(_calculator.verticalComponent(_reading));
    _ord.innerHTML = Format.nanoteslas(_calculator.meanZ(_reading));
    _baselineValue.innerHTML =
        Format.nanoteslas(_calculator.zBaseline(_reading));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = VerticalIntensitySummaryView;
