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


var UserAdminView = function (options) {
  var _this,
      _initialize,

      _editview,
      _factory,
      _modalview,
      _observatories,
      _user,
      _users,
      _usersView,

      _getUsers,
      _onEditClick,
      _onUserCancel,
      _onUserSave;

  _this = View(Util.extend({}, _DEFAULTS, options));

  _initialize = function (options) {
    _factory = options.factory;
    _observatories = options.observatories;

    _this.el.innerHTML = [
        '<section class="user-admin-control">',
          '<button class="edituser" data-id="">Create User</button>',
        '<section>',
        '<section class="users-view-wrapper"></section>'
    ].join('');

    _users = new Collection([]);
    _user = null;

    _usersView = UsersView({
      el: _this.el.querySelector('.users-view-wrapper'),
      collection: _users
    });

    _this.el.addEventListener('click', _onEditClick);

    _getUsers();
  };

  _getUsers = function () {
    _factory.get({
      success: function (data) {
        data = data.map(function (info) {return User(info);});
        _users.reset(data);
      },
      error: function () {/* TODO :: Show modal dialog error message */}
    });
  };

  _onUserSave = function () {
    var rawdata = _user.toJSON();

    _factory.save({
      data: rawdata,
      success: function () {
        _getUsers();
      },
      error: function () {}
    });
    _onUserCancel();
  };

  _onUserCancel = function () {
    _modalview.hide();
    _user.off('canceledit', _onUserCancel, _this);
    _user.off('save', _onUserSave, _this);
    _modalview.destroy();
    _editview.destroy();
    _user = null;
  };

  _onEditClick = function (e) {
    var target = e.target,
        id,
        user;

    if (!target.classList.contains('edituser')) {
      return;
    }

    id = target.getAttribute('data-id');
    user = _users.get(id);

    if (user === null) {
      user = User();
    }

    _user = user;

    _user.on('canceledit', _onUserCancel, _this);
    _user.on('save', _onUserSave, _this);

    _editview = UserEditView({
      user: user,
      observatories: _observatories
    });

    _editview.render();

    _modalview = ModalView(
      _editview.el,
      {
        title: _user.get('id') ? 'Edit User' : 'Create User',
        closable: false,
        buttons: [
          {
            classes: ['green'],
            text: _user.get('id') ? 'Update' : 'Create',
            callback: function () {
              _editview.updateModel();
              _onUserSave();
            }
          },
          {
            text: 'Cancel',
            callback: _onUserCancel
          }
        ]
      }
    );

    _modalview.show();
  };


  _this.render = function () {
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = UserAdminView;
