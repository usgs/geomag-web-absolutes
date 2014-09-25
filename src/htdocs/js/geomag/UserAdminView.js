/* global define */
define ([
	'mvc/View',
	'util/Util',

	'geomag/UserView'
], function (
	View,
	Util,

	UserView
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
		View.call(this. this._options);
	};

	UserAdminView.prototype = Object.create(View.prototype);

	UserAdminView.prototype.render = function () {
		//set check
		//fill in values
	};

	UserAdminView.prototype._initialize = function () {
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
							'<label class="default_observatory_id" for="default_observatory_id">',
										'Default Observatory ID</label>',
							'<input type="text" id="default_observatory_id"/>',
						'</li>',
						'<li>',
							'<label class="email" for="email">',
										'email</label>',
							'<input type="text" id="email"/>',
						'</li>',
						'<li>',
							'<label class="password" for="password">',
										'password</label>',
							'<input type="text" id="password"/>',
						'</li>',
						'<li>',
							'<label class="password" for="password">',
										'password</label>',
							'<input type="passowrd" id="password"/>',
						'</li>',
						'<li>',
							'<label class="confirm password" for="confirm password">',
										'confirm password</label>',
							'<input type="passowrd" id="password"/>',
						'</li>',
						'<li>',
							'<label class="admin">',
								'<input type="checkbox" id="admin"/>',
								'Admin',
							'</label>',
						'</li>',
						'<li>',
							'<label class="enabled">',
								'<input type="enabled" id="enabled"/>',
								'Enabled',
							'</label>',
						'</li>',
				'</section>',
				'<section class="UsersView"></section>'
		].join('');

		this.render();
	};



return UserAdminView;

});




// UsersView
// 	onSelect, populate form for Usersview
// Form to CRUD user.
// 	all fields from DB table
// 		id field is hidden
