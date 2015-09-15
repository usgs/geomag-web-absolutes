'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'name': null,
  'begin': null,
  'end': null,
  'correction': null,
  'default_mark_id': null,
  'default_electronics_id': null,
  'default_theodolite_id': null,
  'marks': null
};


/**
 * Constructor.
 *
 * @param  options {Object} pier attributes.
 */
var Pier = function (options) {
  var _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = Model(options);

  /**
   * Get the default mark for the pier.
   *
   * @return {Mark} the default mark, or null if no default is specified.
   */
  _this.getDefaultMark = function () {
    var marks = _this.get('marks'),
        default_mark_id = _this.get('default_mark_id');

    if (marks !== null && default_mark_id !== null) {
      return marks.get(default_mark_id);
    } else {
      return null;
    }
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

module.exports = Pier;
