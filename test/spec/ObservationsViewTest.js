/* global define, describe, it, before, after */

define([
	'chai',
	'sinon',
	'geomag/ObservationsView',
	'./observatory1',
	'util/Util',
	'util/Xhr'
], function (
	chai,
	sinon,
	ObservationsView,
	observatory1,
	Util,
	Xhr
) {

	'use strict';

	var expect = chai.expect;
	var DEFAULTS = {
		observatoryId: 1
	};
	var stub;
	var observationsView;

	// var getClickEvent = function () {
	// 	var clickEvent = document.createEvent('MouseEvents');
	// 	clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
	// 	return clickEvent;
	// };

	describe.only('Observations Unit Tests', function () {

		before(function () {
			stub = sinon.stub(Xhr, 'ajax', function (options) {
				options.success(observatory1);
			});

			observationsView = new ObservationsView(DEFAULTS);
		});

		after(function() {
			stub.restore();
		});

		describe('Constructor', function () {

			it('Can be defined', function () {
				/* jshint -W030 */
				expect(observationsView).to.not.be.undefined;
				/* jshint +W030 */
			});

			it('Can be instantiated', function () {
				expect(observationsView).to.be.an.instanceOf(ObservationsView);
			});

		});

		describe('Observations', function () {

			it('can add a new observation button', function () {
				var el = observationsView._el.querySelector('.observations-new'),
				    button = el.querySelector('.button');
				/* jshint -W030 */
				expect(button).to.not.be.undefined;
				/* jshint +W030 */
			});

			it('can get all existing observations', function () {
				var el = observationsView._el.querySelector('.observations-all'),
				    observations = el.querySelectorAll('li');
				expect(observations.length).to.equal(11);
			});

		});
	});

});