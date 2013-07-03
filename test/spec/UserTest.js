/* global define, describe, it */
define([
	'chai',
	'mvc/Model',
	'geomag/User'
], function (
	chai,
	Model,
	User
) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for User.', function () {

		describe('Constructor', function () {

			it('is an instance of the User', function () {
				var obj = new User();
				expect(obj).to.be.an.instanceOf(User);
			});

		}); // END :: Constructor

		describe('hasRole(role)', function () {
			var role = new Model({id: 1}),
			    roles = [new Model({id: 2}), role, new Model({id: 3})],
			    user = new User({roles: roles});

			it('has a known role', function () {
				/* jshint expr: true */
				expect(user.hasRole(role)).to.be.true;
				/* jshint expr: false */
			});

			it('does not have an unknown role', function () {
				/* jshint expr: true */
				expect(user.hasRole(new Model({id: 4}))).to.be.false;
				/* jshint expr: false */
			});

		}); // END :: hasRole(role)

	}); // END :: Unit tests for User

});
