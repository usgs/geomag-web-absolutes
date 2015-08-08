'use strict';

var Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULT_OPTIONS = {
  'calculator': null,
  'reading': null
};


/**
 * Construct a new InclinationView.
 *
 * @param options {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param options.reading {geomag.Reading}
 *        the reading to display.
 */
var InclinationView = function (options) {
  var _this,
      _initialize,

      _options;

  _options = Util.extend({}, _DEFAULT_OPTIONS, options);
  _this = View(_options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    var el = _this.el;

    _this._reading = _options.reading;
    _this._calculator = _options.calculator;
    _this._measurements = _this._reading.getMeasurements();

    el.classList.add('inclination-view');
    el.innerHTML = [
      '<dl>',
        '<dt class="inclination">Inclination</dt>',
        '<dd class="inclination-value">&ndash;</dd>',
        '<dt class="horizontal-component">Horizontal Component</dt>',
        '<dd class="horizontal-component-value">&ndash;</dd>',
        '<dt class="vertical-component">Vertical Component</dt>',
        '<dd class="vertical-component-value">&ndash;</dd>',

        '<dt class="south-down-minus-north-up">(SD - NU - 180) * 60</dt>',
        '<dd class="south-down-minus-north-up-value">&ndash;</dd>',
        '<dt class="north-down-minus-south-up">(ND - SU - 180) * 60</dt>',
        '<dd class="north-down-minus-south-up-value">&ndash;</dd>',
      '</dl>'
    ].join('');

    // save references to elements that will be updated during render
    _this._inclinationAngle = el.querySelector('.inclination-value');
    _this._horizontalComponent =
        el.querySelector('.horizontal-component-value');
    _this._verticalComponent =
        el.querySelector('.vertical-component-value');

    _this._southDownMinusNorthUp = el.querySelector(
        '.south-down-minus-north-up-value');
    _this._northDownMinusSouthUp = el.querySelector(
        '.north-down-minus-south-up-value');

    // when reading changes render view
    _options.reading.on('change', 'render', _this);

    // also render when any related inputs change
    _this._measurements[Measurement.SOUTH_DOWN][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.NORTH_UP][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.SOUTH_UP][0].on(
        'change', 'render', _this);
    _this._measurements[Measurement.NORTH_DOWN][0].on(
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

    _this._inclinationAngle.innerHTML =
        Format.degreesAndDegreesMinutes(calculator.inclination(reading));

    _this._horizontalComponent.innerHTML =
        Format.nanoteslas(calculator.horizontalComponent(reading));
    _this._verticalComponent.innerHTML =
        Format.nanoteslas(calculator.verticalComponent(reading));

    _this._southDownMinusNorthUp.innerHTML =
        Format.minutes(calculator.southDownMinusNorthUp(reading)*60);
    _this._northDownMinusSouthUp.innerHTML =
        Format.minutes(calculator.northDownMinusSouthUp(reading)*60);
  };

  _initialize();
  options = null;
  return _this;
};

module.exports = InclinationView;
