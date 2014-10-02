/* MOUNT_PATH */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvcutil/CollectionSelectBox'),
    Formatter = require('geomag/Formatter'),
    User = require('geomag/User'),
    UserFactory = require('geomag/UserFactory'),
    Util = require('util/Util'),
    View = require('mvc/View');


// default constructor options
var _DEFAULTS = {
  observatoryId: null,
  UserFactory: new UserFactory({
    url: MOUNT_PATH + '/user_data.php'
  })
};

// unique id prefix for form elements
var _IDPREFIX = 'observationmetaview-';

// unique id sequence for form elements
var _SEQUENCE = 0;


/**
 * Utility function to select a collection item based on item id.
 *
 * If collection is not null, selects collection item with id
 * or triggers deselect if no matching item found.
 *
 * @param collection {Collection}
 *        collection being selected.
 * @param id {Number}
 *        id of collection item to select.
 */
var __select_by_id = function (collection, id) {
  var item = null;
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


var ObservationMetaView = function (options) {
  var _this,
      _initialize,

      _calculator,
      _date,
      _electronicsSelectView,
      _marksSelectView,
      _julianDay,
      _observation,
      _observatoryId,
      _observatorySelectView,
      _observatories,
      _observerName,
      _pierSelectView,
      _pierTemperature,
      _theodoliteSelectView,
      _user,

      _createViewSkeleton,
      _formatInstrument,
      _formatMark,
      _formatPier,
      _onChange,
      _setObservatory;


  _this = View(options);

  /**
   * Construct a new ObservationMetaView.
   *
   * @param options {Object}
   * @param options.observation {Observation}
   *        observation to display.
   */
  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _calculator = options.calculator;
    _observation = options.observation;
    _observatories = options.observatories || Collection([]);

    _observatoryId = options.observatoryId;

    _userFactory = options.UserFactory;
    _user = User.getCurrentUser();

    _createViewSkeleton();
  };


  _this.render = function () {
    var begin = new Date(_observation.get('begin') || (new Date()).getTime()),
        y = begin.getUTCFullYear(),
        m = begin.getUTCMonth() + 1,
        d = begin.getUTCDate(),
        observer = _observation.get('observer_user_id');

    _date.value = y + '-' + (m<10?'0':'') + m + '-' + (d<10?'0':'') + d;
    _julianDay.value = _this.getJulianDay(begin);
    _pierTemperature.value = _observation.get('pier_temperature');

    _observerName.value = observer;
    if (observer) {
      _userFactory.get({
        data: {'id': observer},
        success: function (data) {
          // replace observer_user_id with username once it is returned.
          _observerName.value = data.username;
        }
      });
      } else {
      _observerName.value = user.get('username');
    }
  };


  _this.getJulianDay = function (date) {
    var y = date.getUTCFullYear(),
        m = date.getUTCMonth(),
        d = date.getUTCDate(),
        janOne = new Date(y,0,1),
        selectedDate = new Date(y,m,d);

    return Math.round((selectedDate - janOne) / 86400000) + 1;
  };


  _createViewSkeleton = function () {
    var el = _this.el,
        idPrefix = _IDPREFIX + (++_SEQUENCE);

    el.innerHTML = [
      '<section class="observation-meta-view">',
        '<div class="row">',
          '<div class="column one-of-two left-aligned">',
            '<label for="', idPrefix, '-date" class="print-hidden">Date</label>',
            '<input id="',  idPrefix, '-date" type="text"',
                ' class="observation-date" placeholder="YYYY-MM-DD"/>',
            '<label for="', idPrefix, '-julian-day" class="print-hidden">Julian Day</label>',
            '<input id="', idPrefix, '-julian-day" type="text"',
                ' class="julian-day-value" disabled />',
            '<label for="', idPrefix, '-piertemp" class="print-hidden">',
                'Pier <abbr title="Temperature">Temp</abbr></label>',
            '<input id="',  idPrefix, '-piertemp" type="text"',
                ' class="pier-temperature"/>',
            '<label for="', idPrefix, '-observer">Observer</label>',
            '<input id="',  idPrefix, '-observer" type="text"',
                ' class="observer-name" disabled />',
          '</div>',
          '<div class="column one-of-two left-aligned">',
            '<label for="', idPrefix, '-observatory" class="print-hidden">Observatory</label>',
            '<select id="', idPrefix, '-observatory"',
                ' class="observatory"></select>',
            '<label for="', idPrefix, '-pier" class="print-hidden">Pier</label>',
            '<select id="', idPrefix, '-pier"',
                ' class="pier"></select>',
            '<label for="', idPrefix, '-mark" class="print-hidden">Mark</label>',
            '<select id="', idPrefix, '-mark"',
                ' class="mark"></select>',
            '<label for="', idPrefix, '-electronics" class="print-hidden">Electronics</label>',
            '<select id="', idPrefix, '-electronics"',
                ' class="electronics"></select>',
            '<label for="', idPrefix, '-theodolite" class="print-hidden">Theodolite</label>',
            '<select id="', idPrefix, '-theodolite"',
                ' class="theodolite"></select>',
          '</div>',
        '</div>',
      '</section>'
    ].join('');

    // observatory information inputs
    _observatorySelectView = new CollectionSelectBox({
      el: el.querySelector('.observatory'),
      emptyText: 'Loading observatories...'
    });
    _pierSelectView = new CollectionSelectBox({
      el: el.querySelector('.pier'),
      emptyText: 'Select observatory...',
      formatOption: _formatPier
    });
    _marksSelectView = new CollectionSelectBox({
      el: el.querySelector('.mark'),
      emptyText: 'Select pier...',
      formatOption: _formatMark
    });
    _electronicsSelectView = new CollectionSelectBox({
      el: el.querySelector('.electronics'),
      emptyText: 'Select observatory...',
      formatOption: _formatInstrument
    });
    _theodoliteSelectView = new CollectionSelectBox({
      el: el.querySelector('.theodolite'),
      emptyText: 'Select observatory...',
      formatOption: _formatInstrument
    });

    // observation inputs
    _date = el.querySelector('.observation-date');
    _julianDay = el.querySelector('.julian-day-value');
    _pierTemperature = el.querySelector('.pier-temperature');
    _observerName = el.querySelector('.observer-name');

    _date.addEventListener('change', _onChange);
    // This makes sure the Julian day updates, among other things
    _observation.on('change', 'render', _this);
    _pierTemperature.addEventListener('change', _onChange);


    _observatorySelectView.on('change', function (selected) {
      // currently selected observatory
      var observatory_id = _observation.get('observatory_id');

      // disable dependent select boxes until observatory loads
      _pierSelectView.disable();
      _marksSelectView.disable();
      _electronicsSelectView.disable();
      _theodoliteSelectView.disable();

      if (selected === null) {
        // no selection
        _observation.set({observatory_id: null});
      } else {
        if (observatory_id !== selected.id) {
          // different observatory, clear mark and instrument attributes
          _observation.set({
            observatory_id: selected.id,
            mark_id: null,
            electronics_id: null,
            theodolite_id: null
          });
          // clear calculator settings
          _calculator.set({
            pierCorrection: 0,
            trueAzimuthOfMark: 0
          });
        }
        // load observatory details
        selected.getObservatory({
          success: function (observatory) {
            _setObservatory(observatory);
          }
        });
      }

    });

    _pierSelectView.on('change', function (pier) {
      var marks = null,
          mark_id = null,
          mark = null,
          pierCorrection = 0,
          trueAzimuthOfMark = 0;
      if (pier !== null) {
        pierCorrection = pier.get('correction');

        // update mark
        marks = pier.get('marks');
        mark_id = _observation.get('mark_id') ||
            pier.get('default_mark_id');
        mark = marks.get(mark_id);
        if (mark !== null) {
          marks.select(mark);
          trueAzimuthOfMark = mark.get('azimuth');
        }
        // set defaults
        if (_observation.get('electronics_id') === null) {
          _electronicsSelectView.selectById(
              pier.get('default_electronics_id'));
        }
        if (_observation.get('theodolite_id') === null) {
          _theodoliteSelectView.selectById(
              pier.get('default_theodolite_id'));
        }
      }
      // azimuth is also set by marksSelectView.setCollection when
      // mark changes, set now to prevent a double "change" event
      _calculator.set({
        pierCorrection: pierCorrection,
        trueAzimuthOfMark: trueAzimuthOfMark
      });
      _marksSelectView.setCollection(marks);
    });

    _marksSelectView.on('change', function (mark) {
      var mark_id = null,
          trueAzimuthOfMark = 0;
      if (mark !== null) {
        mark_id = mark.id;
        trueAzimuthOfMark = mark.get('azimuth');
      }
      _observation.set({mark_id: mark_id});
      _calculator.set({trueAzimuthOfMark: trueAzimuthOfMark});
    });

    _electronicsSelectView.on('change', function (selected) {
      _observation.set({
        electronics_id: (selected === null ? null : selected.id)
      });
    });

    _theodoliteSelectView.on('change', function (selected) {
      _observation.set({
        theodolite_id: (selected === null ? null : selected.id)
      });
    });

    // load observatories collection
    _observatorySelectView.setCollection(_observatories);
    _observatorySelectView.selectById(_observatoryId);

    // fill in observation inputs
    _this.render();
  };

  /**
   * Called when an observatory detail has been loaded.
   *
   * @param {[type]} observatory [description]
   */
  _setObservatory = function (observatory) {
    var mark_id,
        electronics_id,
        theodolite_id,
        // observatory information
        piers = observatory.get('piers'),
        default_pier_id = observatory.get('default_pier_id'),
        default_electronics_id = null,
        default_theodolite_id = null,
        electronics = observatory.getElectronics(),
        theodolites = observatory.getTheodolites(),
        // other locals
        pier = null;

    // update observatory id
    if (_observation.get('observatory_id') !== observatory.id) {
      // different observatory, clear related info
      _observation.set({
        observatory_id: observatory.id,
        mark_id: null,
        electronics_id: null,
        theodolite_id: null
      });
    }

    // read these after they were potentially reset
    mark_id = _observation.get('mark_id');
    electronics_id = _observation.get('electronics_id');
    theodolite_id = _observation.get('theodolite_id');

    // preserve existing selections
    if (mark_id !== null) {
      pier = observatory.getPierByMarkId(mark_id);
    } else if (default_pier_id !== null) {
      pier = piers.get(default_pier_id);
    }
    if (pier !== null) {
      piers.select(pier);
      default_electronics_id = pier.get('default_electronics_id');
      default_theodolite_id = pier.get('default_theodolite_id');
    }
    __select_by_id(electronics, electronics_id || default_electronics_id);
    __select_by_id(theodolites, theodolite_id || default_theodolite_id);

    // update views
    _electronicsSelectView.setCollection(electronics);
    _theodoliteSelectView.setCollection(theodolites);
    _pierSelectView.setCollection(piers);
  };

  /**
   * Input element change handler.
   *
   * Updated observation begin and pier_temperature attributes from form.
   */
  _onChange = function () {
    var pierTemperature = _pierTemperature.value;

    pierTemperature = (pierTemperature === '' ?
        null : parseFloat(pierTemperature));

    _observation.set({
      begin: Formatter.parseDate(_date.value),
      pier_temperature: pierTemperature
    });
  };

  /**
   * Formatting callback for pier select view.
   *
   * @param pier {Pier}
   * @return {String} content for option element.
   */
  _formatPier = function (pier) {
    return pier.get('name') + ' (' + pier.get('correction') + ' nT)';
  };

  /**
   * Formatting callback for mark select view.
   *
   * @param mark {Mark}
   * @return {String} content for option element.
   */
  _formatMark = function (mark) {
    return mark.get('name') + ' (' + mark.get('azimuth') + '&deg;)';
  };


  /**
   * Formatting callback for electronics and theodolite select views.
   *
   * @param instrument {Instrument}
   * @return {String} content for option element.
   */
  _formatInstrument = function (instrument) {
    return instrument.get('name') + ' (' + instrument.get('serial_number') + ')';
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ObservationMetaView;
