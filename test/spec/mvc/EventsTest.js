/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Events'
], function (chai, Events) {
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



	describe('Unit tests for the "Events" class', function () {

		describe('on()', function () {
			it('adds callback once for each call', function () {
				var evts = new Events();
				var listener = new TestClass();
				// add listener twice
				evts.on('myevent', listener.callback, listener);
				evts.on('myevent', listener.callback, listener);
				// trigger event
				evts.trigger('myevent');
				expect(listener.callbackCount).to.equal(2);
			});
		});

		describe('off()', function() {
			it('removes all listeners when no callback is used', function() {
				var evts = new Events(),
				    listener1 = new TestClass(),
				    listener2 = new TestClass();

				evts.on('myevent', listener1.callback, listener1);
				evts.on('myevent', listener2.callback, listener2);

				// both should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(1);

				// turn off without using callback
				evts.off('myevent');

				// neither should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(1);
			});

			it('removes listeners of same type when no context is used', function() {
				var evts = new Events(),
				    listener1 = new TestClass(),
				    listener2 = new TestClass();

				evts.on('myevent', listener1.callback, listener1);
				evts.on('myevent', listener2.callback, listener2);

				// both should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(1);

				// turn off without using context
				evts.off('myevent', listener1.callback);

				// neither should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(1);
			});

			it('removes callback based on context', function() {
				var evts = new Events(),
				    listener1 = new TestClass(),
				    listener2 = new TestClass();

				evts.on('myevent', listener1.callback, listener1);
				evts.on('myevent', listener2.callback, listener2);

				// both should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(1);

				// remove one listener
				evts.off('myevent', listener1.callback, listener1);

				// only listener2 should be called
				evts.trigger('myevent');
				expect(listener1.callbackCount).to.equal(1);
				expect(listener2.callbackCount).to.equal(2);
			});
		});

	});

});
