/* global chai, describe, it */
'use strict';

var Mark = require('geomag/Mark');


var expect = chai.expect;

describe('Unit tests for the "Mark" class', function () {
  var testObect = {
    'name': 'Main',
    'begin': 1372193224820,
    'end': 1372193224880,
    'azimuth': 176.1
  };

  describe('constructor()', function () {

    it('works when passed an object', function () {
        var mark = Mark(testObect);
        expect(mark.get('name')).to.equal(testObect.name);
    });

  });

});
