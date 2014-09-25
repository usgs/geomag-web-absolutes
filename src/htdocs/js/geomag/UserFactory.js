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
			success: function (data) {
				if(options.success) {
					options.success(data);
				}
			},
			error: options.error || function () {}
		});
	};

	UserFactory.prototype.create = function(options) {
		options.success();
	};

	UserFactory.prototype.update = function(options) {
		options.success();
	};

	UserFactory.prototype.destroy = function(options) {
		options.success();
	};

return UserFactory;
});


// update()  [put]
// create()  [post]
// get()     (GET)
// destroy() (DELETE)
