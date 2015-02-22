/* global CurrentUser */
'use strict';

var Model = require('mvc/Model'),
    Util = require('util/Util');


// static reference to currently logged in user
var _CURRENT_USER = null;

var _DEFAULTS = {
  'id': null,
  'name': null,
  'username': null,
  'default_observatory_id': null,
  'email': null,
  'last_login': null,
  'admin': null,
  'enabled': null
};


/**
 * Construct a new User object.
 */
var User = function (options) {
  var _this,
      _initialize;

  _this = Model(Util.extend({}, _DEFAULTS, options));

  _initialize = function () {};
  /**
   * Static access to current user object.
   *
   * @return currently logged in user.
   */
  _this.getCurrentUser = function () {
    if (_CURRENT_USER === null) {
      _CURRENT_USER = User(CurrentUser);
    }
    return _CURRENT_USER;
  };

  _initialize();
  options = null;
  return _this;
};

module.exports = User;
