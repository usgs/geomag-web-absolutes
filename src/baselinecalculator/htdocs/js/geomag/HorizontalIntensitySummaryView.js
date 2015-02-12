'use strict';

var Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  factory: new ObservatoryFactory()
};


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

      _options,

      _onChange;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    var calculator,
        el = _this.el,
        factory,
        reading,
        i = null,
        len = null;

    _options = Util.extend({}, _DEFAULTS, options);
    calculator = _options.calculator;
    factory = _options.factory;
    reading = _options.reading;

    el.innerHTML = [
      '<th class="name" scope="row"></th>',
      '<td class="valid"><input type="checkbox" /></td>',
      '<td class="start-time"></td>',
      '<td class="end-time"></td>',
      '<td class="abs-value"></td>',
      '<td class="ord"></td>',
      '<td class="baseline-values"></td>',
      '<td class="observer"></td>'
    ].join('');

    // save references to elements that will be updated during render
    _this._name = el.querySelector('.name');
    _this._valid = el.querySelector('.valid > input');
    _this._startTime = el.querySelector('.start-time');
    _this._endTime = el.querySelector('.end-time');
    _this._absValue = el.querySelector('.abs-value');
    _this._ord = el.querySelector('.ord');
    _this._baselineValues = el.querySelector('.baseline-values');
    _this._observer = el.querySelector('.observer');

    _this._reading = reading;
    _this._calculator = calculator;

    _this._measurements = factory.getHorizontalIntensityMeasurements(reading);

    _this._valid.addEventListener('change', _onChange);

    _this._reading.on('change:horizontal_intensity_valid', _this.render, _this);

    // watches for changes in pier/mark
    _this._calculator.on('change', _this.render, _this);

    for (i = 0, len = _this._measurements.length; i < len; i ++){
      _this._measurements[i].on('change', _this.render, _this);
    }

    _this.render();
  };

  _onChange = function () {
    _this._reading.set({
      horizontal_intensity_valid: (_this._valid.checked ? 'Y' : 'N')
    });
  };

  _this.render = function () {
    var calculator = _this._calculator,
        reading = _this._reading,
        measurements = reading.get('measurements').data(),
        factory = _options.factory,
        startTime = null,
        endTime = null,
        times;

    _this._name.innerHTML = reading.get('set_number');

    _this._valid.checked = (reading.get('horizontal_intensity_valid') === 'Y');

    times = factory.getMeasurementValues(measurements, 'time');
    if (times.length > 0) {
      startTime = Math.min.apply(null, times);
      endTime = Math.max.apply(null, times);
    }
    _this._startTime.innerHTML = Format.time(startTime);
    _this._endTime.innerHTML = Format.time(endTime);

    _this._absValue.innerHTML =
        Format.nanoteslas(calculator.horizontalComponent(reading));
    _this._ord.innerHTML =
        Format.nanoteslas(calculator.meanH(reading));
    _this._baselineValues.innerHTML =
        Format.nanoteslas(calculator.hBaseline(reading));
    _this._observer.innerHTML = _this._reading.get('observer') || '';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = HorizontalIntensitySummaryView;
