/* global chai, describe, it */
'use strict';

var UserAdminView = require('geomag/UserAdminView');


var expect = chai.expect;

describe('Unit tests for User Admin View.', function () {

  describe('Constructor', function () {

    it ('Exists', function () {
      /* jshint -W030 */
      expect(UserAdminView).to.not.be.undefined;
      /* jshint +W030 */
    });

  }); // END :: Constructor

}); // END :: Unit tests for UserAdminView
