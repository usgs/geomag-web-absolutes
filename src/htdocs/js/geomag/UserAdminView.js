/* global define */
define ([
	'mvc/View',
	'util/Util',
	'mvc/Collection',

	'geomag/User',
	'geomag/UsersView'
], function (
	View,
	Util,
	Collection,

	User,
	UsersView
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
		var user = this._users.getSelected();
		if (user !== null) {
			this._nameField.value = user.get('name');
			this._usernameField.value = user.get('username');
			this._observatoryIdField.value = user.get('default_observatory_id');
			this._emailField.value = user.get('email');

			if (user.get('admin') === 'Y') {
				this._isAdminField.checked = 'checked';
			} else {
				this._isAdminField.removeAttribute('checked');
			}

			if (user.get('enabled') === 'Y') {
				this._isEnabledField.checked = 'checked';
			} else {
				this._isEnabledField.removeAttribute('checked');
			}
		} else {
			//clear form.
			//make certain button says create user.
		}
	};

	UserAdminView.prototype._initialize = function () {
		var _this = this;
		this._el.innerHTML = [
				'<section class="user-admin-form">',
					'<input type="hidden" id="user-admin-id" value=""/>',
					'<ul>',
						'<li>',
							'<label class="name" for="user-admin-name">Name</label>',
							'<input type="text" id="user-admin-name"/>',
						'</li>',
						'<li>',
							'<label class="username" for="user-admin-username">',
										'User Name</label>',
							'<input type="text" id="user-admin-username"/>',
						'</li>',
						'<li>',
							'<label class="default-observatory-id" for="default-observatory-id">',
										'Default Observatory ID</label>',
							'<input type="text" id="default-observatory-id"/>',
						'</li>',
						'<li>',
							'<label class="email" for="email">',
										'Email</label>',
							'<input type="text" id="email"/>',
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
								'<input type="checkbox" id="enabled" checked="checked"/>',
								'Enabled',
							'</label>',
						'</li>',
						'<li>',
							'<button class="save green">Create User</button>',
							'<button class="delete red">Delete User</button>',
						'</li>',
					'</ul>',
				'</section>',
				'<section class="users-view-wrapper"></section>'
		].join('');

		//store all input fields on local variables.
		this._userIdField = this._el.querySelector('#user-admin-id');
		this._nameField = this._el.querySelector('#user-admin-name');
		this._usernameField = this._el.querySelector('#user-admin-username');
		this._observatoryIdField =
				this._el.querySelector('#default-observatory-id');
		this._emailField = this._el.querySelector('#email');
		this._passwordField = this._el.querySelector('#password');
		this._confirmField = this._el.querySelector('#confirm-password');
		this._isAdminField = this._el.querySelector('#admin');
		this._isEnabledField = this._el.querySelector('#enabled');

		this._submitButton = this._el.querySelector('.save');

		this.render = this.render.bind(this);
		this._onSubmit = this._onSubmit.bind(this);
		this._submitButton.addEventListener('click', this._onSubmit);

		this._users = new Collection([]);
		this._users.on('select', _this.render);

		this._usersView = new UsersView({
			el: this._el.querySelector('.users-view-wrapper'),
			collection: this._users
		});

		this._options.factory.get({
			success: function (data) {
				data = data.map(function (info) {return new User(info);});
				_this._users.reset(data);
			},
			error: function () {/* TODO :: Show modal dialog error message */}
		});
	};

	UserAdminView.prototype._onSubmit = function () {
		var _this = this,
		    user = this._parseFormData();

		try {
			this._options.factory.save({
				user: user,
				success: function (userInfo) {
					var existingUser = _this._users.get(userInfo.id);
					if (existingUser) {
						existingUser.set(userInfo);
						_this._users.trigger('change');
					} else {
						_this._users.add(new User(userInfo));
					}
				}
			});
		} catch (e) {
			// TODO :: Show modal dialog error message
			throw e;
		}
	};

	UserAdminView.prototype._parseFormData = function () {
		var formData = {
			name: this._nameField.value,
			username: this._usernameField.value,
			default_observatory_id: parseInt(this._observatoryIdField.value, 10),
			email: this._emailField.value
		};

		formData.id = (this._userIdField.value==='') ?
				null : parseInt(this._userIdField.value, 10);

		if (this._isAdminField.checked) {
			formData.admin = 'Y';
		} else {
			formData.admin = 'N';
		}

		if (this._isEnabledField.checked) {
			formData.enabled = 'Y';
		} else {
			formData.enabled = 'N';
		}

		if (this._passwordField.value !== '') {
			if (this._passwordField.value !== this._confirmField.value) {
				throw new Error('Passwords do not match!');
			} else {
				formData.password = this._passwordField.value;
				formData.confirm = this._confirmField.value;
			}
		} else {
			formData.password = '';
			formData.confirm = '';
		}

		return new User(formData);
	};


return UserAdminView;

});


