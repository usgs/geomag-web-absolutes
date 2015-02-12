/* global define, describe, it */
define([
  'chai',
  'mvc/Model',

  'geomag/UserAdminView'
], function (
  chai,
  Model,

  UserAdminView
) {
  'use strict';
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

});
