'use strict';

var BaselineFactory = require('geomag/BaselineFactory'),
    d3 = require('d3'),
    Events = require('util/Events'),
    Formatter = require('geomag/Formatter'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
};

var _PLOT_DEFAULTS = {
  data: [],
  height: 160,
  margin: {top: 8, right: 20, bottom: 25, left: 50},
  width: 640,
  yUnits: 'nT'
};


/**
 * Private inner class.
 *
 * This class does the actual D3 plotting work. The BaselinePLot contains
 * an instance of this Plot class for each of the baseline plots it displays.
 *
 */
var Plot = function (params) {
  var _this,
      _initialize,

      _allData,
      _height,
      _margin,
      _meanData,
      _meanLine,
      _rawData,
      _svg,
      _validKey,
      _valueKey,
      _width,
      _xAxis,
      _xScale,
      _yAxis,
      _yScale,
      _yUnits,

      _computeRange,
      _createDataPoint,
      _onSizeChange,
      _updateAxes,
      _updateMean,
      _updatePlotHelpers,
      _updateScatter;


  _this = View(params);

  _initialize = function (params) {
    params = Util.extend({}, _PLOT_DEFAULTS, params);

    _valueKey = params.key;
    _validKey = params.validKey;
    _height = params.height;
    _width = params.width;
    _margin = params.margin;
    _yUnits = params.yUnits;

    _updatePlotHelpers();
    _this.setData(params.data);
  };


  _computeRange = params.computeRange || function (/*data*/) {
    var mean,
        sum = 0;

    _meanData.forEach(function (item) {
      sum += item.baseline;
    });

    mean = sum / _meanData.length;

    return [mean - 20, mean + 20];
  };

  _createDataPoint = function (dateTime, value) {
    return {
      dateTime: parseInt(dateTime, 10),
      baseline: parseFloat(value)
    };
  };

  _meanLine = d3.svg.line()
      .x(function (d) { return _xScale(d.dateTime); })
      .y(function (d) { return _yScale(d.baseline); });

  _onSizeChange = function () {
    _updatePlotHelpers();
  };

  _updateAxes = function () {
    var endTime,
        startTime;

    endTime = (new Date()).getTime();
    startTime = endTime - 33696000000;

    _xScale.domain([startTime, endTime]).nice();
    _yScale.domain(_computeRange(_rawData)).nice();

    _svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + _height + ')')
        .call(_xAxis);

    _svg.append('g')
        .attr('class', 'y axis')
        .call(_yAxis);

    _svg.selectAll('.x.axis > .tick > text')
        .style('display', function (/*date*/) {
          var display = this.innerHTML;
          if (isNaN(display) && display !== 'April' && display !== 'July' &&
              display !== 'October') {
            this.parentNode.removeChild(this);
          }
        });

    _svg.append('text')
        .attr('class', 'y label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '1em')
        .text(_yUnits);
  };

  _updateMean = function () {

    // Plot the line
    _svg.append('path')
        .attr('class', 'line')
        .attr('d', _meanLine(_meanData));
  };

  _updatePlotHelpers = function () {
    _xScale = d3.time.scale().range([0, _width]);
    _yScale = d3.scale.linear().range([_height, 0]);

    _xAxis = d3.svg.axis().scale(_xScale).orient('bottom').ticks(13);
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
    var buffer,
        meanBuffer = {};

    _rawData = data;
    _allData = [];
    _meanData = [];

    _rawData.forEach(function (baseline) {
      var dateTime,
          valid,
          value;

      value = baseline[_valueKey];
      valid = baseline[_validKey];
      dateTime = baseline.begin * 1000;

      if (!meanBuffer.hasOwnProperty(dateTime)) {
        meanBuffer[dateTime] = {
          count: 0,
          sum: 0
        };
      }

      if (value !== null && valid === 'Y') {
        meanBuffer[dateTime].count += 1;
        meanBuffer[dateTime].sum += value;

        _allData.push(_createDataPoint(dateTime, value));
      }
    });

    for (var key in meanBuffer) {
      if (meanBuffer.hasOwnProperty(key)) {
        buffer = meanBuffer[key];

        if (buffer.count > 0) {
          _meanData.push(_createDataPoint(key, buffer.sum / buffer.count));
        }
      }
    }

    _this.render();
  };

  _this.destroy = Util.compose(_this.destroy, function () {
    // Clean up private methods
    _computeRange = null;
    _createDataPoint = null;
    _onSizeChange = null;
    _updateAxes = null;
    _updateMean = null;
    _updatePlotHelpers = null;
    _updateScatter = null;

    // Clean up private variables
    _allData = null;
    _height = null;
    _margin = null;
    _meanData = null;
    _meanLine = null;
    _rawData = null;
    _svg = null;
    _validKey = null;
    _valueKey = null;
    _width = null;
    _xAxis = null;
    _xScale = null;
    _yAxis = null;
    _yScale = null;
    _yUnits = null;

    _this = null;
  });

  _this.render = function () {
    // Clear out previous plot
    _this.el.innerHTML = '';

    if (_allData.length > 0) {
      _svg = d3.select(_this.el)
        .append('svg')
          .attr('viewBox',
              '0 0 ' +
              (_width + _margin.left + _margin.right) +
              ' ' +
              (_height + _margin.top + _margin.bottom)
          )
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
      key: 'baseH',
      validKey: 'horizontal_intensity_valid',
      height: 120
    });
    _dPlot = Plot({
      el: el.querySelector('.baseline-plot-e-wrapper'),
      key: 'baseD',
      validKey: 'declination_valid',
      height: 120,
      yUnits: 'minutes',
      computeRange: function (data) {
        var dcount,
            dmean,
            dmeanRad,
            dspan,
            dsum,
            hcount,
            hmean,
            hsum,
            emean;

        // Compute the mean D and H values
        dcount = 0;
        dsum = 0;
        hcount = 0;
        hsum = 0;

        data.forEach(function (obs) {
          if (obs.absD !== null && obs.declination_valid === 'Y') {
            dsum += obs.absD;
            dcount += 1;
          }
          if (obs.absH !== null && obs.horizontal_intensity_valid === 'Y') {
            hsum += obs.absH;
            hcount += 1;
          }
        });

        dmean = dsum / dcount;
        hmean = hsum / hcount;

        // Convert dmean from minutes to radians
        dmeanRad = (Math.PI / 180) * Formatter.dmsToDecimal(0, dmean, 0);

        // Compute the mean E value
        emean = hmean * Math.tan(dmeanRad);

        dspan = Math.abs((dmean / emean) * 20); // +/- 20nT -> range is 40nT

        return [dmean - dspan, dmean + dspan];
      }
    });
    _zPlot = Plot({
      el: el.querySelector('.baseline-plot-z-wrapper'),
      key: 'baseZ',
      validKey: 'vertical_intensity_valid',
      height: 120
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
      endTime: endTime,
      error: function (status, xhr) {
        ModalView(
        xhr.responseText + '<br/><br/>' +
        'Please select a different observatory or try again later.',
        {
          title: xhr.status + ' ' + xhr.statusText,
          classes: ['modal-error'],
          buttons: [{
            text: 'Okay',
            callback: function (evt, modal) {
              modal.hide();
            }
          }]
        }).show();
        _data = [];
        _this.render();
      }
    });
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Clean up private methods
        _onData = null;
        _onHashChange = null;

        // Clean up private variables
        _data = null;
        _dPlot = null;
        _factory = null;
        _height = null;
        _hPlot = null;
        _width = null;
        _zPlot = null;

        _this = null;
      },
      // parent class destroy method
      _this.destroy);

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
