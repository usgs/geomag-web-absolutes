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

      _admin,
      _confirmpassword,
      _email,
      _enabled,
      _name,
      _observatories,
      _options,
      _password,
      _user,
      _username;


  _this = View(options);

  _initialize = function (options) {
    var el = _this.el;

    _options = Util.extend({}, _DEFAULTS, options);
    _user = _options.user;

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

    _name = el.querySelector('#useredit-name');
    _username = el.querySelector('#useredit-username');
    _observatories = CollectionSelectBox({
        el: el.querySelector('#default-observatory-id'),
        allowDeselect: true,
        collection: _options.observatories
      });
    _email = el.querySelector('#email');
    _password = el.querySelector('#password');
    _confirmpassword = el.querySelector('#confirm-password');
    _admin = el.querySelector('#admin');
    _enabled = el.querySelector('#enabled');
  };

  _this.render = function () {
    _name.value = _user.get('name');
    _username.value = _user.get('username');
    _observatories.selectById(_user.get('default_observatory_id'));
    _email.value = _user.get('email');
    _password.value = '';
    _confirmpassword.value = '';
    if (_user.get('admin') === 'Y') {
      _admin.checked = 'checked';
    } else {
      _admin.removeAttribute('checked');
    }

    if (_user.get('enabled') === 'Y') {
      _enabled.checked = 'checked';
    } else {
      _enabled.removeAttribute('checked');
    }
  };

  _this.updateModel = function () {
    var values = {},
        observatory;

    values.name = _name.value;
    values.username = _username.value;
    observatory = _options.observatories.getSelected();
    values.default_observatory_id = observatory === null ?
        null : observatory.id;
    values.email = _email.value;
    values.admin = _admin.checked ? 'Y' : 'N';
    values.enabled = _enabled.checked ? 'Y' : 'N';
    if (_password.value === _confirmpassword.value && _password.value !== '') {
      values.password = _password.value;
    }

    _options.user.set(values);
  };

  _this.destroy = Util.compose(
    // sub class destroy method
    function () {
      // Clean up private variables
      _admin = null;
      _confirmpassword = null;
      _email = null;
      _enabled = null;
      _name = null;
      _observatories = null;
      _options = null;
      _password = null;
      _user = null;
      _username = null;
    },
    // parent class destroy method
    _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};

module.exports = UserEditView;
