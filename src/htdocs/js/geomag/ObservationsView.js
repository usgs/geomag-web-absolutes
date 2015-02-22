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

      _options,

      _buildObservationList,
      _formatDate;

  _options = Util.extend({}, _DEFAULTS, options);
  _this = View(_options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function () {

    _this.el.innerHTML = [
        '<h2>Observations</h2>',
        '<section class="observations-new"></section>',
        '<section class="observations-all"></section>'
        // '<section class="observations-pending"></section>', // TODO
        // '<section class="observations-completed"></section>' // TODO
    ].join('');

    // load all observations from an observatory
    _this.getObservations(_options.observatoryId);
  };

  _buildObservationList = function (observations) {
    var list = document.createElement('ul'),
        observation, markup = [], classname, tooltip;

    if (observations === null || observations.length === 0) {
      list.innerHTML = '<li class="empty">There are no observations.</li>';
      return list;
    }

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

    list.innerHTML = markup.join('');

    return list;
  };

  _formatDate = function (observation) {
      var begin = new Date(observation.get('begin') || new Date().getTime()),
      y = begin.getUTCFullYear(),
      m = begin.getUTCMonth() + 1,
      d = begin.getUTCDate();

    return y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
  };

  // create, "add new observation" button
  _this.getAddObservationButton = function (observatoryId) {
    var el = _this.el.querySelector('.observations-new'),
        button = document.createElement('button');

    button.role = 'button';
    button.innerHTML = 'Add New Observation';

    button.addEventListener('click', function () {
      window.location = MOUNT_PATH + '/observation/#' + observatoryId;
    });

    el.appendChild(button);
  };

  // get all observations
  _this.getAllObservations = function (observatory) {
    var el = _this.el.querySelector('.observations-all'),
        observations = observatory.get('observations').data();

    el.appendChild(_buildObservationList(observations));
  };

  // get observations from observatoryId
  _this.getObservations = function (observatoryId) {

    var factory = _options.factory;

    factory.getObservatory({
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
    // create, "add new observation" button
    _this.getAddObservationButton(observatory.get('id'));

    // first pass, get all observations, this can be removed once
    // observation status is implemented, see methods below
    _this.getAllObservations(observatory);

    // TODO, build pending observations list
    //_this.getPendingObservations(observations);

    // TODO, build completed observations list
    //_this.getCompletedObservations(observations);
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
