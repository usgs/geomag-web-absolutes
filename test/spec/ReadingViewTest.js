/* global chai, describe, it */
'use strict';

var Observation = require('geomag/Observation'),
    ObservationBaselineCalculator = require('geomag/ObservationBaselineCalculator'),
    Reading = require('geomag/Reading'),
    ReadingView = require('geomag/ReadingView');


var expect = chai.expect;
var viewOptions = {
  reading: new Reading(),
  observation: new Observation(),
  baselineCalculator: new ObservationBaselineCalculator()
};

describe('ReadingView Unit Tests', function () {

});
