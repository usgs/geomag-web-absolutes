/*global define*/
/*global window*/
define([
	'mvc/Util'
], function (
	Util
) {
	'use strict';


	// defaults for jsonp method
	var DEFAULT_JSONP_OPTIONS = {
		'url': null,
		'success': null,
		'error': null,
		'data': null,
		'callbackName': null,
		'callbackParameter': 'callback'
	};

	// defaults for ajax method
	var DEFAULT_AJAX_OPTIONS = {
		'url': null,
		'success': null,
		'error': null,
		'method': 'GET',
		'headers': null,
		'data': null,
		'rawdata': null
	};


	var Xhr = {

		/**
		 * Make a JSONP request.
		 *
		 * @param options.url {String} url to load
		 * @param options.success {Function} called with data loaded by script.
		 * @param options.error {Function} optional, called when script fails to load.
		 * @param options.data {Object} optional, request parameters to add to url.
		 * @param options.callbackName {String} optional
		 * @param options.callbackParameter {String} default is 'callback'
		 */
		jsonp: function (options) {
			options = Util.extend({}, DEFAULT_JSONP_OPTIONS, options);

			var url = options.url,
			    data = Util.extend({}, options.data),
			    callback = options.callbackName || this.getCallbackName();

			data[options.callbackParameter] = callback;
			url += (url.indexOf('?') === -1 ? '?' : '&') + this.urlEncode(data);

			var script = document.createElement('script');
			script.src = url;
			script.async = true;

			// setup global callback called by script
			window[callback] = function () {
				options.success.apply(null, arguments);
			};

			// called after successful load, or by error handler
			var onLoad = function () {
				// remove event handlers
				Util.removeEvent(script, 'load', onLoad);
				Util.removeEvent(script, 'error', onError);
				onLoad = null;
				onError = null;
				// remove script element
				script.parentNode.removeChild(script);
				script = null;
				// remove global callback
				window[callback] = null;
				delete window[callback];
			};

			// called after error loading script
			var onError = function () {
				onLoad();
				// call error callback
				if (options.error !== null) {
					options.error.apply(null, arguments);
				}
			};

			// attach script event handlers
			Util.addEvent(script, 'load', onLoad);
			Util.addEvent(script, 'error', onError);

			// add script to start request
			document.getElementsByTagName('script')[0].parentNode.appendChild(script);
		},

		/**
		 * Make an AJAX request.
		 *
		 * @param options.url {String} the url to request.
		 * @param options.success {Function} called with data loaded by script.
		 * @param options.error {Function} optional, called when script fails to load.
		 * @param options.method {String} request method, default is 'GET'.
		 * @param options.headers {Object} request header name as key, value as value.
		 * @param options.data {Object} request data, sent using content type
		 *                     'application/x-www-form-urlencoded'.
		 * @param options.rawdata {?} passed directly to send method,
		 *                        when options.data is null.  Content-type header
		 *                        must also be specified.  Default is null.
		 */
		ajax: function (options) {
			options = Util.extend({}, DEFAULT_AJAX_OPTIONS, options);

			var url = options.url;
			var postdata = options.rawdata;
			if (options.data !== null) {
				var queryString = this.urlEncode(options.data);
				if (options.method === 'GET') {
					// append to url
					url = url + '?' + queryString;
				} else {
					// otherwise send as request body
					postdata = queryString;
					if (options.headers === null) {
						options.headers = {};
					}
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}
			}

			var xhr = new XMLHttpRequest();

			// setup callback
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						if (options.success !== null) {
							var data = xhr.response,
							    contentType = xhr.getResponseHeader('Content-Type');
							if (contentType.indexOf('json') !== -1) {
								data = JSON.parse(data);
							}
							options.success(data, xhr);
						}
					} else {
						if (options.error !== null) {
							options.error(xhr.status, xhr);
						}
					}
				}
			};

			// open request
			xhr.open(options.method, url, true);

			// send headers
			if (options.headers !== null) {
				for (var h in options.headers) {
					xhr.setRequestHeader(h, options.headers[h]);
				}
			}

			// send data
			xhr.send(postdata);
		},

		/**
		 * URL encode an object.
		 *
		 * @param obj {Object} object to encode.
		 * @return {String} url encoded object.
		 */
		urlEncode: function (obj) {
			var data = [];
			for (var key in obj) {
				var encodedKey = encodeURIComponent(key),
				    value = obj[key];

				if (value instanceof Array) {
					// Add each value in array seperately
					for (var i = 0, len = value.length; i < len; i++) {
						data.push(encodedKey + '=' + encodeURIComponent(value[i]));
					}
				} else {
					data.push(encodedKey + '=' + encodeURIComponent(value));
				}
			}
			return data.join('&');
		},

		/**
		 * Generate a unique callback name.
		 *
		 * @return a unique callback name.
		 */
		getCallbackName: function () {
			return '_xhr_callback_' + new Date().getTime();
		}

	};

	// return object
	return Xhr;
});
