/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/Xhr'
], function (chai, Xhr) {
	'use strict';
	var expect = chai.expect;

	var TEST_GET_DATA = {
		'method': 'GET',
		'postdata': '',
		'testkey': 'testvalue',
		'testkey2': 'testvalue2'
	};

	var TEST_POST_DATA = {
		'method': 'POST',
		'postdata': 'test%5B%5D=1&test%5B%5D=2&test%5B%5D=3',
		'testkey': 'testvalue',
		'testkey2': 'testvalue2'
	};

	describe('Unit tests for the "Xhr" class', function () {

		describe('ajax', function () {
			it('gets data', function () {
				Xhr.ajax({
					'url': '/spec/mvc/xhr.php',
					'success': function(data) {
						expect(data).to.deep.equal(TEST_GET_DATA);
					}
				});
			});

			it('posts data', function() {
				Xhr.ajax({
					'method': 'POST',
					'url': '/spec/mvc/xhr.php',
					'data': {
						'test[]': ['1', '2', '3']
					},
					'success': function(data) {
						expect(data).to.deep.equal(TEST_POST_DATA);
					}
				});
			});
		});

		describe('jsonp', function () {
			it('gets data', function () {
				Xhr.jsonp({
					'url': '/spec/mvc/xhr.php',
					'success': function(data) {
						expect(data).to.deep.equal(TEST_GET_DATA);
					}
				});
			});
		});

	});

});
