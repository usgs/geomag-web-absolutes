'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'name': null,
  'begin': null,
  'end': null,
  'azimuth': null
};


/**
  * Constructor.
  *
  * @param  options {Object} observatory attributes.
  */
var Mark = function (options) {
  var _this,
      _intitialize,

      _options;

  _this = Model(options);

  _options = Util.extend({}, _DEFAULTS, options);

  return _this;
};

module.exports = Mark;
