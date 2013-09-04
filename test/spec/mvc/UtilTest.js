/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Util'
], function (chai, Util) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Util" class', function () {

		describe('bind()', function () {

			it('preserves context', function () {
				var context = {},
				    test, bound;

				test = function() {
					expect(this).to.equal(context);
				};
				bound = Util.bind(test, context);
				bound();
			});

			it('preserves curried arguments', function () {
				var test, bound;

				test = function() {
					var args = Array.prototype.slice.call(arguments, 0);
					expect(args).to.deep.equal([1,2,3,4]);
				};
				bound = Util.bind(test, undefined, 1, 2, 3);
				bound(4);
			});

		});

	});

});