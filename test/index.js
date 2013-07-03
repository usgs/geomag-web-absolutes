require.config({
	baseUrl: '..',
	paths: {
		mocha: 'mocha/mocha',
		chai: 'chai/chai'
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
		'spec/GreeterTest',
		'spec/EventsTest',
		'spec/ModelTest',
		'spec/ObservatoryTest',
		'spec/CollectionTest',
		'spec/MarkTest',
		'spec/MeasurementTest',
		'spec/PierTest',
		'spec/BaselineCalculatorTest',
		'spec/InstrumentTest'
	], function () {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
