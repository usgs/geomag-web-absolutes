/* global chai, describe, it */
'use strict';

var Model = require('mvc/Model'),
    User = require('geomag/User');


var expect = chai.expect;

describe('Unit tests for User.', function () {

  describe('Constructor', function () {
    var obj = new User();

    it('is an instance of the User', function () {
      expect(obj).to.be.an.instanceOf(User);
    });

  }); // END :: Constructor

}); // END :: Unit tests for User
