/* global define, describe, it */
define([
	'chai',
	'geomag/UserRole'
], function (
	chai,
	UserRole
) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for UserRole.', function () {

		describe('Constructor', function () {

			it('is an instance of the UserRole', function () {
				var obj = new UserRole();
				expect(obj).to.be.an.instanceOf(UserRole);
			});

		}); // END :: Constructor

	}); // END :: Unit tests for UserRole

});
