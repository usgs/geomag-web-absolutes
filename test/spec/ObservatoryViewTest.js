/* global define, describe, it, before, after */

define([
	'chai',
	'sinon',
	'geomag/ObservatoryView',
	'./observatories',
	'util/Xhr'
], function (
	chai,
	sinon,
	ObservatoryView,
	observatories,
	Xhr
) {

	'use strict';
	var expect = chai.expect;
	var stub, ignore;
	var DEFAULTS = {
		observatoryId: null
	};
	var observatoryView;

	var getClickEvent = function () {
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
		return clickEvent;
	};

	describe('ObservatoryView Unit Tests', function () {

		before(function () {
			stub = sinon.stub(Xhr, 'ajax', function (options) {
				options.success(observatories);
			});

			ignore = sinon.stub(ObservatoryView.prototype, '_getObservations',
					function () {
				// Do nothing.
			});

			observatoryView = new ObservatoryView(DEFAULTS);
		});

		after(function() {
			window.location.hash = '';
			stub.restore();
			ignore.restore();
		});

		describe('Constructor', function () {

			it('Can be defined', function () {
				/* jshint -W030 */
				expect(ObservatoryView).to.not.be.undefined;
				/* jshint +W030 */
			});

			it('Can be instantiated', function () {
				expect(observatoryView).to.be.an.instanceOf(ObservatoryView);
			});
		});


		describe('Observatory details', function () {

			it('can get all observatories', function () {
				var all = observatoryView._el.querySelector('.observatories');
				    observatories = all.querySelectorAll('li');
				expect(observatories.length).to.equal(15);
			});

			it('can select an observatory by default', function () {
				var all = observatoryView._el.querySelector('.observatories'),
				    selected = all.querySelector('.selected');
				expect(selected.id).to.equal('observatory_2');
			});

		});


		describe('Event bindings', function () {

			it('can select a default observatory', function () {
				var element = observatoryView._el.querySelector('#observatory_2');
				expect(element.className).to.equal('selected');
			});

			it('can generate a hash change onClick', function () {
				var element = observatoryView._el.querySelector('#observatory_1 > a'),
				    hashBefore = window.location.hash,
				    hashAfter = hashBefore;

				element.dispatchEvent(getClickEvent());

				hashAfter = window.location.hash;

				expect(hashBefore).to.not.equal(hashAfter);
				expect(hashAfter).to.equal('#1');
			});

		});

	});
});
