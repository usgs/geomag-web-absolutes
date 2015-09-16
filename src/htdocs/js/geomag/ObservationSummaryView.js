/* global MOUNT_PATH */
'use strict';

var DeclinationSummaryView = require('geomag/DeclinationSummaryView'),
    Format = require('geomag/Formatter'),
    HorizontalSummaryView = require('geomag/HorizontalIntensitySummaryView'),
    UserFactory = require('geomag/UserFactory'),
    Util = require('util/Util'),
    VerticalSummaryView = require('geomag/VerticalIntensitySummaryView'),
    View = require('mvc/View');


var _DEFAULTS = {
  UserFactory: UserFactory({
    url: MOUNT_PATH + '/user_data.php'
  })
};


/**
 * Construct a new ObservationSummaryView.
 *
 * @param options {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 */
var ObservationSummaryView = function (options) {
  var _this,
      _initialize,

      _baselineMinMean,
      _baselineMinRange,
      _baselineMinStdDev,
      _baselineNtMean,
      _baselineNtRange,
      _baselineNtStdDev,
      _baselineValuesMean,
      _baselineValuesRange,
      _baselineValuesStdDev,
      _calculator,
      _checkedBy,
      _declinationSummaryView,
      _electronicsTemperature,
      _fluxgateTemperature,
      _horizontalIntensitySummaryView,
      _observation,
      _outsideTemperature,
      _pierTemperature,
      _protonTemperature,
      _readings,
      _userFactory,
      _verticalBaselineValuesMean,
      _verticalBaselineValuesRange,
      _verticalBaselineValuesStdDev,
      _verticalIntensitySummaryView,

      _bindings,
      _querySelectors,
      _renderDeclination,
      _renderHorizontalIntensitySummaryView,
      _renderInclination,
      _renderSummaryBottom,
      _renderVerticalIntensitySummaryView;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    var el;

    el = _this.el;

    _calculator = options.calculator;
    _observation = options.observation;
    _readings = _observation.get('readings');
    _userFactory = options.UserFactory;

    el.innerHTML = [
      '<section class="observation-summary-view">',
        '<h2>Declination</h2>',
        '<table class="declination-summary">',
          '<thead>',
            '<tr>',
              '<th scope="col" class="name">Set</th>',
              '<th scope="col" class="valid">Valid</th>',
              '<th scope="col" class="start-time">Start Time</th>',
              '<th scope="col" class="end-time">End Time</th>',
              '<th scope="col" class="absolute-declination">Absolute</th>',
              '<th scope="col" class="ord-min">Ordinate</th>',
              '<th scope="col" class="baseline-values">Baseline</th>',
              '<th scope="col" class="baseline-values">Baseline</th>',
              '<th scope="col" class="shift">180&#176; Shift</th>',
            '</tr>',
          '</thead>',
          '<tbody class="declination-summary-view">',
          '</tbody>',
          '<tfoot>',
            '<tr>',
              '<th scope="row" colspan="6" class="mean">Mean</th>',
              '<td class="baseline-min-mean"></td>',
              '<td class="baseline-nt-mean"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="declination-range">',
                  'Range</th>',
              '<td class="baseline-min-range"></td>',
              '<td class="baseline-nt-range"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="baseline-std-dev">',
                  'Standard Deviation</th>',
              '<td class="baseline-min-std-dev"></td>',
              '<td class="baseline-nt-std-dev"></td>',
            '</tr>',
          '</tfoot>',
        '</table>',
        '<hr/>',
        '<h2>Horizontal Intensity</h2>',
        '<table class="horizontal-summary">',
          '<thead>',
            '<tr>',
              '<th scope="col" class="name">Set</th>',
              '<th scope="col" class="valid">Valid</th>',
              '<th scope="col" class="start-time">Start Time</th>',
              '<th scope="col" class="end-time">End Time</th>',
              '<th scope="col" class="abs-value">Absolute</th>',
              '<th scope="col" class="ord">Ordinate</th>',
              '<th scope="col" class="baseline-values">Baseline</th>',
            '</tr>',
          '</thead>',
          '<tbody class="horizontal-intensity-summary-view">',
          '</tbody>',
          '<tfoot>',
            '<tr>',
              '<th scope="row" colspan="6" class="mean">Mean</th>',
              '<td class="baseline-values-mean"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="range">Range</th>',
              '<td class="baseline-values-range"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="Std-dev">',
                  'Standard Deviation</th>',
              '<td class="baseline-values-std-dev"></td>',
            '</tr>',
          '</tfoot>',
        '</table>',
        '<hr/>',
        '<h2>Vertical Intensity</h2>',
        '<table class="vertical-summary">',
          '<thead>',
            '<tr>',
              '<th scope="col" class="name">Set</th>',
              '<th scope="col" class="valid">Valid</th>',
              '<th scope="col" class="start-time">Start Time</th>',
              '<th scope="col" class="end-time">End Time</th>',
              '<th scope="col" class="abs-value">Absolute</th>',
              '<th scope="col" class="ord">Ordinate</th>',
              '<th scope="col" class="baseline-values">Baseline</th>',
            '</tr>',
          '</thead>',
          '<tbody class="vertical-intensity-summary-view">',
          '</tbody>',
          '<tfoot>',
            '<tr>',
              '<th scope="row" colspan="6" class="mean">Mean</th>',
              '<td class="vertical-baseline-values-mean"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="range">Range</th>',
              '<td class="vertical-baseline-values-range"></td>',
            '</tr>',
            '<tr>',
              '<th scope="row" colspan="6" class="std-dev">',
                  'Standard Deviation</th>',
              '<td class="vertical-baseline-values-std-dev"></td>',
            '</tr>',
          '</tfoot>',
        '</table>',
        '<hr/>',
        '<h2>Temperatures</h2>',
        '<table class="temperature-view">',
          '<thead>',
            '<tr>',
              '<th scope="col">Pier</th>',
              '<th scope="col">Electronics</th>',
              '<th scope="col">Fluxgate</th>',
              '<th scope="col">Proton</th>',
              '<th scope="col">Outside</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            '<tr>',
              '<td class="pier-temp-value"></td>',
              '<td class="electronics-temp-value"></td>',
              '<td class="fluxgate-temp-value"></td>',
              '<td class="proton-temp-value"></td>',
              '<td class="outside-temp-value"></td>',
            '</tr>',
          '</tbody>',
        '</table>',
      '</section>'
    ].join('');

    _querySelectors();
    _bindings();
    _this.render();
  };

  _bindings = function () {
    _calculator.on('change', 'render', _this);

    _observation.eachReading(function (reading) {
      reading.on('change', 'render', _this);
      reading.eachMeasurement(function (measurement) {
        measurement.on('change', 'render', _this);
      });
    });
  };

  _querySelectors = function () {
    var el;

    el = _this.el;

    // Declination summary view
    _declinationSummaryView = el.querySelector('.declination-summary-view');
    _baselineMinMean = el.querySelector('.baseline-min-mean');
    _baselineNtMean = el.querySelector('.baseline-nt-mean');
    _baselineMinRange = el.querySelector('.baseline-min-range');
    _baselineNtRange = el.querySelector('.baseline-nt-range');
    _baselineMinStdDev = el.querySelector('.baseline-min-std-dev');
    _baselineNtStdDev = el.querySelector('.baseline-nt-std-dev');

    // Horizontal Intensity Summary view
    _horizontalIntensitySummaryView =
      el.querySelector('.horizontal-intensity-summary-view');
    _baselineValuesMean = el.querySelector('.baseline-values-mean');
    _baselineValuesRange = el.querySelector('.baseline-values-range');
    _baselineValuesStdDev = el.querySelector('.baseline-values-std-dev');

    // Vertical Intensity Summary View
    _verticalIntensitySummaryView =
      el.querySelector('.vertical-intensity-summary-view');
    _verticalBaselineValuesMean =
      el.querySelector('.vertical-baseline-values-mean');
    _verticalBaselineValuesRange =
      el.querySelector('.vertical-baseline-values-range');
    _verticalBaselineValuesStdDev =
      el.querySelector('.vertical-baseline-values-std-dev');

    // Bottom Summary View
    _observation.on('change', 'render', _this);
    _pierTemperature = el.querySelector('.pier-temp-value');
    _electronicsTemperature = el.querySelector('.electronics-temp-value');
    _fluxgateTemperature = el.querySelector('.fluxgate-temp-value');
    _protonTemperature = el.querySelector('.proton-temp-value');
    _outsideTemperature = el.querySelector('.outside-temp-value');
    _checkedBy = el.querySelector('.checked-by-value');
  };

  _renderDeclination = function () {
    var baselineD,
        baselineDStats,
        eBaseline,
        eBaselineStats,
        i,
        len,
        range,
        reading,
        readings;

    readings = _readings.data();
    baselineD = [];
    eBaseline = [];

    Util.empty(_declinationSummaryView);

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      // create view if it does not exist
      if (!reading.hasOwnProperty('_declinationSummary')) {
        reading._declinationSummary = DeclinationSummaryView({
          calculator: _calculator,
          el: document.createElement('tr'),
          reading: reading
        });
      }
      // insert view
      _declinationSummaryView.appendChild(reading._declinationSummary.el);

      // insert view
      if (reading.get('declination_valid') === 'Y') {
        baselineD.push(_calculator.dBaseline(reading)*60);
        eBaseline.push(_calculator.eBaseline(reading));
      }
    }

    baselineDStats = _calculator.getStats(baselineD);
    eBaselineStats = _calculator.getStats(eBaseline);

    _baselineMinMean.innerHTML = Format.minutes(baselineDStats.mean);
    _baselineNtMean.innerHTML = Format.nanoteslas(eBaselineStats.mean);

    range = baselineDStats.max - baselineDStats.min;
    _baselineMinRange.innerHTML = Format.minutes(range);

    range = eBaselineStats.max - eBaselineStats.min;
    _baselineNtRange.innerHTML = Format.nanoteslas(range);

    _baselineMinStdDev.innerHTML = Format.minutes(baselineDStats.stdDev);
    _baselineNtStdDev.innerHTML = Format.nanoteslas(eBaselineStats.stdDev);
  };

  _renderHorizontalIntensitySummaryView = function () {
    var baselineH,
        baselineHStats,
        i,
        len,
        range,
        reading,
        readings;

    readings = _readings.data();
    baselineH = [];

    Util.empty(_horizontalIntensitySummaryView);

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      // create view if it does not exist
      if (!reading.hasOwnProperty('_horizontalIntensitySummary')) {
        reading._horizontalIntensitySummary = HorizontalSummaryView({
          calculator: _calculator,
          el: document.createElement('tr'),
          reading: reading
        });
      }
      // insert view
      _horizontalIntensitySummaryView.appendChild(
        reading._horizontalIntensitySummary.el);

      // insert view
      if (reading.get('horizontal_intensity_valid') === 'Y') {
        baselineH.push(_calculator.hBaseline(reading));
      }
    }

    baselineHStats = _calculator.getStats(baselineH);

    _baselineValuesMean.innerHTML = Format.nanoteslas(baselineHStats.mean);

    range = baselineHStats.max - baselineHStats.min;
    _baselineValuesRange.innerHTML = Format.nanoteslas(range);

    _baselineValuesStdDev.innerHTML = Format.nanoteslas(baselineHStats.stdDev);
  };

  _renderInclination = function () {
    _renderHorizontalIntensitySummaryView();
    _renderVerticalIntensitySummaryView();
  };

  _renderSummaryBottom = function () {
    var electTemp,
        fluxgateTemp,
        outsideTemp,
        pierTemp,
        protonTemp;

    electTemp = _observation.get('elect_temperature');
    fluxgateTemp = _observation.get('flux_temperature');
    pierTemp = _observation.get('pier_temperature');
    protonTemp = _observation.get('proton_temperature');
    outsideTemp = _observation.get('outside_temperature');

    _pierTemperature.innerHTML = Format.celsius(pierTemp,1);
    _electronicsTemperature.innerHTML = Format.celsius(electTemp,1);
    _fluxgateTemperature.innerHTML = Format.celsius(fluxgateTemp,1);
    _protonTemperature.innerHTML = Format.celsius(protonTemp,1);
    _outsideTemperature.innerHTML = Format.celsius(outsideTemp,1);
  };

  _renderVerticalIntensitySummaryView = function () {
    var baselineZ,
        baselineZStats,
        i,
        len,
        range,
        reading,
        readings;

    readings = _readings.data();
    baselineZ = [];

    Util.empty(_verticalIntensitySummaryView);

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      // Create view if it does not exits
      if (!reading.hasOwnProperty('_verticalIntensitySummary')) {
        reading._verticalIntensitySummary = VerticalSummaryView({
          calculator: _calculator,
          el: document.createElement('tr'),
          reading: reading
        });
      }
      // insert view
      _verticalIntensitySummaryView.appendChild
          (reading._verticalIntensitySummary.el);

      if (reading.get('vertical_intensity_valid') === 'Y') {
        baselineZ.push(_calculator.zBaseline(reading));
      }
    }

    baselineZStats = _calculator.getStats(baselineZ);

    _verticalBaselineValuesMean.innerHTML =
        Format.nanoteslas(baselineZStats.mean);

    range = baselineZStats.max - baselineZStats.min;
    _verticalBaselineValuesRange.innerHTML = Format.nanoteslas(range);

    _verticalBaselineValuesStdDev.innerHTML =
        Format.nanoteslas(baselineZStats.stdDev);
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Remove event bindings
        _calculator.removeEventListener('change', 'render', _this);
        _observation.eachReading(function (reading) {
          reading.eachMeasurement(function (measurement) {
            measurement.removeEventListener('change', 'render', _this);
          });
          reading.removeEventListener('change', 'render', _this);
        });

        // Clean up private methods
        _bindings = null;
        _querySelectors = null;
        _renderDeclination = null;
        _renderHorizontalIntensitySummaryView = null;
        _renderInclination = null;
        _renderSummaryBottom = null;
        _renderVerticalIntensitySummaryView = null;

        // Clean up private variables
        _baselineMinMean = null;
        _baselineMinRange = null;
        _baselineMinStdDev = null;
        _baselineNtMean = null;
        _baselineNtRange = null;
        _baselineNtStdDev = null;
        _baselineValuesMean = null;
        _baselineValuesRange = null;
        _baselineValuesStdDev = null;
        _calculator = null;
        _checkedBy = null;
        _declinationSummaryView = null;
        _electronicsTemperature = null;
        _fluxgateTemperature = null;
        _horizontalIntensitySummaryView = null;
        _observation = null;
        _outsideTemperature = null;
        _pierTemperature = null;
        _protonTemperature = null;
        _readings = null;
        _userFactory = null;
        _verticalBaselineValuesMean = null;
        _verticalBaselineValuesRange = null;
        _verticalBaselineValuesStdDev = null;
        _verticalIntensitySummaryView = null;
      },
      // parent class destroy method
      _this.destroy);

  _this.render = function () {
    _renderDeclination();
    _renderInclination();
    _renderSummaryBottom();
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservationSummaryView;
