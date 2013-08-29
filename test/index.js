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
		'spec/mvc/EventsTest',
		'spec/mvc/ModelTest',
		'spec/mvc/ViewTest',
		'spec/mvc/CollectionTest',
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
		'spec/TimeSeriesTest',
		'spec/DeclinationViewTest'
	], function () {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
