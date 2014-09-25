/*global define*/
define([
	'util/Util',
	'util/Xhr'
], function(
	Util,
	Xhr
){

	'use strict';

	var DEFAULTS = {
		url: 'user_data.php'
	};

		/**
	 * Construct a new UserFactory.
	 *
	 * @param options.url {String}
	 *        url for userfactory.
	 *        default 'user_data.php'.
	 */
	var UserFactory = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};

	/**
	 * Get a list of observatories
	 *
	 */
	UserFactory.prototype.get = function(options) {
		Xhr.ajax({
			url: this._options.url,
			data: options.data || {},
			success: options.success || function () {},
			error: options.error || function () {}
		});
	};

	UserFactory.prototype.save = function(options) {
		var user = options.user.get(),
		    data = JSON.stringify(user);

		Xhr.ajax({
			url: this._options.url,
			rawdata: data,
			method: (user.id) ? 'PUT' : 'POST',
			success: options.success || function () {},
			error: options.error || function () {}
		});
	};

	UserFactory.prototype.destroy = function(options) {
		Xhr.ajax({
			url: this._options.url,
			data: {id: options.id},
			method: 'DELETE',
			success: options.success || function () {},
			error: options.error || function () {}
		});
	};

	return UserFactory;
});
