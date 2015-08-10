'use strict';

var Calculator = require('geomag/ObservationBaselineCalculator'),
    Formatter = require('geomag/Formatter'),
    ObservationSummaryView = require('geomag/ObservationSummaryView'),
    ReadingView = require('geomag/ReadingView'),
    TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var __truncate_angle_seconds = function (angle) {
  var dms = Formatter.decimalToDms(angle);

  return Formatter.dmsToDecimal(dms[0], dms[1], 0);
};


var _DEFAULTS = {
  calculator: Calculator()
};


/**
 * Construct a new ReadingGroupView.
 *
 * @param options {Object}
 *        view options.
 * @param options.calculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param options.observation {Observation}
 *        observation to display.
 */
var ReadingGroupView = function (options) {
  var _this,
      _initialize,

      _calculator,
      _observation,
      _tablist,

      _createTab,
      _createSummaryTab;

  _this = View(options);

  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _calculator = options.calculator;
    _observation = options.observation;

    _tablist = TabList({tabPosition: 'top'});
    _tablist.el.classList.add('reading-group-view');
    _this.el.appendChild(_tablist.el);

    // TODO :: Bind to observation, when readings are added/removed,
    //         you will have to re-render
    _this.render();
  };

  _createSummaryTab = function (observation) {
    var el = document.createElement('div'),
        summaryView = null;

    el.classList.add('summary-wrapper');
    summaryView = ObservationSummaryView({
      calculator: _calculator,
      el: el,
      observation: observation
    });

    return {
      title: 'Summary',
      content: el
    };
  };

  _createTab = function (observation, reading, nextReading) {
    var button,
        el = document.createElement('div'),
        readingView = null,
        tbody,
        td,
        tr;

    el.classList.add('reading-wrapper');
    readingView = ReadingView({
      calculator: _calculator,
      el: el,
      observation: observation,
      reading: reading
    });

    tbody = el.querySelector('.inclination-input > table > tbody');
    tr = tbody.appendChild(document.createElement('tr'));
    td = tr.appendChild(document.createElement('td'));
    td.setAttribute('colspan', '5');
    td.classList.add('next-reading');

    button = td.appendChild(document.createElement('button'));
    button.innerHTML = 'Copy to Next Set';

    button.addEventListener('click', function () {
      var destMeasurement,
          destMeasurements,
          dm,
          i,
          len,
          sm,
          sourceMeasurement,
          sourceMeasurements,
          type;

      _tablist.selectNextTab();

      if (nextReading) {
        sourceMeasurements = reading.getMeasurements();
        destMeasurements = nextReading.getMeasurements();

        for (type in sourceMeasurements) {
          // Only copy if the measurement exists in both
          if (sourceMeasurements.hasOwnProperty(type) &&
              destMeasurements.hasOwnProperty(type)) {

            sourceMeasurement = sourceMeasurements[type];
            destMeasurement = destMeasurements[type];

            if (sourceMeasurement.length === destMeasurement.length) {
              for (i = 0, len = sourceMeasurement.length; i < len; i++) {
                sm = sourceMeasurement[i];
                dm = destMeasurement[i];

                // Only copy if dest angle is still 0. Don't want to blow away
                // an existing angle value...
                if (dm.get('angle') === 0) {
                  dm.set({
                    angle: __truncate_angle_seconds(sm.get('angle'))
                  });
                }
              }
            }
          }
        }
      }
    });

    return {
      title: 'Set ' + reading.get('set_number'),
      content: el
    };
  };


  _this.render = function () {
    var readings = _observation.get('readings').data(),
        i,
        len;

    for (i = 0, len = readings.length; i < len; i++) {
      _tablist.addTab(_createTab(_observation, readings[i], readings[i+1]));
    }
    _tablist.addTab(_createSummaryTab(_observation));
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = ReadingGroupView;
