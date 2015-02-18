/* global chai, describe, it */
'use strict';

var Instrument = require('geomag/Instrument'),
    Model = require('mvc/Model');


var expect = chai.expect;

describe('Instrument Unit Tests', function () {

  describe('Constructor', function () {
    var i = new Instrument();

    it('should be an instance of an Instrument', function () {
      expect(i).to.be.an.instanceOf(Instrument);
    });

    it('should be an instance of a Model', function () {
      expect(i).to.be.an.instanceOf(Model);
    });

  }); // END :: Constructor

}); // END :: Instrument Unit Tests
