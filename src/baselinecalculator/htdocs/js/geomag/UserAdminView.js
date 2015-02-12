/* global define */
define ([
  'mvc/View',
  'util/Util',
  'mvc/Collection',
  'mvc/ModalView',

  'geomag/User',
  'geomag/UsersView',
  'geomag/UserEditView'
], function (
  View,
  Util,
  Collection,
  ModalView,

  User,
  UsersView,
  UserEditView
) {
  'use strict';

  var DEFAULTS = {
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
    this._options = Util.extend({}, DEFAULTS, options);
    View.call(this, this._options);
  };

  UserAdminView.prototype = Object.create(View.prototype);

  UserAdminView.prototype.render = function () {
  };

  UserAdminView.prototype._initialize = function () {
    this._el.innerHTML = [
        '<section class="user-admin-control">',
          '<button class="edituser" data-id="">Create User</button>',
        '<section>',
        '<section class="users-view-wrapper"></section>'
    ].join('');

    this._users = new Collection([]);
    this._user = null;

    this._usersView = new UsersView({
      el: this._el.querySelector('.users-view-wrapper'),
      collection: this._users
    });

    this._onEditClick = this._onEditClick.bind(this);
    this._onUserSave = this._onUserSave.bind(this);
    this._onUserCancel = this._onUserCancel.bind(this);

    this._el.addEventListener('click', this._onEditClick);

    this._getUsers();
  };

  UserAdminView.prototype._getUsers = function () {
    var _this = this;
    this._options.factory.get({
      success: function (data) {
        data = data.map(function (info) {return new User(info);});
        _this._users.reset(data);
      },
      error: function () {/* TODO :: Show modal dialog error message */}
    });
  };

  UserAdminView.prototype._onUserSave = function () {
    var rawdata = this._user.toJSON(),
        _this = this;

    this._options.factory.save({
      data: rawdata,
      success: function () {
        _this._getUsers();
      },
      error: function () {}
    });
    this._onUserCancel();
  };

  UserAdminView.prototype._onUserCancel = function () {
    this._modalview.hide();
    this._user.off('canceledit', this._onUserCancel, this);
    this._user.off('save', this._onUserSave, this);
    this._modalview.destroy();
    this._editview.destroy();
    this._user = null;
  };

  UserAdminView.prototype._onEditClick = function (e) {
    var _this = this,
        target = e.target,
        id,
        user;

    if (!target.classList.contains('edituser')) {
      return;
    }

    id = target.getAttribute('data-id');
    user = this._users.get(id);

    if (user === null) {
      user = new User();
    }

    this._user = user;

    this._user.on('canceledit', this._onUserCancel, this);
    this._user.on('save', this._onUserSave, this);

    this._editview = new UserEditView({
      user: user,
      observatories: this._options.observatories
    });

    this._editview.render();

    this._modalview = new ModalView(
          this._editview._el,
          {
            title: this._user.get('id') ? 'Edit User' : 'Create User',
            closable: false,
            buttons: [
              {
                classes: ['green'],
                text: this._user.get('id') ? 'Update' : 'Create',
                callback: function () {
                  _this._editview.updateModel();
                  _this._onUserSave();
                }
              },
              {
                text: 'Cancel',
                callback: this._onUserCancel
              }
            ]
          }
      );

    this._modalview.show();
  };

return UserAdminView;

});
