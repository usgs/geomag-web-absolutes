// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable
			throw new TypeError("object to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    fNOP = function () {},
		    fBound;

		fBound = function () {
			return fToBind.apply(
					(this instanceof fNOP && oThis ? this : oThis),
					aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}


require.config({
	baseUrl: '..',
	paths: {
		mocha: 'mocha/mocha',
		chai: 'chai/chai',
		sinon: 'sinon/pkg/sinon',
		mvc: '/hazdev-webutils/src/mvc',
		util: '/hazdev-webutils/src/util',
		tablist: '/hazdev-tablist/src/tablist'
	},
	shim: {
		mocha: {
			exports: 'mocha'
		},
		chai: {
			deps: ['mocha'],
			exports: 'chai'
		},
		sinon: {
			exports: 'sinon'
		}
	}
});

require([
	'mocha',
], function (mocha) {
	'use strict';

	mocha.setup('bdd');

	require([
		'spec/ObservatoryTest',
		'spec/MarkTest',
		'spec/MeasurementTest',
		'spec/PierTest',
		'spec/BaselineCalculatorTest',
		'spec/InstrumentTest',
		'spec/ObservationTest',
		'spec/UserTest',
		'spec/UserRoleTest',
		'spec/ReadingTest',
		'spec/MeasurementViewTest',
		'spec/ReadingGroupViewTest',
		'spec/DeclinationViewTest',
		'spec/InclinationViewTest',
		'spec/ReadingViewTest',
		'spec/RealtimeDataTest',
		'spec/RealtimeDataFactoryTest',
		'spec/observation_data_Test',
		'spec/ObservationBaselineCalculatorTest',
		'spec/ObservationMetaViewTest',
		'spec/mvcutil/CollectionSelectBoxTest',
		'spec/ObservatoryViewTest',
		'spec/ObservationsViewTest'
		'spec/FormatterTest'
	], function () {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
