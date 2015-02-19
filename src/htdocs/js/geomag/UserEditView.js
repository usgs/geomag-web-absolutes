'use strict';

var CollectionSelectBox = require('mvcutil/CollectionSelectBox'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
};


/**
 * Construct a new UserEditView.
 *
 * @param options {Object}
 *        view options.
 * @param options.observatories
 * @param options.user
 */
var UserEditView = function (options) {
  var _this,
      _initialize,

      _options;

  _this = View(options);

  _initialize = function (options) {
    _options = Util.extend({}, _DEFAULTS, options);

    _this.el.innerHTML = [
      '<ul>',
        '<li>',
          '<label class="name" for="useredit-name">Name</label>',
          '<input type="text" id="useredit-name" placeholder="John Doe"/>',
        '</li>',
        '<li>',
          '<label class="username" for="useredit-username">',
                'User Name</label>',
          '<input type="text" id="useredit-username" placeholder="jdoe"/>',
        '</li>',
        '<li>',
          '<label class="default-observatory-id" for="default-observatory-id">',
                'Default Observatory</label>',
          '<select id="default-observatory-id"></select>',
        '</li>',
        '<li>',
          '<label class="email" for="email">',
                'Email</label>',
          '<input type="text" id="email" placeholder="jdoe@usgs.gov"/>',
        '</li>',
        '<li>',
          '<label class="password" for="password">',
                'Password</label>',
          '<input type="password" id="password"/>',
        '</li>',
        '<li>',
          '<label class="confirm-password" for="confirm-password">',
                'Confirm Password</label>',
          '<input type="password" id="confirm-password"/>',
        '</li>',
        '<li>',
          '<label class="admin">',
            '<input type="checkbox" id="admin"/>',
            'Admin',
          '</label>',
        '</li>',
        '<li>',
          '<label class="enabled">',
            '<input type="checkbox" id="enabled"/>',
            'Enabled',
          '</label>',
        '</li>',
      '</ul>'
    ].join('');

    _this._name = _this.el.querySelector('#useredit-name');
    _this._username = _this.el.querySelector('#useredit-username');
    _this._observatories = CollectionSelectBox({
        el: _this.el.querySelector('#default-observatory-id'),
        allowDeselect: true,
        collection: _options.observatories
      });
    _this._email = _this.el.querySelector('#email');
    _this._password = _this.el.querySelector('#password');
    _this._confirmpassword = _this.el.querySelector('#confirm-password');
    _this._admin = _this.el.querySelector('#admin');
    _this._enabled = _this.el.querySelector('#enabled');
  };

  _this.updateModel = function () {
    var values = {},
        observatory;

    values.name = _this._name.value;
    values.username = _this._username.value;
    observatory = _options.observatories.getSelected();
    values.default_observatory_id = observatory === null ?
        null : observatory.id;
    values.email = _this._email.value;
    values.admin = _this._admin.checked ? 'Y' : 'N';
    values.enabled = _this._enabled.checked ? 'Y' : 'N';
    if (_this._password.value === _this._confirmpassword.value &&
        _this._password.value !== '') {
      values.password = _this._password.value;
    }

    _options.user.set(values);
  };


  _this.render = function () {
    var user = _options.user;

    _this._name.value = user.get('name');
    _this._username.value = user.get('username');
    _this._observatories.selectById(user.get('default_observatory_id'));
    _this._email.value = user.get('email');
    _this._password.value = '';
    _this._confirmpassword.value = '';
    if (user.get('admin') === 'Y') {
      _this._admin.checked = 'checked';
    } else {
      _this._admin.removeAttribute('checked');
    }

    if (user.get('enabled') === 'Y') {
      _this._enabled.checked = 'checked';
    } else {
      _this._enabled.removeAttribute('checked');
    }
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = UserEditView;
