'use strict';

var Calculator = require('geomag/ObservationBaselineCalculator'),
    DeclinationView = require('geomag/DeclinationView'),
    InclinationView = require('geomag/InclinationView'),
    MagnetometerOrdinatesView = require('geomag/MagnetometerOrdinatesView'),
    Measurement = require('geomag/Measurement'),
    MeasurementView = require('geomag/MeasurementView'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  calculator: null
};


/**
 * Construct a new ReadingView.
 *
 * @param options {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param options.observation {Observation}
 *        observation to display.
 * @param options.reading {geomag.Reading}
 *        the reading to display.
 */
var ReadingView = function (options) {
  var _this,
      _initialize,

      _calculator,
      _eastDownMeasurement,
      _eastUpMeasurement,
      _firstMarkDownMeasurement,
      _firstMarkUpMeasurement,
      _measurements,
      _northDownMeasurement,
      _northUpMeasurement,
      _observation,
      _reading,
      _secondMarkDownMeasurement,
      _secondMarkUpMeasurement,
      _southDownMeasurement,
      _southUpMeasurement,
      _westDownMeasurement,
      _westUpMeasurement,

      _formatType,
      _onTimeChange,
      _showWarning;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);
    /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    _calculator = options.calculator || Calculator();
    _observation = options.observation;
    _reading = options.reading;
    _measurements = _reading.getMeasurements();

    _firstMarkUpMeasurement = _measurements[Measurement.FIRST_MARK_UP][0];
    _firstMarkDownMeasurement = _measurements[Measurement.FIRST_MARK_DOWN][0];
    _westDownMeasurement = _measurements[Measurement.WEST_DOWN][0];
    _eastDownMeasurement = _measurements[Measurement.EAST_DOWN][0];
    _westUpMeasurement = _measurements[Measurement.WEST_UP][0];
    _eastUpMeasurement = _measurements[Measurement.EAST_UP][0];
    _secondMarkUpMeasurement = _measurements[Measurement.SECOND_MARK_UP][0];
    _secondMarkDownMeasurement = _measurements[Measurement.SECOND_MARK_DOWN][0];

    _southDownMeasurement = _measurements[Measurement.SOUTH_DOWN][0];
    _northUpMeasurement = _measurements[Measurement.NORTH_UP][0];
    _southUpMeasurement = _measurements[Measurement.SOUTH_UP][0];
    _northDownMeasurement = _measurements[Measurement.NORTH_DOWN][0];

    _westDownMeasurement.on('change:time', _onTimeChange, _westDownMeasurement);
    _eastDownMeasurement.on('change:time', _onTimeChange, _eastDownMeasurement);
    _westUpMeasurement.on('change:time', _onTimeChange, _westUpMeasurement);
    _eastUpMeasurement.on('change:time', _onTimeChange, _eastUpMeasurement);
    _southDownMeasurement.on('change:time', _onTimeChange,
          _southDownMeasurement);
    _northDownMeasurement.on('change:time', _onTimeChange,
          _northDownMeasurement);
    _southUpMeasurement.on('change:time', _onTimeChange,
          _southUpMeasurement);
    _northUpMeasurement.on('change:time', _onTimeChange,
          _northUpMeasurement);

    _this.el.innerHTML = [
      '<section class="reading-view">',
        '<section class="row">',
          '<h2>Declination</h2>',
          '<section class="declination-input">',
            '<table>',
              '<thead>',
                '<tr>',
                  '<th scope="col">&nbsp;</th>',
                  '<th scope="col" class="measurement-time">Time</th>',
                  '<th scope="col" class="measurement-degrees">Deg</th>',
                  '<th scope="col" class="measurement-minutes">Min</th>',
                  '<th scope="col" class="measurement-seconds">Sec</th>',
                  '<th scope="col" class="measurement-h">H <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-e">E <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-z">Z <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-f">F <small>(nT)</small></th>',
                '</tr>',
              '</thead>',
              '<tbody>',
                '<tr class="first-mark-up"></tr>',
                '<tr class="first-mark-down"></tr>',
                '<tr class="west-down"></tr>',
                '<tr class="east-down"></tr>',
                '<tr class="west-up"></tr>',
                '<tr class="east-up"></tr>',
                '<tr class="second-mark-up"></tr>',
                '<tr class="second-mark-down"></tr>',
              '</tbody>',
            '</table>',
          '</section>',
          '<section class="declination-output"></section>',
        '</section>',
        '<section class="row">',
          '<h2>Inclination</h2>',
          '<section class="inclination-input">',
            '<table>',
              '<thead>',
                '<tr>',
                  '<th scope="col">&nbsp;</th>',
                  '<th scope="col" class="measurement-time">Time</th>',
                  '<th scope="col" class="measurement-degrees">Deg</th>',
                  '<th scope="col" class="measurement-minutes">Min</th>',
                  '<th scope="col" class="measurement-seconds">Sec</th>',
                  '<th scope="col" class="measurement-h">H <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-e">E <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-z">Z <small>(nT)</small></th>',
                  '<th scope="col" class="measurement-f">F <small>(nT)</small></th>',
                '</tr>',
              '</thead>',
              '<tbody>',
                '<tr class="south-down"></tr>',
                '<tr class="north-up"></tr>',
                '<tr class="south-up"></tr>',
                '<tr class="north-down"></tr>',
              '</tbody>',
            '</table>',
          '</section>',
          '<section class="inclination-output"></section>',
        '</section>',
        '<section >',
          '<h2>Magnetometer Ordinates</h2>',
          '<section class="magnetometer-ordinates-output"></section>',
        '</section>',
      '</section>'
    ].join('');

    _this._firstMarkUpView = MeasurementView({
      el: _this.el.querySelector('.first-mark-up'),
      measurement: _firstMarkUpMeasurement,
      observation: _observation
    });
    _this._firstMarkDownView = MeasurementView({
      el: _this.el.querySelector('.first-mark-down'),
      measurement: _firstMarkDownMeasurement,
      observation: _observation
    });
    _this._secondMarkUpView = MeasurementView({
      el: _this.el.querySelector('.second-mark-up'),
      measurement: _secondMarkUpMeasurement,
      observation: _observation
    });
    _this._secondMarkDownView = MeasurementView({
      el: _this.el.querySelector('.second-mark-down'),
      measurement: _secondMarkDownMeasurement,
      observation: _observation
    });

    _this._westDownView = MeasurementView({
      el: _this.el.querySelector('.west-down'),
      measurement: _westDownMeasurement,
      observation: _observation
    });
    _this._eastDownView = MeasurementView({
      el: _this.el.querySelector('.east-down'),
      measurement: _eastDownMeasurement,
      observation: _observation
    });
    _this._westUpView = MeasurementView({
      el: _this.el.querySelector('.west-up'),
      measurement: _westUpMeasurement,
      observation: _observation
    });
    _this._eastUpView = MeasurementView({
      el: _this.el.querySelector('.east-up'),
      measurement: _eastUpMeasurement,
      observation: _observation
    });

    _this._southDownView = MeasurementView({
      el: _this.el.querySelector('.south-down'),
      measurement: _southDownMeasurement,
      observation: _observation
    });
    _this._northUpView = MeasurementView({
      el: _this.el.querySelector('.north-up'),
      measurement: _northUpMeasurement,
      observation: _observation
    });
    _this._southUpView = MeasurementView({
      el: _this.el.querySelector('.south-up'),
      measurement: _southUpMeasurement,
      observation: _observation
    });
    _this._northDownView = MeasurementView({
      el: _this.el.querySelector('.north-down'),
      measurement: _northDownMeasurement,
      observation: _observation
    });

    _this._declinationView = DeclinationView({
      el: _this.el.querySelector('.declination-output'),
      reading: _reading,
      observation: _observation,
      calculator: _calculator
    });

    _this._inclinationView = InclinationView({
      el: _this.el.querySelector('.inclination-output'),
      reading: _reading,
      observation: _observation,
      calculator: _calculator
    });

    _this._magnetometerOrdinatesView = MagnetometerOrdinatesView({
      el: _this.el.querySelector('.magnetometer-ordinates-output'),
      reading: _reading,
      observation: _observation,
      calculator: _calculator
    });
  };

  // within the scope of this method "this" is a measurement.
  _onTimeChange = function () {
    var i,
        isEarlierMeasurement,
        len,
        measurement,
        measurements,
        thatTime,
        thisTime;

    isEarlierMeasurement = true;

    measurements = [
      _westDownMeasurement,
      _eastDownMeasurement,
      _westUpMeasurement,
      _eastUpMeasurement,
      _southDownMeasurement,
      _northUpMeasurement,
      _southUpMeasurement,
      _northDownMeasurement
    ];

    thisTime = this.get('time') % 86400000; // Only look at time, not date

    for (i = 0, len = measurements.length; i < len; i++) {
      measurement = measurements[i];
      thatTime = measurement.get('time');

      if (thatTime === null) {
        continue;
      }

      thatTime = thatTime % 86400000; // Only look at time, not date

      if (this === measurement) {
        isEarlierMeasurement = false;
        continue;
      }

      if ((isEarlierMeasurement && thisTime < thatTime) ||
          (!isEarlierMeasurement && thisTime > thatTime)) {
        _showWarning(this, measurement);
        return;
      }
    }
  };

  _showWarning = function (currentMeasurement, conflictMeasurement) {
    var conflictType,
        currentType;

    conflictType = _formatType(conflictMeasurement.get('type'));
    currentType = _formatType(currentMeasurement.get('type'));

    ModalView(
      currentType + ' and ' + conflictType + ' appear to be out of order.' +
          '<br/><br/>Times are typically in ascending order are you sure ' +
          'this is correct?',
    {
      title: 'Time Warning',
      classes: ['modal-warning'],
      buttons: [{
        text: 'Okay',
        callback: function (evt, modal) {
          modal.hide();
        }
      }]
    }).show();

  };

  _formatType = function (type) {
    return '&ldquo;' + type.replace('Up', ' Up').replace('Down', ' Down') +
        '&rdquo;';
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Remove event listeners


        // Clean up private methods
        _formatType = null;
        _onTimeChange = null;
        _showWarning = null;

        // Clean up private variables
        _calculator = null;
        _eastDownMeasurement = null;
        _eastUpMeasurement = null;
        _firstMarkDownMeasurement = null;
        _firstMarkUpMeasurement = null;
        _measurements = null;
        _northDownMeasurement = null;
        _northUpMeasurement = null;
        _observation = null;
        _reading = null;
        _secondMarkDownMeasurement = null;
        _secondMarkUpMeasurement = null;
        _southDownMeasurement = null;
        _southUpMeasurement = null;
        _westDownMeasurement = null;
        _westUpMeasurement = null;
      },
      // parent class destroy method
      _this.destroy);

  _this.render = function () {
    // TODO :: Render current model
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = ReadingView;
