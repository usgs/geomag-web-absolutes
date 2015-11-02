/* global mocha */

// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    'use strict';

    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable
      throw new TypeError('object to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound;

    fBound = function () {
      return fToBind.apply(
          (this instanceof fNOP && oThis ? this : oThis),
          aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

(function () {
  'use strict';

  // if (typeof window.initMochaPhantomJS === 'function') {
    window.initMochaPhantomJS();
  // }

  mocha.setup('bdd');
  mocha.reporter('html');

  // Add each test class here as they are implemented
  require('./spec/ObservatoryTest');
  require('./spec/MarkTest');
  require('./spec/MeasurementTest');
  require('./spec/PierTest');
  require('./spec/BaselineCalculatorTest');
  require('./spec/InstrumentTest');
  require('./spec/ObservationTest');
  require('./spec/UserTest');
  require('./spec/UserAdminViewTest');
  require('./spec/ReadingTest');
  require('./spec/MeasurementViewTest');
  require('./spec/ReadingGroupViewTest');
  require('./spec/DeclinationViewTest');
  require('./spec/InclinationViewTest');
  require('./spec/ReadingViewTest');
  require('./spec/RealtimeDataTest');
  require('./spec/RealtimeDataFactoryTest');
  require('./spec/observation_data_Test');
  require('./spec/ObservationBaselineCalculatorTest');
  require('./spec/ObservationMetaViewTest');
  require('./spec/mvcutil/CollectionSelectBoxTest');
  require('./spec/ObservatoryViewTest');
  require('./spec/ObservationsViewTest');
  require('./spec/FormatterTest');
  require('./spec/MagnetometerOrdinatesViewTest');
  require('./spec/DeclinationSummaryViewTest');
  require('./spec/HorizontalIntensitySummaryViewTest');
  require('./spec/VerticalIntensitySummaryViewTest');
  require('./spec/ObservationSummaryViewTest');

  if (window.mochaPhantomJS) {
      // window.initMochaPhantomJS();
      window.mochaPhantomJS.run();
  } else {
    mocha.run();
  }
})(this);
