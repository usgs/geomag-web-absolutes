/* global chai, describe, it */
'use strict';

var Mark = require('geomag/Mark'),
    Model = require('mvc/Model');


var expect = chai.expect;

describe('Unit tests for the "Mark" class', function () {
  var testObect = {
    'name': 'Main',
    'begin': 1372193224820,
    'end': 1372193224880,
    'azimuth': 176.1
  };

  describe('constructor()', function () {
    it('evaluates to instance of "Mark"', function () {
      var mark = new Mark();
      expect(mark).to.be.an.instanceOf(Mark);
      expect(mark).to.be.an.instanceOf(Mark);
    });

    it('works when passed an object', function () {
        var mark = new Mark(testObect);
        expect(mark.get('name')).to.equal(testObect.name);
    });

  });

});
