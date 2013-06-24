/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Model'
], function (chai, Pier) {
	'use strict';
	var expect = chai.expect;

	/**
	 * Constructor for utility callback class.
	 *
	 * Callback function is defined on prototype, so is === across instances.
	 */
	var TestClass = function() {
		this.callbackCount = 0;
		this.callbackData = null;
	};
	
	/**
	 * A callback function that tracks last callback.
	 * @param  data {Object} the callback data.
	 */
	TestClass.prototype.callback = function(data) {
		this.callbackCount++;
		this.callbackData = data;
	};

	describe('Unit tests for the "Pier" class', function () {

		describe('Pier()', function () {
			it('is constructed', function () {
				var my_pier = new Pier({'name': 'testname'});
				expect(my_pier.get('name')).to.equal('testname');
			});
		});

	});

});
