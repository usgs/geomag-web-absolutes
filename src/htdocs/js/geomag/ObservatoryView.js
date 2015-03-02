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
      _observatoryId,
      _observatorySelect,
      _observatoryTitle,
      _options,
      _user,

      _buildObservatoryList,
      _getHash,
      _getObservatories,
      _getObservations,
      _setObservatoryTitle;

  _options = Util.extend({}, _DEFAULTS, options);
  _this = View(_options);

  _initialize = function () {
    var el = _this.el;

    _factory = _options.factory;
    _observatoryId = _options.observatoryId;
    _user = _options.user;

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
      _observatorySelect.addEventListener('change', function () {
        window.location.hash = '#' + _observatoryId;
      });

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
    var markup = [],
        observatory,
        observatoryId;

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

  _getObservations = function () {
    _observationsView = null;

    if (typeof _observatoryId !== 'undefined' && _observatoryId !== null) {
      _observationsView = ObservationsView({
          el: _this.el.querySelector('.observations-view'),
          observatoryId: _observatoryId
      });
    }
  };

  _getObservatories = function () {
    // load observatories
    _factory.getObservatories({
      success: function (observatories) {
        if (_observatorySelect) {
          _buildObservatoryList(observatories);

          if (!_getHash()) {
            if (window.location.replace) {
              window.location.replace('#' + observatories[0].get('id'));
            } else {
              window.location.hash = '#' + observatories[0].get('id');
            }
          } else {
            _this.render();
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
      if (observatory.get('id') === _observatoryId) {
        _observatoryTitle.innerHTML = observatory.get('code');
        break;
      }
    }
  };


  _this.render = function () {
    if (_observatorySelect && _observatoryId) {
      _observatorySelect.value = _observatoryId;
    }

    _getObservations();
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ObservatoryView;
