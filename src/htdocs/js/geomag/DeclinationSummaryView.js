'use strict';

var Format = require('geomag/Formatter'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  factory: new ObservatoryFactory()
};

  /**
   * Construct a new DeclinationSummaryView.
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
var DeclinationSummaryView = function (options) {
  var _this,
      _initialize,

      _options,

      _onChange;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    var calculator,
        el = _this.el,
        factory,
        i = null,
        len = null,
        reading;

    _options = Util.extend({}, _DEFAULTS, options);
    calculator = _options.calculator;
    factory = _options.factory;
    reading = _options.reading;

    _this.el.innerHTML = [
      '<th class="name" scope="row"></th>',
      '<td class="valid"><input type="checkbox" /></td>',
      '<td class="start-time"></td>',
      '<td class="end-time"></td>',
      '<td class="absolute-declination"></td>',
      '<td class="ord-min"></td>',
      '<td class="baseline-min"></td>',
      '<td class="baseline-nt"></td>',
      '<td class="observer"></td>',
      '<td class="shift">',
        '<select>',
          '<option value="-180">-180</option>',
          '<option value="0" selected="selected">0</option>',
          '<option value="180">+180</option>',
        '</select>',
      '</td>'
    ].join('');

    // save references to elements that will be updated during render
    _this._name = el.querySelector('.name');
    _this._valid = el.querySelector('.valid > input');
    _this._startTime = el.querySelector('.start-time');
    _this._endTime = el.querySelector('.end-time');
    _this._absolute = el.querySelector('.absolute-declination');
    _this._ordMin = el.querySelector('.ord-min');
    _this._baselineMin = el.querySelector('.baseline-min');
    _this._eBaseline = el.querySelector('.baseline-nt');
    _this._observer = el.querySelector('.observer');
    _this._shift = el.querySelector('.shift > select');

    _this._reading = reading;
    _this._calculator = calculator;

    _this._measurements = factory.getDeclinationMeasurements(reading);

    _this._valid.addEventListener('change', _onChange);
    _this._shift.addEventListener('change', _onChange);

    _this._reading.on('change:declination_valid', 'render', _this);
    _this._reading.on('change:declination_shift', 'render', _this);

    // watches for changes in pier/mark
    _this._calculator.on('change', 'render', _this);

    for (i = 0, len = _this._measurements.length; i < len; i++) {
      _this._measurements[i].on('change', 'render', _this);
    }

    _this.render();
  };

  _onChange = function () {
    _this._reading.set({
      declination_valid: (_this._valid.checked ? 'Y' : 'N'),
      declination_shift: parseInt(_this._shift.value, 10)
    });
  };

  _this.render = function () {
    var reading = _this._reading,
        measurements = reading.get('measurements').data(),
        factory = _options.factory,
        startTime = null,
        endTime = null,
        times;

    _this._name.innerHTML = reading.get('set_number');

    _this._valid.checked = (reading.get('declination_valid') === 'Y');

    times = factory.getMeasurementValues(measurements, 'time');
    if (times.length > 0) {
      startTime = Math.min.apply(null, times);
      endTime = Math.max.apply(null, times);
    }
    _this._startTime.innerHTML = Format.time(startTime);
    _this._endTime.innerHTML = Format.time(endTime);

    _this._shift.value = reading.get('declination_shift');

    _this._absolute.innerHTML = Format.degreesMinutes(
        _this._calculator.magneticDeclination(reading));

    _this._ordMin.innerHTML =
        Format.minutes(_this._calculator.dComputed(reading)*60);
    _this._baselineMin.innerHTML =
        Format.minutes(_this._calculator.dBaseline(reading)*60);
    _this._eBaseline.innerHTML =
        Format.nanoteslas(_this._calculator.eBaseline(reading));
    _this._observer.innerHTML = _this._reading.get('observer') || '';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = DeclinationSummaryView;
