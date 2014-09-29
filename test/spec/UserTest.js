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
			var obj = new User();

			it('is an instance of the User', function () {
				expect(obj).to.be.an.instanceOf(User);
			});

			it('is enabled by default', function () {
				expect(obj.get('enabled')).to.equal('Y');
			});

			it('is not admin by default', function () {
				expect(obj.get('admin')).to.equal('N');
			});
		}); // END :: Constructor

	}); // END :: Unit tests for User

});
