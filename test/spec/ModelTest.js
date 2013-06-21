/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Model'
], function (chai, Model) {
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

	describe('Unit tests for the "Model" class', function () {

		describe('get()', function () {
			it('returns null when key is not set', function () {
				var m = new Model();

				expect(m.get('notset')).to.equal(null);
			});

			it('returns value after call to set', function () {
				var data = {'mykey': 'myvalue'},
				    m = new Model(data);

				expect(m.get('mykey')).to.equal(data.mykey);
			});
		});

		describe('set()', function() {
			it('triggers key specific change event when value changes', function() {
				var m = new Model(),
				    listener = new TestClass();

				m.on('change:mykey', listener.callback, listener);
				m.set({'mykey': 'myvalue'});
				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData).to.equal('myvalue');
			});

			it('triggers generic change event when value changes', function() {
				var m = new Model(),
				    listener = new TestClass();

				m.on('change', listener.callback, listener);
				m.set({'mykey': 'myvalue'});
				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData.mykey).to.equal('myvalue');
			});
		});

	});

});
