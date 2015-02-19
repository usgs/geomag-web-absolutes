/* global unescape */
'use strict';

var Events = require('util/Events'),
    ObservationsView = require('geomag/ObservationsView'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  observatoryId: null,
  factory: ObservatoryFactory()
};


/**
 * Construct a new DeclinationSummaryView.
 *
 * @param options {Object}
 *        view options.
 * @param options.observatoryId
 * @param options.factory
 */
var ObservatoryView = function (options) {
  var _this,
      _initialize,

      _options,

      _buildObservatoryList,
      _getHash,
      _getObservations,
      _getObservatories,
      _setObservatoryTitle;

  _this = View(options);
  /**
    * Initialize view, and call render.
    * @param options {Object} same as constructor.
    */
  _initialize = function () {
    var el = _this.el,
        id,
        hash;

    _options = Util.extend({}, _DEFAULTS, options);
    id = _options.observatoryId,
    hash = _getHash();

    // Overview of a single observatory
    if (id) {
      el.innerHTML = [
        '<h2 class="observatory-title">Observatory #', id, '</h2>',
        '<section class="observations-view"></section>',
      ].join('');

      _this._observatoryTitle = el.querySelector('.observatory-title');
      _getObservatories(); // Just to update the title
      _getObservations(id);

    // Overview of all observatories/ observations
    } else {
      el.innerHTML = [
        '<label for="observatories-select">Select Observatory</label>',
        '<select name="observatories" class="observatories" ',
            'id="observatories-select"></select>',
        '<section class="observations-view"></section>'
      ].join('');

      _this._observatorySelect = el.querySelector('.observatories');
      _this._observatorySelect.addEventListener('change', function () {
        var value = this.value.replace('observatory_', '');
        window.location.hash = '#' + value;
      });

      // Gets observatories and then renders observations for either...
      // ... (1) The observatory whose Id is in the current window.location.hash
      // ... or ...
      // ... (2) The first observatory in the list
      // This could all be done better with promises...just saying.
      _getObservatories();

      // on a URL change, update the observatory
      Events.on('hashchange', function() {
        _this.render(_getHash());
      });
    }
  };

  _buildObservatoryList = function (data) {
    var observatoryList = _this._observatorySelect,
        markup = [], observatory, observatoryId;

    for (var i = 0; i < data.length; i++) {
      observatory = data[i];
      observatoryId = 'observatory_' + observatory.get('id');

      markup.push([
        '<option value="', observatoryId, '" id="', observatoryId, '">',
          observatory.get('name') ,
        '</option>'
      ].join(''));
    }

    observatoryList.innerHTML = markup.join('');
  };

  _getHash = function(url){
    var hash;

    if (typeof url === 'undefined' || url === null){
      url = window.location.hash;
    }

    if (url === '#' || url.indexOf('#') === -1) {
      return null;
    }

    // strip # from hash
    hash = url.substr(url.indexOf('#') + 1, url.length - url.indexOf('#'));
    // Fix URL encoding of settings hash
    hash = unescape(hash);

    return hash;
  };

  _getObservations = function (id) {
    var el = _this.el;

    _this._observationsView = null;

    if (typeof id !== 'undefined' && id !== null) {
      _this._observationsView = ObservationsView({
          el: el.querySelector('.observations-view'),
          observatoryId: id
      });
    }
  };

  _getObservatories = function () {
    var factory = _options.factory;

    // load observatories
    factory.getObservatories({
      success: function (observatories) {
        var hash = _getHash();

        if (_this._observatorySelect) {
          _this._buildObservatoryList(observatories);

          if (!hash) {
            if (window.location.replace) {
              window.location.replace('#' + observatories[0].get('id'));
            } else {
              window.location.hash = '#' + observatories[0].get('id');
            }
          } else {
            _this.render(hash);
          }
        } else {
          _setObservatoryTitle(observatories);
        }
      }
    });
  };

  _setObservatoryTitle = function (data) {
    var i,
        len = data.length,
        observatory;

    for (i = 0; i < len; i++) {
      observatory = data[i];
      if (observatory.get('id') === _options.observatoryId) {
        _this._observatoryTitle.innerHTML = observatory.get('code');
        break;
      }
    }
  };


  _this.render = function (id) {
    if (typeof id === 'undefined' || id === null) {
      id = _options.observatoryId;
    }

    if (_this._observatorySelect && id) {
      _this._observatorySelect.value = 'observatory_' + id;
    }

    _getObservations(id);
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservatoryView;
