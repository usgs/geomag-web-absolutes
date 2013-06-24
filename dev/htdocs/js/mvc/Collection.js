/*global define*/

/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */
define(
	['mvc/Events'],
	function(Events) {
		'use strict';


		/**
		 * Create a new Collection.
		 *
		 * @param data {Array} of data.  When omitted a new array is created.
		 */
		var Collection = function(data) {
			// add event handling to collection
			Events.call(this);
			// the wrapped array
			this._data = data || [];
			// index of object ids in the data array, built lazily by getIds
			this._ids = null;
			// current selected feature
			this._selected = null;
		};

		Collection.prototype = Object.create(Events.prototype);


		/**
		 * Get the wrapped array.
		 *
		 * @return {Array} the wrapped array.
		 */
		Collection.prototype.data = function() {
			return this._data;
		};

		/**
		 * Sorts the data.
		 *
		 * Sorts the wrapped array, and clears the id cache.
		 * Triggers "sort" event, no arguments.
		 *
		 * @param method {Function} sort function.
		 */
		Collection.prototype.sort = function(method) {
			this._data.sort(method);
			this._ids = null;
			this.trigger('sort');
		};

		/**
		 * Get a map from ID to INDEX.
		 *
		 * @param force {Boolean} rebuild the map even if it exists.
		 */
		Collection.prototype.getIds = function(force) {
			if (force || this._ids === null) {
				// build up ids first time through
				this._ids = {};
				for (var i=0; i<this._data.length; i++) {
					var id = this._data[i].id;
					if (this._ids.hasOwnProperty(id)) {
						throw 'model with duplicate id "' + id + '" found in collection';
					}
					this._ids[id] = i;
				}
			}
			return this._ids;
		};

		/**
		 * Get an object in the collection by ID.
		 *
		 * Uses getIds(), so builds map of ID to INDEX on first access O(N).
		 * Subsequent access should be O(1).
		 *
		 * @param id {Any} if the collection contains more than one object with the same id,
		 *                 the last element with that id is returned.
		 */
		Collection.prototype.get = function(id) {
			var ids = this.getIds();
			if (ids.hasOwnProperty(id)) {
				// use cached index
				return this._data[ids[id]];
			} else {
				return null;
			}
		};

		/**
		 * Add objects to the collection.
		 *
		 * Calls wrapped array.push, and clears the id cache.
		 * Triggers "add" event, with 1 argument: array of all added items.
		 *
		 * @param {Object…} a variable number of objects to append to the collection.
		 */
		Collection.prototype.add = function() {
			// append items to collection
			this._data.push.apply(this._data, arguments);
			// reset id cache
			this._ids = null;
			// trigger add event
			this.trigger('add', Array.prototype.slice.call(arguments, 0));
		};

		/**
		 * Remove object(s) from the collection.
		 *
		 * This method calls array.splice and remove each item from array.
		 * Reset is faster than repeated calls to this method.
		 * Triggers "remove" event, with 1 argument: array of all removed items.
		 *
		 * @param o {Object…} a variable number of objects to remove.
		 */
		Collection.prototype.remove = function() {
			var ids = this.getIds(),
			    i;
			// select indexes to be removed
			var indexes = [];
			for (i=0; i<arguments.length; i++) {
				var o = arguments[i];
				// clear current selection if being removed
				if (o === this._selected) {
					this.deselect();
				}
				// add to list to be removed
				if (ids.hasOwnProperty(o.id)) {
					indexes.push(ids[o.id]);
				} else {
					throw 'removing object not in collection';
				}
			}
			// remove in descending index order
			indexes.sort(function(a,b) { return a-b; });
			for (i=indexes.length-1; i>=0; i--) {
				this._data.splice(indexes[i]);
			}
			// reset id cache
			this._ids = null;
			// trigger remove event
			this.trigger('remove', Array.prototype.slice.call(arguments, 0));
		};

		/**
		 * Replace the wrapped array with a new one.
		 * Triggers "reset" event, with 1 argument: new data array.
		 */
		Collection.prototype.reset = function(data) {
			// check for existing selection
			var selectedId = null;
			if (this._selected !== null) {
				selectedId = this._selected.id;
			}
			// free array and id cache
			this.destroy();
			// set new array
			this._data = data;
			// notify listeners
			this.trigger('reset', data);
			// reselect if there was a previous selection
			if (selectedId !== null) {
				var selected = this.get(selectedId);
				if (selected !== null) {
					this.select(selected);
				}
			}
		};

		/**
		 * Free the array and id cache.  Calls deselect before clearing data.
		 */
		Collection.prototype.destroy = function() {
			this.deselect();
			this._data = null;
			this._ids = null;
		};

		/**
		 * Get the currently selected object.
		 */
		Collection.prototype.getSelected = function() {
			return this._selected;
		};

		/**
		 * Select an object in the collection.
		 *
		 * If there is an existing selection, deselect is called first.
		 * Triggers "select" event, with 1 argument: selected item.
		 *
		 * @param obj {Object} object in the collection to select.
		 * @throws exception if obj not in collection.
		 */
		Collection.prototype.select = function(obj) {
			if (this._selected !== null) {
				this.deselect();
			}

			if (obj === this.get(obj.id)) {
				// make sure it's part of this collection…
				this._selected = obj;
				this.trigger('select', this._selected);
			} else {
				throw 'selecting object not in collection';
			}
		};

		/**
		 * Deselect current selection, if any.
		 *
		 * Triggers "deselect" event, with 1 argument: previously selected item.
		 * NOTE: the selected item is cleared before deselect is called, so
		 * getSelected() will return null during event handling.
		 */
		Collection.prototype.deselect = function() {
			if (this._selected !== null) {
				var oldSelected = this._selected;
				this._selected = null;
				this.trigger('deselect', oldSelected);
			}
		};


		// return from constructor
		return Collection;
	}
);
