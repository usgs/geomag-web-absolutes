'use strict';

var Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  url: 'user_data.php'
};


/**
 * Construct a new UserFactory.
 *
 * @param options.url {String}
 *        url for userfactory.
 *        default 'user_data.php'.
 */
var UserFactory = function (options) {
  var _this,
      _initialize,

      _url;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _url = options.url;
  };


  /**
   * Get a list of observatories
   *
   */
  _this.get = function(options) {
    Xhr.ajax({
      url: _url,
      data: options.data || {},
      success: function (data) {
        if (options.success) {
          options.success(data);
        }
      },
      error: options.error || function () {}
    });
  };

  _this.save = function(options) {
    Xhr.ajax({
      url: _url,
      rawdata: JSON.stringify(options.data),
      method: (options.data.id) ? 'PUT' : 'POST',
      success: function () {
        options.success();
      },
      error: options.error || function () {}
    });
    console.log('create');
  };

  _this.update = function(options) {
    options.success();
    console.log('update');
  };

  _this.destroy = Util.compose(
    // sub class destroy method
    function () {
      // Clean up private variables
      _url = null;
    },
    // parent class destroy method
    _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};

module.exports = UserFactory;
