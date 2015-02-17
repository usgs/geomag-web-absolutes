/* global MOUNT_PATH */
'use strict';

var DeclinationSummaryView = require('geomag/DeclinationSummaryView'),
    Format = require('geomag/Formatter'),
    HorizontalIntensitySummaryView = require('geomag/HorizontalIntensitySummaryView'),
    UserFactory = require('geomag/UserFactory'),
    Util = require('util/Util'),
    VerticalIntensitySummaryView = require('geomag/VerticalIntensitySummaryView'),
    View = require('mvc/View');


var _DEFAULTS = {
  UserFactory: new UserFactory({
    url: MOUNT_PATH + '/user_data.php'
  })
};


/**
 * Construct a new ObservationSummaryView.
 *
 * @param options {Object}
 *        view options.
 * @param options.baselineCalculator
 * @param options.observation
 * @param options.UserFactory
 */
var ObservationSummaryView = function (options) {
  var _this,
      _initialize,

      _options,

      _bindings,
      _onChange,
      _querySelectors,
      _renderDeclination,
      _renderHorizontalIntensitySummaryView,
      _renderInclination,
      _renderSummaryBottom,
      _renderVerticalIntensitySummaryView;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    var el = _this.el;

    _options = Util.extend({}, _DEFAULTS, options);

    _this._observation = _options.observation;
    _this._calculator = _options.baselineCalculator;
    _this._readings = _observation.get('readings');
    _this._userFactory = _options.UserFactory;

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
              '<th scope="col" class="observer">Observer</th>',
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
              '<th scope="col" class="observer">Observer</th>',
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
              '<th scope="col" class="observer">Observer</th>',
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
        '<hr/>',
        '<section class="reviewer">',
          '<h2>Reviewer</h2>',
          '<div>Reviewed by <span class="checked-by-value"></span></div>',
          '<label for="observation-remarks">Reviewer comments</label>',
          '<textarea id="observation-remarks"></textarea>',
        '</section>',
      '</section>'
    ].join('');

    _querySelectors();
    _bindings();
    _this.render();
  };

  _bindings = function () {
    _this._remarks.addEventListener('change', _onChange);
    _this._calculator.on('change', _this.render, _this);

    _this._observation.eachReading(function (reading) {
      reading.on('change', _this.render, _this);
      reading.eachMeasurement(function (measurement) {
        measurement.on('change', _this.render, _this);
      });
    });
  };

  _onChange = function () {
    _this._observation.set({
      annotation: this._remarks.value
    });
  };

  _querySelectors = function () {
    var el = _this.el;

    // Declination summary view
    _this._declinationSummaryView =
      el.querySelector('.declination-summary-view');
    _this._baselineMinMean = el.querySelector('.baseline-min-mean');
    _this._baselineNtMean = el.querySelector('.baseline-nt-mean');
    _this._baselineMinRange = el.querySelector('.baseline-min-range');
    _this._baselineNtRange = el.querySelector('.baseline-nt-range');
    _this._baselineMinStdDev = el.querySelector('.baseline-min-std-dev');
    _this._baselineNtStdDev = el.querySelector('.baseline-nt-std-dev');

    // Horizontal Intensity Summary view
    _this._horizontalIntensitySummaryView =
      el.querySelector('.horizontal-intensity-summary-view');
    _this._baselineValuesMean = el.querySelector('.baseline-values-mean');
    _this._baselineValuesRange = el.querySelector('.baseline-values-range');
    _this._baselineValuesStdDev = el.querySelector('.baseline-values-std-dev');

    // Vertical Intensity Summary View
    _this._verticalIntensitySummaryView =
      el.querySelector('.vertical-intensity-summary-view');
    _this._verticalBaselineValuesMean =
      el.querySelector('.vertical-baseline-values-mean');
    _this._verticalBaselineValuesRange =
      el.querySelector('.vertical-baseline-values-range');
    _this._verticalBaselineValuesStdDev =
      el.querySelector('.vertical-baseline-values-std-dev');

    // Bottom Summary View
    _this._observation.on('change', _this.render, _this);
    _this._pierTemperature = el.querySelector('.pier-temp-value');
    _this._electronicsTemperature = el.querySelector('.electronics-temp-value');
    _this._fluxgateTemperature = el.querySelector('.fluxgate-temp-value');
    _this._protonTemperature = el.querySelector('.proton-temp-value');
    _this._outsideTemperature = el.querySelector('.outside-temp-value');
    _this._checkedBy = el.querySelector('.checked-by-value');
    _this._remarks = el.querySelector('.reviewer > textarea');
  };

  _renderDeclination = function () {
    var readings = _this._readings.data(),
        declinationSummaryView = _this._declinationSummaryView,
        calculator = _this._calculator,
        i = null,
        len = null,
        reading,
        range,
        baselineD = [],
        eBaseline = [],
        baselineDStats,
        eBaselineStats;

    Util.empty(declinationSummaryView);

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];
      // create view if it does not exist
      if (!reading.hasOwnProperty('_declinationSummary')) {
        reading._declinationSummary = new DeclinationSummaryView({
          el: document.createElement('tr'),
          reading: reading,
          calculator: calculator
        });
      }
      // insert view
      declinationSummaryView.appendChild(reading._declinationSummary._el);

      // insert view
      if (reading.get('declination_valid') === 'Y') {
        baselineD.push(calculator.dBaseline(reading));
        eBaseline.push(calculator.eBaseline(reading));
      }
    }

    baselineDStats = calculator.getStats(baselineD);
    eBaselineStats = calculator.getStats(eBaseline);

    _this._baselineMinMean.innerHTML = Format.minutes(baselineDStats.mean);
    _this._baselineNtMean.innerHTML =
        Format.nanoteslas(eBaselineStats.mean);

    range = baselineDStats.max - baselineDStats.min;
    _this._baselineMinRange.innerHTML = Format.minutes(range);

    range = eBaselineStats.max - eBaselineStats.min;
    _this._baselineNtRange.innerHTML = Format.nanoteslas(range);

    _this._baselineMinStdDev.innerHTML =
        Format.minutes(baselineDStats.stdDev);
    _this._baselineNtStdDev.innerHTML =
        Format.nanoteslas(eBaselineStats.stdDev);
  };

  _renderHorizontalIntensitySummaryView = function () {
    var readings = _this._readings.data(),
        horizontalIntensitySummaryView = _this._horizontalIntensitySummaryView,
        calculator = _this._calculator,
        i = null,
        len = null,
        reading,
        range,
        baselineH = [],
        baselineHStats;

    Util.empty(horizontalIntensitySummaryView);

    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      if (!reading.hasOwnProperty('_horizontalIntensitySummary')) {
        reading._horizontalIntensitySummary =
            new HorizontalIntensitySummaryView({
          el:document.createElement('tr'),
          reading:reading,
          calculator:calculator
        });
      }
      // insert view
      horizontalIntensitySummaryView.appendChild(
        reading._horizontalIntensitySummary._el);

      if (reading.get('horizontal_intensity_valid') === 'Y') {
        baselineH.push(calculator.hBaseline(reading));
      }
    }
    baselineHStats = calculator.getStats(baselineH);
    _this._baselineValuesMean.innerHTML =
        Format.nanoteslas(baselineHStats.mean);

    range = baselineHStats.max - baselineHStats.min;
    _this._baselineValuesRange.innerHTML = Format.nanoteslas(range);

    _this._baselineValuesStdDev.innerHTML =
        Format.nanoteslas(baselineHStats.stdDev);
  };

  _renderInclination = function () {
    _this._renderHorizontalIntensitySummaryView();
    _this._renderVerticalIntensitySummaryView();
  };

  _renderSummaryBottom = function () {
    var observation = _this._observation,
        reviewed = observation.get('reviewed'),
        reviewer = observation.get('reviewer_user_id');

    _this._pierTemperature.innerHTML =
        Format.celsius(observation.get('pier_temperature'),1);
    _this._electronicsTemperature.innerHTML = 'elec temp';
    _this._fluxgateTemperature.innerHTML = 'flux temp';
    _this._protonTemperature.innerHTML = 'prot temp';
    _this._outsideTemperature.innerHTML = 'outs temp';
    _this._remarks.innerHTML = observation.get('annotation');

    if (reviewed === 'Y' && reviewer) {
      // set reviewer to reviwer_user_id while fetching the user name.
      _this._checkedBy.innerHTML = reviewer;

      _this._userFactory.get({
        data: {'id': reviewer},
        success: function (data) {
          // replace reviwer_user_id with user name once it is returned.
          _this._checkedBy.innerHTML = data.name;
        }
      });
    }
  };

  _renderVerticalIntensitySummaryView = function () {
    var readings = _this._readings.data(),
        verticalIntensitySummaryView = _this._verticalIntensitySummaryView,
        calculator = _this._calculator,
        i = null,
        len = null,
        reading,
        range,
        baselineZ = [],
        baselineZStats;

    Util.empty(verticalIntensitySummaryView);
    for (i = 0, len = readings.length; i < len; i++) {
      reading = readings[i];

      // Create view if it does not exits
      if (!reading.hasOwnProperty('_verticalIntensitySummary')) {
        reading._verticalIntensitySummary = new VerticalIntensitySummaryView({
          el: document.createElement('tr'),
          reading: reading,
          calculator: calculator
        });
      }
      // insert view
      verticalIntensitySummaryView.appendChild
          (reading._verticalIntensitySummary._el);

      if (reading.get('vertical_intensity_valid') === 'Y') {
        baselineZ.push(calculator.zBaseline(reading));
      }
    }
    baselineZStats = calculator.getStats(baselineZ);

    _this._verticalBaselineValuesMean.innerHTML =
        Format.nanoteslas(baselineZStats.mean);

    range = baselineZStats.max - baselineZStats.min;
    _this._verticalBaselineValuesRange.innerHTML = Format.nanoteslas(range);

    _this._verticalBaselineValuesStdDev.innerHTML =
        Format.nanoteslas(baselineZStats.stdDev);
  };

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
