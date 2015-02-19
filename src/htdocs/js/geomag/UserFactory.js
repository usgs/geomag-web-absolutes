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

      _options;

  _this = {};
  _options = Util.extend({}, _DEFAULTS, options);

  _this.destroy = function(options) {
    options.success();
    console.log('destroy');
  };

  /**
   * Get a list of observatories
   *
   */
  _this.get = function(options) {
    Xhr.ajax({
      url: _options.url,
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
      url: _options.url,
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
    console.log('create');
  };

  return _this;
};

module.exports = UserFactory;
