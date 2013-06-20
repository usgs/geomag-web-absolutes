/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'Greeter'
], function (chai, Greeter) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Greeter" class', function () {

		describe('sayHello()', function () {
			it('approaches politely', function () {
				var hello = (new Greeter()).sayHello();
				expect(hello).to.equal('Hello world');
			});
		});

		describe('sayGoodbye()', function () {
			it('leaves politely', function () {
				var goodbye = (new Greeter()).sayGoodbye();
				expect(goodbye).to.equal('Goodbye');
			});
		});
	});

});
