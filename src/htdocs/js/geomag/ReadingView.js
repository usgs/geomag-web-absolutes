'use strict';

var DeclinationView = require('geomag/DeclinationView'),
    InclinationView = require('geomag/InclinationView'),
    MagnetometerOrdinatesView = require('geomag/MagnetometerOrdinatesView'),
    Measurement = require('geomag/Measurement'),
    MeasurementView = require('geomag/MeasurementView'),
    ModalView = require('mvc/ModalView'),
    ObservationBaselineCalculator =
        require('geomag/ObservationBaselineCalculator'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  baselineCalculator: ObservationBaselineCalculator()
};


  /**
   * Construct a new DeclinationSummaryView.
   *
   * @param options {Object}
   *        view options.
   * @param options.baselineCalculator
   * @param options.observation
   * @param options.reading
   */
var ReadingView = function (options) {
  var _this,
      _initialize,

      _options,

      _formatType,
      _onTimeChange,
      _showWarning;

  _options = Util.extend({}, _DEFAULTS, options);
  _this = View(_options);
    /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    _this._observation = _options.observation;
    _this._reading = _options.reading;
    _this._calculator = _options.baselineCalculator;
    _this._measurements = _this._reading.getMeasurements();

    _this._firstMarkUpMeasurement =
        _this._measurements[Measurement.FIRST_MARK_UP][0];
    _this._firstMarkDownMeasurement =
        _this._measurements[Measurement.FIRST_MARK_DOWN][0];
    _this._westDownMeasurement = _this._measurements[Measurement.WEST_DOWN][0];
    _this._eastDownMeasurement = _this._measurements[Measurement.EAST_DOWN][0];
    _this._westUpMeasurement = _this._measurements[Measurement.WEST_UP][0];
    _this._eastUpMeasurement = _this._measurements[Measurement.EAST_UP][0];
    _this._secondMarkUpMeasurement =
        _this._measurements[Measurement.SECOND_MARK_UP][0];
    _this._secondMarkDownMeasurement =
        _this._measurements[Measurement.SECOND_MARK_DOWN][0];

    _this._southDownMeasurement =
        _this._measurements[Measurement.SOUTH_DOWN][0];
    _this._northUpMeasurement = _this._measurements[Measurement.NORTH_UP][0];
    _this._southUpMeasurement = _this._measurements[Measurement.SOUTH_UP][0];
    _this._northDownMeasurement =
        _this._measurements[Measurement.NORTH_DOWN][0];

    _this._westDownMeasurement.on('change:time', _onTimeChange,
          _this._westDownMeasurement);
    _this._eastDownMeasurement.on('change:time', _onTimeChange,
          _this._eastDownMeasurement);
    _this._westUpMeasurement.on('change:time', _onTimeChange,
          _this._westUpMeasurement);
    _this._eastUpMeasurement.on('change:time', _onTimeChange,
          _this._eastUpMeasurement);
    _this._southDownMeasurement.on('change:time', _onTimeChange,
          _this._southDownMeasurement);
    _this._northDownMeasurement.on('change:time', _onTimeChange,
          _this._northDownMeasurement);
    _this._southUpMeasurement.on('change:time', _onTimeChange,
          _this._southUpMeasurement);
    _this._northUpMeasurement.on('change:time', _onTimeChange,
          _this._northUpMeasurement);

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
      measurement: _this._firstMarkUpMeasurement,
      observation: _this._observation
    });

    _this._firstMarkDownView = MeasurementView({
      el: _this.el.querySelector('.first-mark-down'),
      measurement: _this._firstMarkDownMeasurement,
      observation: _this._observation
    });

    _this._westDownView = MeasurementView({
      el: _this.el.querySelector('.west-down'),
      measurement: _this._westDownMeasurement,
      observation: _this._observation
    });

    _this._eastDownView = MeasurementView({
      el: _this.el.querySelector('.east-down'),
      measurement: _this._eastDownMeasurement,
      observation: _this._observation
    });

    _this._westUpView = MeasurementView({
      el: _this.el.querySelector('.west-up'),
      measurement: _this._westUpMeasurement,
      observation: _this._observation
    });

    _this._eastUpView = MeasurementView({
      el: _this.el.querySelector('.east-up'),
      measurement: _this._eastUpMeasurement,
      observation: _this._observation
    });

    _this._secondMarkUpView = MeasurementView({
      el: _this.el.querySelector('.second-mark-up'),
      measurement: _this._secondMarkUpMeasurement,
      observation: _this._observation
    });

    _this._secondMarkDownView = MeasurementView({
      el: _this.el.querySelector('.second-mark-down'),
      measurement: _this._secondMarkDownMeasurement,
      observation: _this._observation
    });

    _this._declinationView = DeclinationView({
      el: _this.el.querySelector('.declination-output'),
      reading: _this._reading,
      observation: _this._observation,
      baselineCalculator: _this._calculator
    });


    _this._southDownView = MeasurementView({
      el: _this.el.querySelector('.south-down'),
      measurement: _this._southDownMeasurement,
      observation: _this._observation
    });

    _this._northUpView = MeasurementView({
      el: _this.el.querySelector('.north-up'),
      measurement: _this._northUpMeasurement,
      observation: _this._observation
    });

    _this._southUpView = MeasurementView({
      el: _this.el.querySelector('.south-up'),
      measurement: _this._southUpMeasurement,
      observation: _this._observation
    });

    _this._northDownView = MeasurementView({
      el: _this.el.querySelector('.north-down'),
      measurement: _this._northDownMeasurement,
      observation: _this._observation
    });

    _this._inclinationView = InclinationView({
      el: _this.el.querySelector('.inclination-output'),
      reading: _this._reading,
      observation: _this._observation,
      baselineCalculator: _this._calculator
    });


    _this._magnetometerOrdinatesView = MagnetometerOrdinatesView({
      el: _this.el.querySelector('.magnetometer-ordinates-output'),
      reading: _this._reading,
      observation: _this._observation,
      baselineCalculator: _this._calculator
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
      _this._westDownMeasurement,
      _this._eastDownMeasurement,
      _this._westUpMeasurement,
      _this._eastUpMeasurement,
      _this._southDownMeasurement,
      _this._northUpMeasurement,
      _this._southUpMeasurement,
      _this._northDownMeasurement
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


  _this.render = function () {
    // TODO :: Render current model
  };

  _initialize();
  options = null;
  return _this;
};

module.exports = ReadingView;
