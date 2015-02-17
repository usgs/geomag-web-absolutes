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
var User = function (attributes) {
  var _this,
      _initialize,

      _attributes;

    _this = Model(attributes);

    _attributes = Util.extend({}, _DEFAULTS, attributes);

  /**
   * Static access to current user object.
   *
   * @return currently logged in user.
   */
  _this.getCurrentUser = function () {
    if (_CURRENT_USER === null) {
      _CURRENT_USER = new User(CurrentUser);
    }
    return _CURRENT_USER;
  };

  return _this;
};

module.exports = User;
