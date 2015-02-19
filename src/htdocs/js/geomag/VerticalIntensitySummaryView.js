'use strict';

var Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


  var DEFAULTS = {
    factory: new ObservatoryFactory()
  };


var VerticalIntensitySummaryView = function (options) {
  var _this,
      _initialize,

      _options,

      _onChange;

  _initialize = function () {
    var el = _this.el,
        factory = _this._options.factory,
        reading = _this._options.reading,
        i = null,
        len = null;

    _options = Util.extend({}, DEFAULTS, options);

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

    _this._name = el.querySelector('.name');
    _this._valid = el.querySelector('.valid > input');
    _this._startTime = el.querySelector('.start-time');
    _this._endTime = el.querySelector('.end-time');
    _this._absValue = el.querySelector('.abs-value');
    _this._ord = el.querySelector('.ord');
    _this._baselineValue = el.querySelector('.baseline-values');
    _this._observer = el.querySelector('.observer');

    _this._reading = _this._options.reading;
    _this._calculator = _this._options.calculator;

    _this._measurements = factory.getVerticalIntensityMeasurements(reading);

    _this._valid.addEventListener('change', _onChange);

    _this._reading.on('change:vertical_intensity_valid', _this.render, _this);

    _this._calculator.on('change', _this.render, _this);

    for (i = 0, len = _this._measurements.length; i < len; i++) {
      _this._measurements[i].on('change', _this.render, _this);
    }
    _this.render();
  };

  _onChange = function () {
    _this._reading.set({
      vertical_intensity_valid: (_this._valid.checked ? 'Y' : 'N')
    });
  };


  _this.render = function () {
    var reading = _this._reading,
        measurements = reading.get('measurements').data(),
        factory = _this._options.factory,
        startTime = null,
        endTime = null,
        times;

    _this._name.innerHTML = reading.get('set_number');

    _this._valid.checked = (reading.get('vertical_intensity_valid') === 'Y');

    times = factory.getMeasurementValues(measurements, 'time');
    if (times.length > 0) {
      startTime = Math.min.apply(null, times);
      endTime = Math.max.apply(null, times);
    }
    _this._startTime.innerHTML = Format.time(startTime);
    _this._endTime.innerHTML = Format.time(endTime);

    _this._absValue.innerHTML =
        Format.nanoteslas(_this._calculator.verticalComponent(reading));
    _this._ord.innerHTML = Format.nanoteslas(_this._calculator.meanZ(reading));
    _this._baselineValue.innerHTML =
        Format.nanoteslas(_this._calculator.zBaseline(reading));
    _this._observer.innerHTML = _this._reading.get('observer') || '';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = VerticalIntensitySummaryView;
