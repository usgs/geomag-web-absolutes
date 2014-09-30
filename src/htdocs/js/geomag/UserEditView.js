/* global define */
define ([
	'mvc/View',
	'util/Util',
	'mvcutil/CollectionSelectBox'
], function (
	View,
	Util,
	CollectionSelectBox
) {
	'use strict';

	var DEFAULTS = {
	};

	var UserEditView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, this._options);
	};

	UserEditView.prototype = Object.create(View.prototype);

	UserEditView.prototype.render = function () {
		var user = this._options.user;

		this._name.value = user.get('name');
		this._username.value = user.get('username');
		this._observatories.selectById(user.get('default_observatory_id'));
		this._email.value = user.get('email');
		this._password.value = '';
		this._confirmpassword.value = '';
		if (user.get('admin') === 'Y') {
			this._admin.checked = 'checked';
		} else {
			this._admin.removeAttribute('checked');
		}

		if (user.get('enabled') === 'Y') {
			this._enabled.checked = 'checked';
		} else {
			this._enabled.removeAttribute('checked');
		}

	};

	UserEditView.prototype._initialize = function () {
		this._el.innerHTML = [
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

		this._name = this._el.querySelector('#useredit-name');
		this._username = this._el.querySelector('#useredit-username');
		this._observatories = new CollectionSelectBox({
				el: this._el.querySelector('#default-observatory-id'),
				allowDeselect: true,
				collection: this._options.observatories
			});
		this._email = this._el.querySelector('#email');
		this._password = this._el.querySelector('#password');
		this._confirmpassword = this._el.querySelector('#confirm-password');
		this._admin = this._el.querySelector('#admin');
		this._enabled = this._el.querySelector('#enabled');
	};

	UserEditView.prototype.updateModel = function () {
		var values = {},
		    observatory;

		values.name = this._name.value;
		values.username = this._username.value;
		observatory = this._options.observatories.getSelected();
		values.default_observatory_id = observatory === null ?
				null : observatory.id;
		values.email = this._email.value;
		values.admin = this._admin.checked ? 'Y' : 'N';
		values.enabled = this._enabled.checked ? 'Y' : 'N';
		if (this._password.value === this._confirmpassword.value &&
				this._password.value !== '') {
			values.password = this._password.value;
		}

		this._options.user.set(values);
	};


	return UserEditView;
});
