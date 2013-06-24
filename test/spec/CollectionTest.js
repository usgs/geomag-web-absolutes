/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Model',
	'mvc/Collection'
], function (chai, Model, Collection) {
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



	describe('Unit tests for the "Collection" class', function () {

		describe('get()', function() {
			it('returns null when not found', function() {
				var collection = new Collection();
				expect(collection.get('test')).to.equal(null);
			});

			it('returns matching object when found', function() {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test2'}),
				    collection = new Collection();

				collection.add(model, model2);
				expect(collection.get('test')).to.equal(model);
				expect(collection.get('test2')).to.equal(model2);
			});

			it('throws exception when duplicate ids found', function () {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test'}),
				    collection = new Collection();

				collection.add(model, model2);
				expect(function() {
					collection.get('test');
				}).to.throw(/duplicate/);
			});
		});


		describe('add()', function () {
			it('triggers "add" event when called', function () {
				var model = new Model({'id': 'test'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.on('add', listener.callback, listener);
				collection.add(model);

				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData).to.deep.equal([model]);
			});

			it('supports a variable number of arguments', function () {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test2'}),
				    model3 = new Model({'id': 'test3'}),
				    collection = new Collection();

				collection.add(model, model2, model3);
				expect(collection.data().length).to.equal(3);
			});

		});


		describe('remove()', function() {
			it('triggers "remove" event when there is selection', function() {
				var model = new Model({'id': 'test'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.on('remove', listener.callback, listener);
				collection.add(model);
				collection.remove(model);

				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData).to.equal(model);
			});

			it('throws exception when model not in collection', function() {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test2'}),
				    collection = new Collection();

				collection.add(model);

				expect(function() {
					collection.remove(model2);
				}).to.throw(/not in collection/);
			});
		});


		describe('select()', function() {
			it('triggers "select" event when called', function() {
				var model = new Model({'id': 'test'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.on('select', listener.callback, listener);
				collection.add(model);
				collection.select(model);

				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData).to.equal(model);
			});

			it('throws exception when model not in collection', function() {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test2'}),
				    collection = new Collection();

				collection.add(model);

				expect(function() {
					collection.select(model2);
				}).to.throw(/not in collection/);
			});

			it('also calls "deselect" when existing selection', function() {
				var model = new Model({'id': 'test'}),
				    model2 = new Model({'id': 'test2'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.add(model, model2);
				collection.select(model);

				collection.on('deselect', listener.callback, listener);
				collection.on('select', listener.callback, listener);
				collection.select(model2);

				expect(listener.callbackCount).to.equal(2);
				expect(listener.callbackData).to.equal(model2);
			});
		});


		describe('deselect()', function() {
			it('triggers "deselect" event when there is selection', function() {
				var model = new Model({'id': 'test'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.on('deselect', listener.callback, listener);
				collection.add(model);
				collection.select(model);
				collection.deselect();

				expect(listener.callbackCount).to.equal(1);
				expect(listener.callbackData).to.equal(model);
			});

			it('does not trigger "deselect" event when no selection', function() {
				var model = new Model({'id': 'test'}),
				    collection = new Collection(),
				    listener = new TestClass();

				collection.on('deselect', listener.callback, listener);
				collection.add(model);
				collection.deselect();

				expect(listener.callbackCount).to.equal(0);
				expect(listener.callbackData).to.equal(null);
			});
		});


		describe('sort()', function () {
			it('sorts the underlying array', function() {
				var model = new Model({'id': 'test', 'value': 1.2}),
				    model2 = new Model({'id': 'test2', 'value': 2.1}),
				    collection = new Collection();

				collection.add(model, model2);
				expect(collection.data()).to.deep.equal([model, model2]);
				collection.sort(function(a, b) {
					// sort descending
					return b.get('value') - a.get('value');
				});
				expect(collection.data()).to.deep.equal([model2, model]);
			});
		});

	});

});
