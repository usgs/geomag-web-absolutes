/* global define */
define([
  'util/Util',
  'mvc/View'
], function (
  Util,
  View
) {
  'use strict';


  // default options
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
    this._options = Util.extend({}, DEFAULTS, options);
    View.call(this, this._options);
  };
  // CollectionSelectBox is a View
  CollectionSelectBox.prototype = Object.create(View.prototype);


  /**
   * Initialize the CollectionSelectBox.
   */
  CollectionSelectBox.prototype._initialize = function () {
    // bind callbacks
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onSelect = this._onSelect.bind(this);
    // add select box change listener
    this._el.addEventListener('change', this._onChange);
    // initialize collection
    this._collection = null;
    if (this._options.collection !== null) {
      this.setCollection(this._options.collection);
    }
  };

  /**
   * Select an item in the collection based on its id.
   *
   * @param id to select.
   */
  CollectionSelectBox.prototype.selectById = function (id) {
    var collection = this._collection,
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
   * Remove "disabled" attribute from element.
   */
  CollectionSelectBox.prototype.enable = function () {
    this._el.removeAttribute('disabled');
  };

  /**
   * Add "disabled" attribute to element.
   */
  CollectionSelectBox.prototype.disable = function () {
    this._el.setAttribute('disabled', 'disabled');
  };

  /**
   * Set the collection to display.
   * Calls render after binding events.
   *
   * @param collection {Collection}
   *        a collection with items to display.
   */
  CollectionSelectBox.prototype.setCollection = function (collection) {
    var render = this.render,
        select = this._onSelect,
        oldCollection;
    // remove existing bindings
    oldCollection = this._collection;
    if (oldCollection !== null) {
      oldCollection.off('add', render, this);
      oldCollection.off('remove', render, this);
      oldCollection.off('reset', render, this);
      oldCollection.off('select', select, this);
      oldCollection = null;
    }
    // add new bindings
    this._collection = collection;
    if (collection !== null) {
      collection.on('add', render, this);
      collection.on('remove', render, this);
      collection.on('reset', render, this);
      collection.on('select', select, this);
    }
    // redraw
    this.render();
  };

  /**
   * Render select box content.
   */
  CollectionSelectBox.prototype.render = function () {
    var el = this._el,
        options = this._options,
        allowDeselect = options.allowDeselect,
        emptyText = options.emptyText,
        formatOption = options.formatOption,
        collection = this._collection,
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
      this.disable();
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
      this.enable();
    }

    this.trigger('change', selected, collection);
  };


  /**
   * SelectBox "change" event handler.
   */
  CollectionSelectBox.prototype._onChange = function () {
    var value = this._el.value,
        collection = this._collection,
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
  CollectionSelectBox.prototype._onSelect = function () {
    var el = this._el,
        oldValue = el.value,
        newValue = '',
        collection = this._collection,
        selected = collection.getSelected();
    if (selected !== null) {
      newValue = selected.id;
    }
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    this.trigger('change', selected, collection);
  };


  return CollectionSelectBox;
});
