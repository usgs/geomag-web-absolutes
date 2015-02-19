'use strict';

var Collection = require('mvc/Collection'),
    ModalView = require('mvc/ModalView'),
    User = require('geomag/User'),
    UserEditView = require('geomag/UserEditView'),
    UsersView = require('geomag/UsersView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  'name': null,
  'username': null,
  'default_observatory_id': null,
  'email': null,
  'password': null,
  'last_login': null,
  'admin': null,
  'enabled': null
};


/**
 * Construct a new DeclinationView.
 *
 * @param options {Object}
 *        view options.
 * @param options.baselineCalculator {geomag.ObservationBaselineCalculator}
 *        the calculator to use.
 * @param options.factory
 * @parem options.observatories
 * @param options.reading {geomag.Reading}
 *        the reading to display.
 */
var UserAdminView = function (options) {
  var _this,
      _initialize,

      _options,

      _getUsers,
      _onEditClick,
      _onUserCancel,
      _onUserSave;

  _this = View(options);
  /**
   * Initialize view, and call render.
   * @param options {Object} same as constructor.
   */
  _initialize = function (options) {
    _options = Util.extend({}, _DEFAULTS, options);
    _this.el.innerHTML = [
        '<section class="user-admin-control">',
          '<button class="edituser" data-id="">Create User</button>',
        '<section>',
        '<section class="users-view-wrapper"></section>'
    ].join('');

    _this._users = Collection([]);
    _this._user = null;

    _this._usersView = UsersView({
      el: _this.el.querySelector('.users-view-wrapper'),
      collection: _this._users
    });

    _this.el.addEventListener('click', _onEditClick);

    _getUsers();
  };

  _getUsers = function () {
    _options.factory.get({
      success: function (data) {
        data = data.map(function (info) {return User(info);});
        _this._users.reset(data);
      },
      error: function () {/* TODO :: Show modal dialog error message */}
    });
  };

  _onEditClick = function (e) {
    var target = e.target,
        id,
        user;

    if (!target.classList.contains('edituser')) {
      return;
    }

    id = target.getAttribute('data-id');
    user = _this._users.get(id);

    if (user === null) {
      user = User();
    }

    _this._user = user;

    _this._user.on('canceledit', _onUserCancel, _this);
    _this._user.on('save', _onUserSave, _this);

    _this._editview = UserEditView({
      user: user,
      observatories: _options.observatories
    });

    _this._editview.render();

    _this._modalview = ModalView(
          _this._editview._el,
          {
            title: _this._user.get('id') ? 'Edit User' : 'Create User',
            closable: false,
            buttons: [
              {
                classes: ['green'],
                text: _this._user.get('id') ? 'Update' : 'Create',
                callback: function () {
                  __this._editview.updateModel();
                  __this._onUserSave();
                }
              },
              {
                text: 'Cancel',
                callback: _this._onUserCancel
              }
            ]
          }
      );

    _this._modalview.show();
  };

  _onUserCancel = function () {
    _this._modalview.hide();
    _this._user.off('canceledit', _onUserCancel, _this);
    _this._user.off('save', _onUserSave, _this);
    _this._modalview.destroy();
    _this._editview.destroy();
    _this._user = null;
  };

  _onUserSave = function () {
    var rawdata = _this._user.toJSON();

    _options.factory.save({
      data: rawdata,
      success: function () {
        _this._getUsers();
      },
      error: function () {}
    });
    _onUserCancel();
  };


  _this.render = function () {
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = UserAdminView;
