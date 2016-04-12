'use strict';

var Format = require('geomag/Formatter'),
    Measurement = require('geomag/Measurement'),
    User = require('geomag/User'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  'observation': null,
  'calculator': null,
  'readings': null
};


  /**
   * Construct a new MagnetometerOrdinatesView.
   *
   * @param options {Object}
   *        view options.
   * @param options.calculator {geomag.ObservationBaselineCalculator}
   *        the calculator to use.
   */
var MagnetometerOrdinatesView = function (options) {
  var _this,
      _initialize,

      _measurements;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    var el,
        dSmallAngle,
        eSmallAngle;

    el = _this.el;

    _measurements = options.reading.getMeasurements();
    _this._reading = options.reading;
    _this._calculator = options.calculator;
    _this._user = User.getCurrentUser();


    dSmallAngle = ' ';
    eSmallAngle = ' ';
    if (_this._user.get('admin') === 'Y') {
      dSmallAngle = [
        '<tr>',
          '<th class="channel dSAA">D (SA)</th>',
          '<td class="mean dMeanSAA"></td>',
          '<td class="absolute dAbsoluteSAA"></td>',
          '<td class="baseline dBaselineSAA"></td>',
        '</tr>'
      ].join('');
      eSmallAngle = [
        '<tr>',
          '<th class="channel e saa">E(SA)</th>',
          '<td class="mean eMeanSAA"></td>',
          '<td class="absolute eAbsoluteSAA"></td>',
          '<td class="baseline eBaselineSAA"></td>',
        '</tr>'
      ].join('');
    }

    el.innerHTML = [
      '<div class="horizontal-scrolling">',
        '<table>',
          '<thead>',
            '<tr>',
              '<th scope="col" class="channel">Channel</th>',
              '<th scope="col" class="mean">Ordinate Mean</th>',
              '<th scope="col" class="absolute">Absolute</th>',
              '<th scope="col" class="baseline">Baseline</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            '<tr>',
              '<th class="channel h">H</th>',
              '<td class="mean hMean"></td>',
              '<td class="absolute hAbsolute"></td>',
              '<td class="baseline hBaseline"></td>',
            '</tr>',
            '<tr>',
              '<th class="channel e">E</th>',
              '<td class="mean eMean"></td>',
              '<td class="absolute eAbsolute"></td>',
              '<td class="baseline eBaseline"></td>',
            '</tr>',
            eSmallAngle,
            '<tr>',
              '<th class="channel d">D</th>',
              '<td class="mean dMean"></td>',
              '<td class="absolute dAbsolute"></td>',
              '<td class="baseline dBaseline"></td>',
            '</tr>',
            dSmallAngle,
            '<tr>',
              '<th class="channel z">Z</th>',
              '<td class="mean zMean"></td>',
              '<td class="absolute zAbsolute"></td>',
              '<td class="baseline zBaseline"></td>',
            '</tr>',
            '<tr>',
              '<th class="channel f">F</th>',
              '<td class="mean fMean"></td>',
              '<td class="absolute fAbsolute"></td>',
              '<td class="baseline fBaseline"></td>',
            '</tr>',
          '</tbody>',
          '<tfoot class="pier-correction">',
            '<tr>',
              '<td colspan="4">',
                'Pier Correction',
                '<span class="pier-correction-value"></span>',
              '</td>',
            '</tr>',
          '</tfoot>',
        '</p>',
        '</table>',
      '</div>',
      '<p class="scaleValue"></p>'
    ].join('');

    // save references to elements that will be updated during render
    _this._hMean = el.querySelector('.hMean');
    _this._eMean = el.querySelector('.eMean');
    _this._dMean = el.querySelector('.dMean');
    _this._zMean = el.querySelector('.zMean');
    _this._fMean = el.querySelector('.fMean');

    _this._absoluteH = el.querySelector('.hAbsolute');
    _this._absoluteD = el.querySelector('.dAbsolute');
    _this._absoluteZ = el.querySelector('.zAbsolute');
    _this._absoluteF = el.querySelector('.fAbsolute');


    _this._hBaseline = el.querySelector('.hBaseline');
    _this._eBaseline = el.querySelector('.eBaseline');
    _this._dBaseline = el.querySelector('.dBaseline');
    _this._zBaseline = el.querySelector('.zBaseline');

    // Small Angle Approximation.
    _this._dMeanSAA = el.querySelector('.dMeanSAA');
    _this._absoluteDSAA = el.querySelector('.dAbsoluteSAA');
    _this._eBaselineSAA = el.querySelector('.eBaselineSAA');
    _this._dBaselineSAA = el.querySelector('.dBaselineSAA');

    _this._pierCorrection = el.querySelector('.pier-correction-value');
    _this._scaleValue = el.querySelector('.scaleValue');

    // hook up to measurements on change.
    // Only need time/angles not markup/markdown
    _measurements[Measurement.WEST_DOWN][0].on('change', 'render', _this);
    _measurements[Measurement.EAST_DOWN][0].on('change', 'render', _this);
    _measurements[Measurement.WEST_UP][0].on('change', 'render', _this);
    _measurements[Measurement.EAST_UP][0].on('change', 'render', _this);
    _measurements[Measurement.SOUTH_DOWN][0].on('change', 'render', _this);
    _measurements[Measurement.NORTH_UP][0].on('change', 'render', _this);
    _measurements[Measurement.SOUTH_UP][0].on('change', 'render', _this);
    _measurements[Measurement.NORTH_DOWN][0].on('change', 'render', _this);

    // hook up to calculator on change, for changes to pier and mark.
    _this._calculator.on('change', 'render', _this);
    _this._reading.on('change', 'render', _this);

    _this.render();
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Remove event listeners
        _measurements[Measurement.WEST_DOWN][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.EAST_DOWN][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.WEST_UP][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.EAST_UP][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.SOUTH_DOWN][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.NORTH_UP][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.SOUTH_UP][0].removeEventListener(
            'change', 'render', _this);
        _measurements[Measurement.NORTH_DOWN][0].removeEventListener(
            'change', 'render', _this);
        _this._calculator.removeEventListener('change', 'render', _this);
        _this._reading.removeEventListener('change', 'render', _this);

        // Clean up private variables
        _measurements = null;

        _this = null;
      },
      // parent class destroy method
      _this.destroy);

  _this.render = function () {
    var calculator,
        reading;

    calculator = _this._calculator;
    reading = _this._reading;

    _this._hMean.innerHTML =
        Format.nanoteslas(calculator.meanH(reading));
    _this._eMean.innerHTML =
        Format.nanoteslas(calculator.meanE(reading));
    _this._dMean.innerHTML =
        Format.minutes(calculator.dComputed(reading)*60);
    _this._zMean.innerHTML =
        Format.nanoteslas(calculator.meanZ(reading));
    _this._fMean.innerHTML =
        Format.nanoteslas(calculator.meanF(reading));

    _this._absoluteH.innerHTML =
        Format.nanoteslas(calculator.horizontalComponent(reading));
    _this._absoluteD.innerHTML =
        Format.minutes((calculator.magneticDeclination(reading) * 60));
    _this._absoluteZ.innerHTML =
        Format.nanoteslas(calculator.verticalComponent(reading));
    _this._absoluteF.innerHTML =
      Format.nanoteslas(calculator.fCorrected(reading));

    _this._hBaseline.innerHTML =
      Format.nanoteslas(calculator.hBaseline(reading));
    _this._eBaseline.innerHTML =
      Format.nanoteslas(calculator.eBaseline(reading) * 60);
    _this._dBaseline.innerHTML =
      Format.minutes(calculator.dBaseline(reading) * 60);
    _this._zBaseline.innerHTML =
      Format.nanoteslas(calculator.zBaseline(reading));

    // Set small angle
    if (_this._user.get('admin') === 'Y') {
     calculator.setSmallAngleApproximation(true);
     _this._dMeanSAA.innerHTML =
         Format.minutes(calculator.dComputed(reading)*60);
     _this._absoluteDSAA.innerHTML =
         Format.minutes((calculator.magneticDeclination(reading) * 60));
     _this._eBaselineSAA.innerHTML =
       Format.nanoteslas(calculator.eBaseline(reading) * 60);
     _this._dBaselineSAA.innerHTML =
       Format.minutes(calculator.dBaseline(reading) * 60);
     calculator.setSmallAngleApproximation(false);
    }

    _this._pierCorrection.innerHTML =
        Format.rawNanoteslas(calculator.pierCorrection());
    _this._scaleValue.innerHTML = [
        'Ordinate Mean D is calculated using ',
        '<code>(Corrected H * scaleValue / 60)</code>',
        ', where <code>',
            'scaleValue = ', calculator.scaleValue(reading).toFixed(4),
        '</code>'].join('');
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = MagnetometerOrdinatesView;
