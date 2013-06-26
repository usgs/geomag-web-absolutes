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
	'mocha',
], function (mocha) {
	mocha.setup('bdd');

	require([
		'spec/GreeterTest',
		'spec/EventsTest',
		'spec/ModelTest',
		'spec/ObservatoryTest',
		'spec/CollectionTest',
		'spec/MarkTest',
		'spec/MeasurementTest'
	], function () {
		if (window.mochaPhantomJS) {
			mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
