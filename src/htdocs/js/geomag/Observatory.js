'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'code': null,
  'name': null,
  'location': null,
  'latitude': null,
  'longitude': null,
  'geomagnetic_latitude': null,
  'geomagnetic_longitude': null,
  'elevation': null,
  'orientation': null,
  'instruments': null,
  'piers': null,
  'default_pier_id': null
};


/**
 * Constructor.
 *
 * @param  options {Object} observatory attributes.
 */
var Observatory = function (options) {
  var _this;


  options =  Util.extend({}, _DEFAULTS, options);
  _this = Model(options);


  /**
   * Get the default pier for this observatory.
   *
   * @return {Pier} the default pier, or null if no default is specified.
   */
  _this.getDefaultPier = function () {
    var piers = _this.get('piers'),
        default_pier_id = _this.get('default_pier_id');
    if (piers !== null && default_pier_id !== null) {
      return piers.get(default_pier_id);
    } else {
      return null;
    }
  };

  /**
   * Get "electronics" instruments.
   *
   * @return {Collection<Instrument>} instruments with type === 'elec'.
   */
  _this.getElectronics = function () {
    var electronics = [],
        instruments = _this.get('instruments').data(),
        instrument,
        i,
        len;
    for (i = 0, len = instruments.length; i < len; i++) {
      instrument = instruments[i];
      if (instrument.get('type') === 'electronics') {
        electronics.push(instrument);
      }
    }
    return Collection(electronics);
  };

  /**
   * Get a mark object based on a mark id.
   *
   * @param id {Integer}
   *        the mark id.
   * @return {Mark} the mark object, or null if not found.
   */
  _this.getMarkById = function (id) {
    var piers = _this.get('piers').data(),
        pier,
        marks,
        mark,
        i,
        len;
    for (i = 0, len = piers.length; i < len; i++) {
      pier = piers[i];
      marks = pier.get('marks');
      mark = marks.get(id);
      if (mark !== null) {
        return mark;
      }
    }
    return null;
  };

  /**
   * Get a pier object based on a mark id.
   *
   * @param id {Integer}
   *        the mark id.
   * @return {Pier} the pier object, or null if not found.
   */
  _this.getPierByMarkId = function (id) {
    var piers = _this.get('piers').data(),
        pier,
        marks,
        mark,
        i,
        len;
    for (i = 0, len = piers.length; i < len; i++) {
      pier = piers[i];
      marks = pier.get('marks');
      mark = marks.get(id);
      if (mark !== null) {
        return pier;
      }
    }
    return null;
  };

  /**
   * Get theodolite instruments.
   *
   * @return {Collection<Instrument>} instruments with type === 'theo'.
   */
  _this.getTheodolites = function () {
    var theodolites = [],
        instruments = _this.get('instruments').data(),
        instrument,
        i,
        len;
    for (i = 0, len = instruments.length; i < len; i++) {
      instrument = instruments[i];
      if (instrument.get('type') === 'theodolite') {
        theodolites.push(instrument);
      }
    }
    return Collection(theodolites);
  };

  _this.destroy = Util.compose(
      // sub class destroy method
      function () {
      },
      // parent class destroy method
      _this.destroy);


  options = null;
  return _this;
};

module.exports =  Observatory;
