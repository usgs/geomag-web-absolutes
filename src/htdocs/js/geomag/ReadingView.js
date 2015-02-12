/* global define */
define([
  'mvc/View',
  'util/Util',

  'geomag/DeclinationView',
  'geomag/InclinationView',
  'geomag/MagnetometerOrdinatesView',
  'geomag/Measurement',
  'geomag/MeasurementView',
  'geomag/ObservationBaselineCalculator'
], function (
  View,
  Util,

  DeclinationView,
  InclinationView,
  MagnetometerOrdinatesView,
  Measurement,
  MeasurementView,
  ObservationBaselineCalculator
) {
  'use strict';


  var DEFAULTS = {
    baselineCalculator:new ObservationBaselineCalculator()
  };


  var ReadingView = function (options) {
    this._options = Util.extend({}, DEFAULTS, options);
    View.call(this, this._options);
  };
  ReadingView.prototype = Object.create(View.prototype);


  ReadingView.prototype.render = function () {
    // TODO :: Render current model
  };

  ReadingView.prototype._initialize = function () {
    this._observation = this._options.observation;
    this._reading = this._options.reading;
    this._calculator = this._options.baselineCalculator;
    this._measurements = this._reading.getMeasurements();

    this._firstMarkUpMeasurement =
        this._measurements[Measurement.FIRST_MARK_UP][0];
    this._firstMarkDownMeasurement =
        this._measurements[Measurement.FIRST_MARK_DOWN][0];
    this._westDownMeasurement = this._measurements[Measurement.WEST_DOWN][0];
    this._eastDownMeasurement = this._measurements[Measurement.EAST_DOWN][0];
    this._westUpMeasurement = this._measurements[Measurement.WEST_UP][0];
    this._eastUpMeasurement = this._measurements[Measurement.EAST_UP][0];
    this._secondMarkUpMeasurement =
        this._measurements[Measurement.SECOND_MARK_UP][0];
    this._secondMarkDownMeasurement =
        this._measurements[Measurement.SECOND_MARK_DOWN][0];

    this._southDownMeasurement = this._measurements[Measurement.SOUTH_DOWN][0];
    this._northUpMeasurement = this._measurements[Measurement.NORTH_UP][0];
    this._southUpMeasurement = this._measurements[Measurement.SOUTH_UP][0];
    this._northDownMeasurement = this._measurements[Measurement.NORTH_DOWN][0];

    this._el.innerHTML = [
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

    this._firstMarkUpView = new MeasurementView({
      el: this._el.querySelector('.first-mark-up'),
      measurement: this._firstMarkUpMeasurement,
      observation: this._observation
    });

    this._firstMarkDownView = new MeasurementView({
      el: this._el.querySelector('.first-mark-down'),
      measurement: this._firstMarkDownMeasurement,
      observation: this._observation
    });

    this._westDownView = new MeasurementView({
      el: this._el.querySelector('.west-down'),
      measurement: this._westDownMeasurement,
      observation: this._observation
    });

    this._eastDownView = new MeasurementView({
      el: this._el.querySelector('.east-down'),
      measurement: this._eastDownMeasurement,
      observation: this._observation
    });

    this._westUpView = new MeasurementView({
      el: this._el.querySelector('.west-up'),
      measurement: this._westUpMeasurement,
      observation: this._observation
    });

    this._eastUpView = new MeasurementView({
      el: this._el.querySelector('.east-up'),
      measurement: this._eastUpMeasurement,
      observation: this._observation
    });

    this._secondMarkUpView = new MeasurementView({
      el: this._el.querySelector('.second-mark-up'),
      measurement: this._secondMarkUpMeasurement,
      observation: this._observation
    });

    this._secondMarkDownView = new MeasurementView({
      el: this._el.querySelector('.second-mark-down'),
      measurement: this._secondMarkDownMeasurement,
      observation: this._observation
    });

    this._declinationView = new DeclinationView({
      el: this._el.querySelector('.declination-output'),
      reading: this._reading,
      observation: this._observation,
      baselineCalculator: this._calculator
    });


    this._southDownView = new MeasurementView({
      el: this._el.querySelector('.south-down'),
      measurement: this._southDownMeasurement,
      observation: this._observation
    });

    this._northUpView = new MeasurementView({
      el: this._el.querySelector('.north-up'),
      measurement: this._northUpMeasurement,
      observation: this._observation
    });

    this._southUpView = new MeasurementView({
      el: this._el.querySelector('.south-up'),
      measurement: this._southUpMeasurement,
      observation: this._observation
    });

    this._northDownView = new MeasurementView({
      el: this._el.querySelector('.north-down'),
      measurement: this._northDownMeasurement,
      observation: this._observation
    });

    this._inclinationView = new InclinationView({
      el: this._el.querySelector('.inclination-output'),
      reading: this._reading,
      observation: this._observation,
      baselineCalculator: this._calculator
    });


    this._magnetometerOrdinatesView = new MagnetometerOrdinatesView({
      el: this._el.querySelector('.magnetometer-ordinates-output'),
      reading: this._reading,
      observation: this._observation,
      baselineCalculator: this._calculator
    });
  };


  return ReadingView;
});

