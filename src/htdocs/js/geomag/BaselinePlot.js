'use strict';

var BaselineFactory = require('geomag/BaselineFactory'),
    d3 = require('d3'),
    Events = require('util/Events'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
};

var _PLOT_DEFAULTS = {
  data: [],
  height: 160,
  margin: {top: 30, right: 20, bottom: 30, left: 50},
  width: 640
};

/**
 * Private inner class.
 *
 * This class is does the actual D3 plotting work. The BaselinePLot contains
 * an instance of this Plot class for each of the baseline plots it displays.
 *
 */
var Plot = function (params) {
  var _this,
      _initialize,

      _allData,
      _height,
      _key,
      _margin,
      _meanData,
      _meanLine,
      _svg,
      _width,
      _xAxis,
      _xScale,
      _yAxis,
      _yScale,

      _createDataPoint,
      _getCurrentWidth,
      _onSizeChange,
      _updateAxes,
      _updateMean,
      _updatePlotHelpers,
      _updateScatter;


  _this = View(params);

  _initialize = function (params) {
    params = Util.extend({}, _PLOT_DEFAULTS, params);

    _key = params.key;
    _height = params.height;
    _width = params.width;
    _margin = params.margin;

    _updatePlotHelpers();
    _this.setData(params.data);
  };


  _createDataPoint = function (dateTime, value) {
    return {
      dateTime: dateTime,
      baseline: value
    };
  };

  _getCurrentWidth = function () {
    if (_width === 'auto') {
      return _this.el.clientWidth - (_margin.left + _margin.right);
    } else {
      return _width;
    }
  };

  _meanLine = d3.svg.line()
      .x(function (d) { return _xScale(d.dateTime); })
      .y(function (d) { return _yScale(d.baseline); });

  _onSizeChange = function () {
    _updatePlotHelpers();
  };

  _updateAxes = function () {
    var endTime,
        startTime,
        ydif,
        ymax,
        ymin;

    // Times in seconds since the epoch
    endTime = parseInt((new Date()).getTime()/1000,10);
    startTime = endTime - 33696000;


    ymin = d3.min(_meanData, function (d) { return d.baseline; });
    ymax = d3.max(_meanData, function (d) { return d.baseline; });
    ydif = Math.abs(ymax - ymin) || 10;

    _xScale.domain([startTime, endTime]).nice();
    _yScale.domain([ymin - (ydif / 2), ymax + (ydif / 2)]).nice();

    _svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + _height + ')')
        .call(_xAxis);

    _svg.append('g')
        .attr('class', 'y axis')
        .call(_yAxis);
  };

  _updateMean = function () {

    // Plot the line
    _svg.append('path')
        .attr('class', 'line')
        .attr('d', _meanLine(_meanData));
  };

  _updatePlotHelpers = function () {
    var width = _getCurrentWidth();

    _xScale = d3.time.scale().range([0, width]);
    _yScale = d3.scale.linear().range([_height, 0]);

    _xAxis = d3.svg.axis().scale(_xScale).orient('bottom').ticks(5);
    _yAxis = d3.svg.axis().scale(_yScale).orient('left').ticks(5);
  };

  _updateScatter = function () {
    _svg.selectAll('.dot')
        .data(_allData)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 1)
        .attr('cx', function (d) { return _xScale(d.dateTime); })
        .attr('cy', function (d) { return _yScale(d.baseline); })
        .style('fill', 'steelgrey');
  };


  _this.setData = function (data) {
    _allData = [];
    _meanData = [];

    data.forEach(function (baseline) {
      var count = 0,
          dateTime,
          i,
          len,
          sum = 0,
          value,
          values;

      dateTime = baseline.dateTime * 1000;
      values = baseline[_key];

      for (i = 0, len = values.length; i < len; i++) {
        value = values[i];

        if (value !== null) {
          _allData.push(_createDataPoint(dateTime, value));

          sum += value;
          count += 1;
        }
      }

      if (count > 0) {
        _meanData.push(_createDataPoint(dateTime, sum / count));
      }
    });

    _this.render();
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _allData = null;
    _key = null;
    _meanData = null;

    _this = null;
  });

  _this.render = function () {

    // Clear out previous plot
    _this.el.innerHTML = '';

    if (_allData.length > 0) {
      var width = _getCurrentWidth();

      _svg = d3.select(_this.el)
        .append('svg')
          .attr('viewBox', '0 0 ' + (width + _margin.left + _margin.right) + ' ' + (_height + _margin.top + _margin.bottom))
          // .attr('width', width + _margin.left + _margin.right)
          // .attr('height', _height + _margin.top + _margin.bottom)
        .append('g')
          .attr('transform',
              'translate(' + _margin.left + ',' + _margin.top + ')');

      _updateAxes();
      _updateMean();
      _updateScatter();
    }
  };


  _initialize(params);
  params = null;
  return _this;
};


var BaselinePlot = function (params) {
  var _this,
      _initialize,

      _data,
      _dPlot,
      _factory,
      _height,
      _hPlot,
      _width,
      _zPlot,

      _onData,
      _onHashChange;


  _this = View(params);

  _initialize = function (/*params*/) {
    var el = _this.el;

    params = Util.extend({}, _DEFAULTS, params);

    _factory = params.factory || BaselineFactory();

    _height = params.height;
    _width = params.width;

    el.innerHTML = [
      '<h3>Baseline H</h3>',
      '<section class="baseline-plot-h-wrapper"></section>',
      '<h3>Baseline D</h3>',
      '<section class="baseline-plot-e-wrapper"></section>',
      '<h3>Baseline Z</h3>',
      '<section class="baseline-plot-z-wrapper"></section>'
    ].join('');

    _hPlot = Plot({
      el: el.querySelector('.baseline-plot-h-wrapper'),
      key: 'baseH'
    });
    _dPlot = Plot({
      el: el.querySelector('.baseline-plot-e-wrapper'),
      key: 'baseD'
    });
    _zPlot = Plot({
      el: el.querySelector('.baseline-plot-z-wrapper'),
      key: 'baseZ'
    });

    Events.on('hashchange', _onHashChange);
    _factory.on('data', _onData);
  };


  _onData = function (data) {
    _data = data;
    _this.render();
  };

  _onHashChange = function () {
    var endTime,
        observatoryId,
        startTime;

    observatoryId = parseInt(window.location.hash.substring(1), 10);
    endTime = parseInt((new Date()).getTime()/1000,10);
    startTime = endTime - 33696000; // 13 months-ish

    if (isNaN(observatoryId)) {
      return;
    }

    _factory.fetch({
      observatoryId: observatoryId,
      startTime: startTime,
      endTime: endTime
    });
  };


  _this.render = function () {
    _hPlot.setData(_data);
    _dPlot.setData(_data);
    _zPlot.setData(_data);
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = BaselinePlot;
