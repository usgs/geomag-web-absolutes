require.config({
	baseUrl: '..',
	paths: {
		mocha: 'mocha/mocha',
		chai: 'chai/chai',
		mvc: '/hazdev-webutils/src/mvc',
		util: '/hazdev-webutils/src/util'
	},
	shim: {
		mocha: {
			exports: 'mocha'
		},
		chai: {
			deps: ['mocha'],
			exports: 'chai'
		}
	}
});

require([
	'mocha'
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
		'spec/DeclinationViewTest',
		'spec/RealtimeDataFactoryTest',
		'spec/ObservationBaselineCalculatorTest'
	], function () {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
