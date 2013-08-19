/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'mvc/View'
], function (chai, View) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "View" class', function () {

		describe('constructor', function () {
			it('creates a new element when one is not specified', function () {
				var v = new View();
				expect(v.el.nodeName).to.equal('DIV');
			});

			it('uses a configured element when specified', function () {
				var el = document.createElement('span'),
				    v = new View({el: el});
				expect(v.el).to.equal(el);
			});
		});

	});

});
