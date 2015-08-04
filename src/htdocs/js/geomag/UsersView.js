'use strict';

var CollectionTable = require('mvc/CollectionTable'),
    Format = require('geomag/Formatter'),
    Util = require('util/Util');


var SPAN_OPEN = '<span class="disabled">',
    SPAN_CLOSED = '</span>';


var _DEFAULTS = {
  className: 'collection-table users-view tabular',
  clickToSelect: false,
  columns: [
    {
      className: 'username',
      title: 'Username',
      format: function (user) {
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('username') + SPAN_CLOSED;
        }
        return user.get('username');
      }
    },
    {
      className: 'email',
      title: 'Email',
      format: function (user) {
        if (user.get('email') === null) {
          return '&ndash;';
        }
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('email') + SPAN_CLOSED;
        }
        return user.get('email');
      }
    },
    {
      className: 'name',
      title: 'Name',
      format: function (user) {
        if (user.get('name') === null) {
          return '&ndash;';
        }
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('name') + SPAN_CLOSED;
        }
        return user.get('name');
      }
    },
    {
      className: 'admin',
      title: 'Admin',
      format: function (user) {
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('admin') + SPAN_CLOSED;
        }
        return user.get('admin');
      }
    },
    {
      className: 'enabled',
      title: 'Enabled',
      format: function (user) {
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('enabled') + SPAN_CLOSED;
        }
        return user.get('enabled');
      }
    },
    {
      className: 'last_login',
      title: 'Last Login',
      format: function (user) {
        if (user.get('last_login') === null) {
          return '&ndash;';
        }
        if (user.get('enabled') === 'N') {
          return SPAN_OPEN + user.get('last_login') + SPAN_CLOSED;
        }
        return Format.date(parseInt(user.get('last_login'), 10)*1000);
      }
    },
    {
      className: 'edit',
      title: '',
      format: function (user) {
        return '<button class="edituser" data-id="' + user.get('id') +
            '">Edit</button>';
      }
    }
  ],
  emptyMarkup: '&ndash;'
};


var UsersView = function (options) {
  var _this;

  _this = CollectionTable(Util.extend({}, _DEFAULTS, options || {}));

  options = null;
  return _this;
};

module.exports = UsersView;
