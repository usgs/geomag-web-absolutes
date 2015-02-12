/*global define*/

define([
  'mvc/Model',
  'mvc/Collection',
  'util/Util'
], function(
  Model,
  Collection,
  Util
) {
  'use strict';


  /** Define default attributes. */
  var DEFAULTS = {
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
    // Call parent constructor
    Model.call(this, Util.extend({}, DEFAULTS, options));
  };

  // Observatory extends Model
  Observatory.prototype = Object.create(Model.prototype);


  /**
   * Get the default pier for this observatory.
   *
   * @return {Pier} the default pier, or null if no default is specified.
   */
  Observatory.prototype.getDefaultPier = function () {
    var piers = this.get('piers'),
        default_pier_id = this.get('default_pier_id');
    if (piers !== null && default_pier_id !== null) {
      return piers.get(default_pier_id);
    } else {
      return null;
    }
  };

  /**
   * Get a pier object based on a mark id.
   *
   * @param id {Integer}
   *        the mark id.
   * @return {Pier} the pier object, or null if not found.
   */
  Observatory.prototype.getPierByMarkId = function (id) {
    var piers = this.get('piers').data(),
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
   * Get a mark object based on a mark id.
   *
   * @param id {Integer}
   *        the mark id.
   * @return {Mark} the mark object, or null if not found.
   */
  Observatory.prototype.getMarkById = function (id) {
    var piers = this.get('piers').data(),
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
   * Get "electronics" instruments.
   *
   * @return {Collection<Instrument>} instruments with type === 'elec'.
   */
  Observatory.prototype.getElectronics = function () {
    var electronics = [],
        instruments = this.get('instruments').data(),
        instrument,
        i,
        len;
    for (i = 0, len = instruments.length; i < len; i++) {
      instrument = instruments[i];
      if (instrument.get('type') === 'electronics') {
        electronics.push(instrument);
      }
    }
    return new Collection(electronics);
  };


  /**
   * Get theodolite instruments.
   *
   * @return {Collection<Instrument>} instruments with type === 'theo'.
   */
  Observatory.prototype.getTheodolites = function () {
    var theodolites = [],
        instruments = this.get('instruments').data(),
        instrument,
        i,
        len;
    for (i = 0, len = instruments.length; i < len; i++) {
      instrument = instruments[i];
      if (instrument.get('type') === 'theodolite') {
        theodolites.push(instrument);
      }
    }
    return new Collection(theodolites);
  };


  // return constructor from closure
  return Observatory;
});
