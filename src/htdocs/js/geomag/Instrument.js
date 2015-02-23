'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  'id': null,
  'name': null,
  'type': null,
  'serial_number': null,
  'begin': null,
  'end': null
};


var Instrument = function (attributes) {
  var _this;


  _this = Model(Util.extend({}, _DEFAULTS, attributes));


  return _this;
};

module.exports = Instrument;
