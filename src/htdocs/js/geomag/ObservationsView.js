/* global MOUNT_PATH */
'use strict';

var ObservatoryFactory = require('geomag/ObservatoryFactory'),
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
 */
var ObservationsView = function (options) {
  var _this,
      _initialize,

      _factory,
      _options,
      _observatoryId,

      _buildObservationList,
      _formatDate,
      _onObservationClick;

  _options = Util.extend({}, _DEFAULTS, options);
  _this = View(_options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {
    _factory = _options.factory;
    _observatoryId = _options.observatoryId;

    _this.el.innerHTML = [
        '<h2>Observations</h2>',
        '<section class="observations-new"></section>',
        '<section class="observations-all"></section>'
        // '<section class="observations-pending"></section>', // TODO
        // '<section class="observations-completed"></section>' // TODO
    ].join('');

    // load all observations from an observatory
    _this.getObservations(_observatoryId);

    // create, "add new observation" button
    _this.getAddObservationButton();
  };

  _buildObservationList = function (observations) {
    var classname,
        list,
        markup,
        observation,
        p,
        tooltip;

    if (observations === null || observations.length === 0) {
      p = document.createElement('p');
      p.className = 'alert info';
      p.innerHTML = 'There are no observations.';
      return p;
    }

    markup = [];
    for (var i = 0; i < observations.length; i++) {
      observation = observations[i];
      classname = observation.get('reviewed');

      if (classname) {
        classname = classname.toLowerCase();

        if (classname === 'n') {
          tooltip = 'Observation Pending Review';
        } else if (classname === 'y') {
          tooltip = 'Observation Approved';
        }

        classname = 'review-status-' + classname.toLowerCase();
      } else {
        classname = 'review-status-unknown';
        tooltip = 'Observation in unknown review status!';
      }

      markup.push(
        '<li class="', classname, '" title="', tooltip, '">' +
          '<a href="' + MOUNT_PATH + '/observation/' + observation.get('id') +
              '">Observation ' +
            _formatDate(observation) +
          '</a>' +
          //TODO, add delete button to observations
          //'<a href="#" class="delete">Delete</a>' +
        '</li>'
      );
    }

    list = document.createElement('ul');
    list.innerHTML = markup.join('');

    return list;
  };

  _onObservationClick = function () {
    window.location = MOUNT_PATH + '/observation/#' + _observatoryId;
  };

  _formatDate = function (observation) {
      var begin = new Date(observation.get('begin') || new Date().getTime()),
      y = begin.getUTCFullYear(),
      m = begin.getUTCMonth() + 1,
      d = begin.getUTCDate();

    return y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
  };


  // create, "add new observation" button
  _this.getAddObservationButton = function () {
    var el,
        button;

    el = _this.el.querySelector('.observations-new');
    button = document.createElement('button');
    button.role = 'button';
    button.innerHTML = 'Add New Observation';

    button.addEventListener('click', _onObservationClick);

    Util.empty(el);
    el.appendChild(button);
  };

  // get all observations
  _this.getAllObservations = function (observatory) {
    var el,
        observations;

    el = _this.el.querySelector('.observations-all');
    observations = observatory.get('observations').data();

    Util.empty(el);
    el.appendChild(_buildObservationList(observations));
  };

  // get observations from observatoryId
  _this.getObservations = function (observatoryId) {
    _factory.getObservatory({
      id: observatoryId,
      success: function (observatory) {
        _this.render(observatory);
      },
      error: function () {
        _this.el.innerHTML = '<p>The observatory (id = ' + observatoryId +
            ') that you requested does not exists in the database.</p>';
      }
    });
  };

  _this.render = function (observatory) {
    _observatoryId = observatory.get('id');

    // first pass, get all observations, this can be removed once
    // observation status is implemented, see methods below
    _this.getAllObservations(observatory);

    // TODO, build pending observations list
    //_this.getPendingObservations(observations);

    // TODO, build completed observations list
    //_this.getCompletedObservations(observations);
  };

  _this.destroy = function () {
    var button = _this.el.querySelector('button');

    // Remove event listeners
    button.removeEventListener('click', _onObservationClick);

    // Clean up private methods
    _buildObservationList = null;
    _formatDate = null;
    _onObservationClick = null;

    // Clean up private variables
    _factory = null;
    _options = null;
    _observatoryId = null;
  };


  // TODO, get all pending observations
  // _this.getPendingObservations =
  //     function (observations) {
  //   var el = _this.el.querySelector('.observations-pending'),
  //       pending = [],
  //       observation;

  //   for (var i = 0; i < observations.length; i++) {
  //     observation = observations[i];

  //     if (observation.reviewed === 'N') {
  //       pending.push(observation);
  //     }
  //   }

  //   el.innerHTML = '<h3>Pending</h3>';
  //   el.appendChild(_buildObservationList(pending));
  // };

  // TODO, get all completed observations
  // _this.getCompletedObservations =
  //     function (observations) {
  //   var el = _this.el.querySelector('.observations-completed'),
  //       completed = [],
  //       observation;

  //   for (var i = 0; i < observations.length; i++) {
  //     observation = observations[i];

  //     if (observation.reviewed === 'Y') {
  //       completed.push(observation);
  //     }
  //   }

  //   el.innerHTML = '<h3>Completed</h3>';
  //   el.appendChild(_buildObservationList(completed));
  // };

  _initialize();
  options = null;
  return _this;
};

module.exports = ObservationsView;
