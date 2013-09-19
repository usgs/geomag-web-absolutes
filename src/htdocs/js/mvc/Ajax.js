/*global define*/

/**************************/
/* DEPRECATED, use Xhr.js */
/**************************/

define([
	'mvc/Util'
], function(
	Util
) {
	'use strict';

	var CALLBACK_SEQUENCE = 0;
	var DEFAULT_OPTIONS = {
		'url': null,
		'success': null,
		'error': null,
		'method': 'GET',
		'async': true,
		'headers': null,
		'data': null,
		'rawdata': null,
		'jsonp': false,
		'jsonpCallback': null
	};

	/**
	 * Encode an object as a query string.
	 * @param obj {Object} object to encode
	 * @return encoded object
	 */
	var encodeData = function (obj) {
		var data = [];

		for (var d in obj) {
			var value = obj[d];
			if (value instanceof Array) {
				// Add each value in array seperately
				for (var i=0, len=value.length; i < len; i++) {
					data.push(encodeURIComponent(d) +
							'=' + encodeURIComponent(value[i]));
				}
			} else {
				data.push(encodeURIComponent(d) +
						'=' + encodeURIComponent(obj[d]));
			}
		}
		return data.join('&');
	};

	var getCallbackName = function() {
		return '_ajax_jsonp_' + (++CALLBACK_SEQUENCE);
	};

	/**
	 * Make an AJAX request.
	 *
	 * @param  options {Object} request options.
	 * @param options.url {String} request url.
	 * @param options.success {Function} callback function with
	 *                        parameters (xhr.response, xhr)
	 * @param options.error {Function} callback function with
	 *                      parameters (xhr.status, xhr)
	 * @param options.method {String} request method, default is 'GET'.
	 * @param options.async {Boolean} request asynchronously, default is true.
	 * @param options.headers {Object} request header name as key, value as value.
	 * @param options.data {Object} request data, sent using content type
	 *                     'application/x-www-form-urlencoded'.
	 * @param options.rawdata {?} passed directly to send method,
	 *                        when options.data is null.  Content-type header
	 *                        must also be specified.  Default is null.
	 * @param options.jsonp {Boolean} default false;
	 */
	var Ajax = function(options) {


		// merge passed options with defaults
		options = Util.extend({}, DEFAULT_OPTIONS, options);

		var url = options.url;
		var postdata = options.rawdata;
		if (options.data !== null) {
			var queryString = encodeData(options.data);

			if (options.method === 'GET') {
				// append to url
				url = url + '?' + queryString;
			} else {
				// otherwise send as request body
				postdata = queryString;
				options.headers['Content-type'] = 'application/x-www-form-urlencoded';
			}
		}

		if (options.jsonp) {
			var callback = options.jsonpCallback;
			if(callback === null) {
				callback = getCallbackName();
				window[callback] = function (data) {
					options.success(data);
					delete window[callback];
					scr.parentNode.removeChild(scr);
				};
			}
			var scr = document.createElement('script');
			scr.src = url + '&callback=' + callback;
			if(options.async) {
				scr.async = true;
			}
			document.getElementsByTagName('script')[0].parentNode.appendChild(scr);
			return;
		}

		var xhr = new XMLHttpRequest();
		// setup callback
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					if (options.success !== null) {
						options.success(xhr.response, xhr);
					}
				} else {
					if (options.error !== null) {
						options.error(xhr.status, xhr);
					}
				}
			}
		};

		// open request
		xhr.open(options.method, url, options.async);

		// send headers
		if (options.headers !== null) {
			for (var h in options.headers) {
				xhr.setRequestHeader(h, options.headers[h]);
			}
		}

		// send data
		xhr.send(postdata);
	};

	return Ajax;
});
