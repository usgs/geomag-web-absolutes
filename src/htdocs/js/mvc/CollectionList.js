/*global define*/
define([
	'mvc/View',
	'mvc/Util'
], function (
	View,
	Util
) {
	'use strict';


	var DEFAULTS, CollectionList;

	// Default options
	DEFAULTS = {
		format: function (model) {
			return model.id;
		},
		clickToSelect: true,
		clickToDeselect: true
	};


	/**
	 * Render a collection as a list.
	 *
	 * When a list item is clicked, the corresponding model in the collection is
	 * selected.
	 *
	 * @param options {Object}
	 *        view options.
	 * @param options.collection {mvc.Collection}
	 *        collection being displayed.
	 * @param options.el {DomElement}
	 *        default is new DIV element.
	 *        element where list is rendered.
	 * @param options.format {Function(model)}
	 *        default displays model.id.
	 *        function to format list content for each item in the collection.
	 * @param options.clickToSelect {Boolean}
	 *        default true.
	 *        When a list item is clicked, select that item in the collection.
	 * @param options.clickToDeselect {Boolean}
	 *        default true.
	 *        When a selected list item is clicked, deselect in the collection.
	 */
	CollectionList = function (options) {
		options = Util.extend({}, DEFAULTS, options);
		// call parent constructor
		View.call(this, options);
	};

	// extend View
	CollectionList.prototype = Object.create(View.prototype);


	/**
	 * Initialize the list.
	 *
	 * @param options {Object} same as constructor.
	 */
	CollectionList.prototype.initialize = function (options) {
		var selected;

		this._options = options;
		// collection used for display
		this._collection = options.collection;
		this._list = options.el.appendChild(document.createElement('ol'));

		// when collection updates, update view
		this._collection.on('reset', this.render, this);
		this._collection.on('add', this.render, this);
		this._collection.on('remove', this.render, this);
		this._collection.on('select', this._onSelect, this);
		this._collection.on('deselect', this._onDeselect, this);

		// when user clicks on list, select in collection
		if (options.clickToSelect) {
			this._onClick = Util.bind(this._onClick, this);
			Util.addEvent(this._list, 'click', this._onClick);
		}

		// render first time
		this.render();

		// apply existing selection
		selected = this._collection.getSelected();
		if (selected !== null) {
			this._onSelect(selected);
		}
	};

	/**
	 * Redraw the list based on existing collection contents.
	 */
	CollectionList.prototype.render = function () {
		var buf = [],
		    data = this._collection.data(),
		    i, len;

		for (i = 0, len = data.length; i < len; i++) {
			buf.push('<li data-index="', i, '">',
					this._options.format(data[i]),
					'</li>');
		}

		this._list.innerHTML = buf.join('');
	};

	/**
	 * Click handler using event delegation.
	 *
	 * @param  e {Event} the click event.
	 */
	CollectionList.prototype._onClick = function (e) {
		var item, index, toselect, selected;

		e = Util.getEvent(e);
		item = Util.getParentNode(e.target, 'LI', this._list);
		if (item !== null) {
			index = parseInt(item.getAttribute('data-index'), 10);
			toselect = this._collection.data()[index];

			if (this._options.clickToDeselect) {
				selected = this._collection.getSelected();
				if (selected === toselect) {
					this._collection.deselect();
					return;
				}
			}

			this._collection.select(toselect);
		}
	};

	/**
	 * Handle collection select event.
	 *
	 * Adds "selected" class to list item for currently selected model.
	 *
	 * @param obj {Object} object that was selected.
	 */
	CollectionList.prototype._onSelect = function (obj) {
		var index, selected;

		// find element for selection
		index = this._collection.getIds()[obj.id];
		selected = this._list.childNodes[index];
		// add selected class
		Util.addClass(selected, 'selected');
	};

	/**
	 * Handle collection deselect event.
	 *
	 * Removes "selected" class from list item for currently selected model.
	 *
	 * @param obj {Object} object that was deselected.
	 */
	CollectionList.prototype._onDeselect = function (obj) {
		var index, selected;

		// find element for selection
		index = this._collection.getIds()[obj.id];
		selected = this._list.childNodes[index];
		// remove selected class
		Util.removeClass(selected, 'selected');
	};


	// return constructor
	return CollectionList;
});

