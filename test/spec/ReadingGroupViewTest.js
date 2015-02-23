/* global chai, describe, it */
'use strict';

var ReadingGroupView = require('geomag/ReadingGroupView');


var expect = chai.expect;

describe('ReadingGroupView test suite.', function () {
  describe('Constructor', function () {
    it('Can be defined.', function () {
      /* jshint -W030 */
      expect(ReadingGroupView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });
});
