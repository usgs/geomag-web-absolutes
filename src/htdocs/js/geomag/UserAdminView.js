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
			this._namefield.value = user.get('name');
			this._username.value = user.get('username');
			this._default_observatory_id.value = user.get('default_observatory_id');
			this._email.value = user.get('email');
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
			//render user information in form.
			//make certain button says update user.
		} else {
			//clear form.
			//make certain button says create user.
		}
	};

	UserAdminView.prototype._initialize = function () {
		var _this = this;
		this._el.innerHTML = [
				'<section class="user-admin-form">',
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
							'<input type="text" id="password"/>',
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
				'</section>',
				'<section class="users-view-wrapper"></section>'
		].join('');

		//store all input fields on local variables.
		this._namefield = this._el.querySelector('#user-admin-name');
		this._username = this._el.querySelector('#user-admin-username');
		this._default_observatory_id =
				this._el.querySelector('#default-observatory-id');
		this._email = this._el.querySelector('#email');
		this._password = this._el.querySelector('#password');
		this._confirmpassword = this._el.querySelector('#confirm-password');
		this._admin = this._el.querySelector('#admin');
		this._enabled = this._el.querySelector('#enabled');

		this.render = this.render.bind(this);

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
			error: function () {}
		});
	};



return UserAdminView;

});


