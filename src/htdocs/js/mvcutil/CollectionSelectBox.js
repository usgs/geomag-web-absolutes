'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var DEFAULTS = {
  allowDeselect: false,
  emptyText: '',
  collection: null,
  formatOption: function (model) {
    return model.get('name');
  }
};


/**
 * Create a new CollectionSelectBox.
 *
 * @param options {Object}
 * @param options.el {SelectElement}
 *        "select" element to manage.
 * @param options.allowDeselect {Boolean}
 *        add an empty option used to trigger collection deselect.
 *        default false.
 * @param emptyText {String}
 *        text to display when collection is null or empty.
 *        default ''.
 * @param options.collection {Collection}
 *        collection to manage.
 *        Optional, can be changed later using setCollection().
 * @param options.formatOption {Function(model)}
 *        format method for option content.
 *        default returns model.get('name');
 */
var CollectionSelectBox = function (options) {
  var _this,
      _initialize,

      _options;

    _this = View(options);
  /**
   * Initialize the CollectionSelectBox.
   */
  _initialize = function () {
    _options = Util.extend({}, DEFAULTS, options);

    // add select box change listener
    _this.el.addEventListener('change', _onChange);
    // initialize collection
    _this._collection = null;
    if (_options.collection !== null) {
      _this.setCollection(_options.collection);
    }
  };

  /**
   * SelectBox "change" event handler.
   */
  _onChange = function () {
    var value = _this.el.value,
        collection = _this._collection,
        selected = null;
    if (value === '') {
      collection.deselect();
    } else {
      selected = collection.get(parseInt(value, 10));
      collection.select(selected);
    }
  };

  /**
   * Collection "select" event handler.
   */
  _onSelect = function () {
    var el = _this.el,
        oldValue = el.value,
        newValue = '',
        collection = _this._collection,
        selected = collection.getSelected();
    if (selected !== null) {
      newValue = selected.id;
    }
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    _this.trigger('change', selected, collection);
  };


  /**
   * Add "disabled" attribute to element.
   */
  _this.disable = function () {
    _this.el.setAttribute('disabled', 'disabled');
  };

  /**
   * Remove "disabled" attribute from element.
   */
  _this.enable = function () {
    _this.el.removeAttribute('disabled');
  };

  /**
   * Render select box content.
   */
  _this.render = function () {
    var el = _this.el,
        allowDeselect = _options.allowDeselect,
        emptyText = _options.emptyText,
        formatOption = _options.formatOption,
        collection = _this._collection,
        data,
        selected = null,
        buf,
        d,
        i,
        len;

    if (collection === null || collection.data().length === 0) {
      if (emptyText !== '') {
        emptyText = '<option value="">' + emptyText + '</option>';
      }
      // clear element
      el.innerHTML = emptyText;
      el.value = '';
      _this.disable();
    } else {
      buf = [];
      data = collection.data();
      selected = collection.getSelected();
      // option to deselect
      if (selected === null || allowDeselect) {
        buf.push('<option value="">Please select...</option>');
      }
      // options for collection elements
      for (i = 0, len = data.length; i < len; i++) {
        d = data[i];
        buf.push('<option value="', d.id, '">', formatOption(d), '</option>');
      }
      // update element
      el.innerHTML = buf.join('');
      el.value = (selected === null ? '' : selected.id);
      _this.enable();
    }

    _this.trigger('change', selected, collection);
  };

  /**
   * Select an item in the collection based on its id.
   *
   * @param id to select.
   */
  _this.selectById = function (id) {
    var collection = _this._collection,
        item = null;
    if (collection !== null) {
      if (id !== null) {
        item = collection.get(id);
      }
      if (item !== null) {
        collection.select(item);
      } else {
        collection.deselect();
      }
    }
  };

  /**
   * Set the collection to display.
   * Calls render after binding events.
   *
   * @param collection {Collection}
   *        a collection with items to display.
   */
  _this.setCollection = function (collection) {
    var select = _onSelect,
        oldCollection;

    // remove existing bindings
    oldCollection = _this._collection;
    if (oldCollection !== null) {
      oldCollection.off('add', _this.render, _this);
      oldCollection.off('remove', _this.render, _this);
      oldCollection.off('reset', _this.render, _this);
      oldCollection.off('select', select, _this);
      oldCollection = null;
    }
    // add new bindings
    _this._collection = collection;
    if (collection !== null) {
      collection.on('add', _this.render, _this);
      collection.on('remove', _this.render, _this);
      collection.on('reset', _this.render, _this);
      collection.on('select', _this.select, _this);
    }
    // redraw
    _this.render();
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = CollectionSelectBox;
