/* global define */
define([
	'geomag/Formatter',

	'mvc/CollectionTable',
	'util/Util'
], function (
	Formatter,

	CollectionTable,
	Util
) {
	'use strict';

	var DEFAULTS = {
		className: 'collection-table users-view tabular',
		clickToSelect: false,
		columns: [
			{
				className: 'name',
				title: 'Name',
				format: function (user) {
					return user.get('name');
				}
			},
			{
				className: 'username',
				title: 'Username',
				format: function (user) {
					return user.get('username');
				}
			},
			{
				className: 'email',
				title: 'Email',
				format: function (user) {
					return user.get('email');
				}
			},
			{
				className: 'last_login',
				title: 'Last Login',
				format: function (user) {
					return Formatter.date(parseInt(user.get('last_login'), 10));
				}
			},
			{
				className: 'admin',
				title: 'Is Admin?',
				format: function (user) {
					return user.get('admin');
				}
			},
			{
				className: 'enabled',
				title: 'Account Enabled?',
				format: function (user) {
					return user.get('enabled');
				}
			},
			{
				className: 'edit',
				title: 'Edit?',
				format: function (user) {
					return '<button class="edituser" data-id="' + user.get('id') + '">Edit</button>';
				}
			}
		],
		emptyMarkup: '&ndash;'
	};

	var UsersView = function (options) {
		options = Util.extend({}, DEFAULTS, options || {});
		CollectionTable.call(this, options);
	};
	UsersView.prototype = Object.create(CollectionTable.prototype);


	return UsersView;
});
