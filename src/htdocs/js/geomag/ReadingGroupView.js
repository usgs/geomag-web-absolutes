'use strict';

var ObservationBaselineCalculator =
        require('geomag/ObservationBaselineCalculator'),
    ObservationSummaryView = require('geomag/ObservationSummaryView'),
    ReadingView = require('geomag/ReadingView'),
    TabList = require('tablist/TabList'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  baselineCalculator: ObservationBaselineCalculator()
};


var ReadingGroupView = function (options) {
  var _this,
      _initialize,

      _options,

      _createTab,
      _createSummaryTab;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    _options = Util.extend({}, _DEFAULTS, options);
    _this._observation = _options.observation;
    _this._calculator = _options.baselineCalculator;

    _this._tablist = TabList({tabPosition: 'top'});
    _this._tablist.el.classList.add('reading-group-view');
    _this.el.appendChild(_this._tablist.el);

    // TODO :: Bind to observation, when readings are added/removed,
    //         you will have to re-render
    _this.render();
  };

  _createTab = function (observation, reading) {
    var el = document.createElement('div'),
        readingView = null;

    el.classList.add('reading-wrapper');
    readingView = ReadingView({
      el: el,
      observation: observation,
      reading: reading,
      baselineCalculator: _this._calculator
    });

    return {
      title: 'Set ' + reading.get('set_number'),
      content: el
    };
  };

  _createSummaryTab = function (observation) {
    var el = document.createElement('div'),
        summaryView = null;

    el.classList.add('summary-wrapper');
    summaryView = ObservationSummaryView({
      el: el,
      observation: observation,
      baselineCalculator: _this._calculator
    });

    return {
      title: 'Summary',
      content: el
    };
  };


  _this.render = function () {
    var observation = _this._observation,
        readings = observation.get('readings').data(),
        i,
        len;

    for (i = 0, len = readings.length; i < len; i++) {
      _this._tablist.addTab(_this._createTab(observation, readings[i]));
    }
    _this._tablist.addTab(_this._createSummaryTab(observation));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ReadingGroupView;
