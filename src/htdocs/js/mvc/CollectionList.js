/*global define*/
define([
	'mvc/View',
	'mvc/Util'
], function(
	View,
	Util
) {
	'use strict';


	// used to assign unique id's for each list.
	var SEQUENCE = 0;

	// Default options
	var DEFAULTS = {
		format: function(model) {
			return model.id;
		},
		clickToSelect: true
	};


	/**
	 * Render a collection as a list.
	 *
	 * When a list item is clicked, the corresponding model in the collection is
	 * selected.
	 *
	 * @param options {Object} view options.
	 * @param options.collection {mvc.Collection} collection being displayed.
	 * @param options.el {DomElement} default is new DIV element.  element where
	 *                   list is rendered.
	 * @param options.format {Function(model)} default model.id.  function used to
	 *                       generate list item content for each model in the
	 *                       collection.
	 * @param options.clickToSelect {Boolean} default true.  When user clicks on
	 *                              a list item, select the corresponding model
	 *                              in the collection.
	 */
	var CollectionList = function(options) {
		options = Util.extend({}, DEFAULTS, options);
		// call parent constructor
		View.call(this, options);
	};

	// extend View
	CollectionList.prototype = Object.create(View.prototype);


	/**
	 * Initialize the list.
	 *
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	CollectionList.prototype.initialize = function(options) {
		this.options = options;
		// collection used for display
		this.collection = options.collection;
		this.list = options.el.appendChild(document.createElement('ol'));
		this.prefix = '_collection_list_' + (++SEQUENCE) + '_';

		// when collection updates, update view
		this.collection.on('reset', this.render, this);
		this.collection.on('select', this._onSelect, this);
		this.collection.on('deselect', this._onDeselect, this);

		// when user clicks on list, select in collection
		if (options.clickToSelect) {
			this._onClick = Util.bind(this._onClick, this);
			Util.addEvent(this.list, 'click', this._onClick);
		}

		// render first time
		this.render();
	};

	/**
	 * Redraw the list based on existing collection contents.
	 */
	CollectionList.prototype.render = function() {
		var buf = [],
		    data = this.collection.data();

		for (var i=0, len=data.length; i<len; i++) {
			buf.push('<li id="', this.prefix, i, '">',
					this.options.format(data[i]),
					'</li>');
		}

		this.list.innerHTML = buf.join('');
	};

	/**
	 * Click handler using event delegation.
	 *
	 * @param  e {Event} the click event.
	 */
	CollectionList.prototype._onClick = function(e) {
		e = Util.getEvent(e);
		var item = Util.getParentNode(e.target, 'LI', this.el);
		if (item !== null) {
			var index = parseInt(item.getAttribute('id').replace(this.prefix, ''), 10);
			this.collection.select(this.collection.data()[index]);
		}
	};

	/**
	 * Handle collection select event.
	 *
	 * Adds "selected" class to list item for currently selected model.
	 */
	CollectionList.prototype._onSelect = function(obj) {
		// find element for selection
		var index = this.collection.getIds()[obj.id];
		var selected = this.el.querySelector('#' + this.prefix + index);
		// add selected class
		Util.addClass(selected, 'selected');
	};

	/**
	 * Handle collection deselect event.
	 *
	 * Removes "selected" class from list item for currently selected model.
	 */
	CollectionList.prototype._onDeselect = function(obj) {
		// find element for selection
		var index = this.collection.getIds()[obj.id];
		var selected = this.el.querySelector('#' + this.prefix + index);
		// remove selected class
		Util.removeClass(selected, 'selected');
	};


	// return constructor
	return CollectionList;
});
