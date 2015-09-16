/* global unescape */
'use strict';

var Events = require('util/Events'),
    ObservationsView = require('geomag/ObservationsView'),
    ObservatoryFactory = require('geomag/ObservatoryFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  observatoryId: null,
  factory: ObservatoryFactory(),
  user: null
};


var ObservatoryView = function (options) {
  var _this,
      _initialize,

      _factory,
      _observationsView,
      _observatories,
      _observatoryId,
      _observatorySelect,
      _observatoryTitle,
      _user,

      _buildObservatoryList,
      _getHash,
      _getObservatories,
      _getObservatoryId,
      _getObservations,
      _onObservatoryChange,
      _setObservatoryTitle;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    var el;

    el = _this.el;

    _factory = options.factory;
    _observatoryId = options.observatoryId;
    _user = options.user;

    // Overview of a single observatory
    if (_user.get('admin') !== 'Y') {
      el.innerHTML = [
        '<h2 class="observatory-title">Observatory #', _observatoryId, '</h2>',
        '<section class="observations-view"></section>',
      ].join('');

      _observatoryTitle = el.querySelector('.observatory-title');
      _getObservatories(); // Just to update the title
      _getObservations();

    // Overview of all observatories/ observations
    } else {
      el.innerHTML = [
        '<label for="observatories-select">Select Observatory</label>',
        '<select name="observatories" class="observatories" ',
            'id="observatories-select"></select>',
        '<section class="observations-view"></section>'
      ].join('');

      _observatorySelect = el.querySelector('.observatories');
      _observatorySelect.addEventListener('change', _onObservatoryChange);

      // Gets observatories and then renders observations for either...
      // ... (1) The observatory whose Id is in the current window.location.hash
      // ... or ...
      // ... (2) The first observatory in the list
      // This could all be done better with promises...just saying.
      _getObservatories();

      // on a URL change, update the observatory
      Events.on('hashchange', function() {
        _this.render();
      });
    }
  };

  _buildObservatoryList = function (data) {
    var markup,
        observatory,
        observatoryId;

    markup = [];
    for (var i = 0; i < data.length; i++) {
      observatory = data[i];
      observatoryId = observatory.get('id');

      markup.push([
        '<option value="', observatoryId, '" id="', observatoryId, '">',
          observatory.get('name') ,
        '</option>'
      ].join(''));
    }

    _observatorySelect.innerHTML = markup.join('');
  };

  _getHash = function (url) {
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

  _getObservatoryId = function () {
    var id;

    id = _getHash();

    if (id === null) {
      id = _observatoryId;
    }

    if (id === null) {
      id = _observatories[0].get('id');
    }

    return id;
  };

  _getObservations = function () {
    _observationsView = null;

    _observationsView = ObservationsView({
        el: _this.el.querySelector('.observations-view'),
        observatoryId: _getObservatoryId()
    });
  };

  _getObservatories = function () {
    // load observatories
    _factory.getObservatories({
      success: function (observatories) {
        _observatories = observatories;

        if (_observatorySelect) {
          _buildObservatoryList(_observatories);

          if (window.location.replace) {
            window.location.replace('#' + _getObservatoryId());
          } else {
            window.location.hash = '#' + _getObservatoryId();
          }

          _this.render();
        } else {
          _setObservatoryTitle(_observatories);
        }
      }
    });
  };

  _onObservatoryChange = function () {
    window.location.hash = '#' + _observatorySelect.value;
  };

  _setObservatoryTitle = function (data) {
    var i,
        len,
        observatory;

    len = data.length;
    for (i = 0; i < len; i++) {
      observatory = data[i];
      if (observatory.get('id') === _observatoryId) {
        _observatoryTitle.innerHTML = observatory.get('code');
        break;
      }
    }
  };


  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
        // Remove event listeners
        _observatorySelect.removeEventListener('change', _onObservatoryChange);

        // Clean up private methods
        _buildObservatoryList = null;
        _getHash = null;
        _getObservatories = null;
        _getObservatoryId = null;
        _getObservations = null;
        _setObservatoryTitle = null;

        // Clean up private variables
        _factory = null;
        _observationsView = null;
        _observatories = null;
        _observatoryId = null;
        _observatorySelect = null;
        _observatoryTitle = null;
        _user = null;
      },
      // parent class destroy method
      _this.destroy);

  _this.render = function () {
    _observatorySelect.value = _getObservatoryId();

    _getObservations();
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservatoryView;
