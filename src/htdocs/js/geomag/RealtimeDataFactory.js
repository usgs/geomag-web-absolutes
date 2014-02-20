/*global define*/

define([
	'mvc/Model',
	'util/Util',
	'util/Xhr',

	'geomag/RealtimeData'
], function (
	Model,
	Util,
	Xhr,

	RealtimeData
) {
	'use strict';


	var DEFAULT_URL = '/map/observatories_data.json.php';

	/** Define default attributes. */
	var DEFAULTS = {
		'url': DEFAULT_URL,
		'starttime': null,
		'endtime': null,
		'channels': ['H','E','Z','F'],
		'freq': 'seconds'
	};


	/**
	 * Constructor.
	 *
	 * @param options {Object} observatory attributes.
	 * @param options.url {string}
	 * @param options.channels {Array<string>}
	 * @param options.observatory {Array{string}}
	 * @param options.freq {string{seconds|minutes}}
	 * @param options.success {callback()}
	 */
	var RealtimeDataFactory = function (options) {
		// Call parent constructor
		Model.call(this, Util.extend({}, DEFAULTS, options));

		// TODO: this is a hack to deal with
		// https://github.com/usgs/hazdev-webutils/issues/8
		this._lastcall = null;
	};

	// RealtimeDataFactory extends Model
	RealtimeDataFactory.prototype = Object.create(Model.prototype);


	/**
	 * @param options {Object} observatory attributes.
	 *        options.???  Same as constructor.
	 */
	RealtimeDataFactory.prototype.getRealtimeData = function (options) {
		options = Util.extend({}, this.get(), options);

		// TODO: this is a hack to deal with
		// https://github.com/usgs/hazdev-webutils/issues/8
		if (this._lastcall !== null) {
			while (this._lastcall === new Date().getTime()) {
				// wait until its not
			}
		}
		this._lastcall = new Date().getTime();

		Xhr.jsonp({
			url: options.url,
			data: {
				'starttime': options.starttime,
				'endtime': options.endtime,
				'obs[]': options.observatory,
				'chan[]': options.channels,
				'freq': options.freq
			},
			success: function (data) {
				options.success(new RealtimeData(data));
			}
		});
	};


	// return constructor from closure
	return RealtimeDataFactory;
});


