/* global define, describe, it */
/*jshint unused:vars*/

define([
	'chai',
	'geomag/RealtimeDataFactory',
	'mvc/Model',
	'geomag/Reading',
	'geomag/Measurement',
	'mvc/Collection',
	'geomag/Observation'
], function (chai,
			 RealtimeDataFactory,
			 Model,
			 Reading,
			 Measurement,
			 Collection,
			 Observation
			 ) {
	'use strict';
	var expect = chai.expect;

	var meas1 = new Measurement({'id': 11,'type': Measurement.SOUTH_UP,
			'time': 1377011990 });
	var meas2 = new Measurement({'id': 12,'type': Measurement.NORTH_DOWN,
			'time': 1377012000 });
	var meas3 = new Measurement({'id': 11,'type': Measurement.SOUTH_UP,
			'time': 1377012200 });
	var meas4 = new Measurement({'id': 13,'type': Measurement.NORTH_DOWN,
			'time': 1377012320 });
	var meas5 = new Measurement({'id': 14,'type': Measurement.NORTH_DOWN,
			'time': 1377012380 });
	var meas6 = new Measurement({'id': 15,'type': Measurement.NORTH_DOWN,
			'time': 1377012420 });

	var meas1a = new Measurement({'id': 11,'type': Measurement.SOUTH_UP,
			'time': 1377011990, 'h': 20881.2, 'e': 36.545, 'z':47623.3, 'f': 52530.7});
	var meas2a = new Measurement({'id': 12,'type': Measurement.NORTH_DOWN,
			'time': 1377012000, 'h': null, 'e': null, 'z':null, 'f': null });


	var READINGTESTOBJECT = {
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([meas1, meas2])
	};

	var READINGTESTDATA = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([meas1a, meas2a])

	});

	var reading1 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([meas1, meas2 ])
	});
	var reading2 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([meas3, meas4 ])
	});
	var reading3 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([meas5, meas6 ])
	});

	var OBSERVATIONTESTOBJECT = {
		'id': null,
		'begin': null,
		'end': null,
		'readings': new Collection( [reading1, reading2, reading3])
	};

	var TESTOBJECT = {
		'starttime': 1377011990,
		'endtime': 1377012000,
		'observatory': ['BOU'],
		'callback': 'success'
	};


	var TESTDATA = {
		'request':{
		'starttime':1377011990,
		'endtime':1377012000
		},
		'times':[
		1377011990,1377011991,1377011992,1377011993,1377011994,1377011995,1377011996,1377011997,1377011998,1377011999
		],
		'data':[
		{
			'id':'BOU',
			'nominals':{
			'H':20870,
			'E':55.91,
			'Z':47800,
			'F':52799},
		'values':{
			'H':[20881.2,20881.1,20881.1,20881.1,20881.1,20881.1,20881.1,20881.1,20881,20881],
			'E':[36.545,36.579,36.581,36.607,36.625,36.625,36.639,36.643,36.653,36.651],
			'Z':[47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3],
			'F':[52530.7,52530.7,52530.7,52530.6,52530.6,52530.6,52530.6,52530.6,52530.6,52530.6]}
		}]
	};


	describe('Unit tests for the "RealtimeDataFactory" class', function () {

		describe('constructor()', function () {
			it('calls RealtimeDataFactory constructor', function () {
				var realtimeDataFactory = new RealtimeDataFactory();
				expect( realtimeDataFactory ).to.be.an.instanceOf(RealtimeDataFactory);
				expect( realtimeDataFactory ).to.be.an.instanceOf(Model);
			});
		});

		describe('getRealtimeData()',function(){
			it('initializes with TESTOBJECT, gets back data', function(){
				var realtimeDataFactory = new RealtimeDataFactory(TESTOBJECT);

				realtimeDataFactory.getRealtimeData({
					'starttime': 1377011990,
					'endtime': 1377012000,
					'observatory': ['BOU'],
					'channels': ['H','E','Z','F'],
					'freq': 'seconds',
					'success': function(data) {
						expect(data).to.deep.equal(TESTDATA);
					}
				});
			});
		});

		describe('getTimeSeriesData()', function(){
			it('initializes with reading, gets back timeseries', function(){
				var reading = new Reading(READINGTESTOBJECT);
				var realtimeDataFactory = new RealtimeDataFactory({observatory:['BOU']});

				realtimeDataFactory.getTimeSeries(reading, {'success': function(reading) {
					expect(reading).to.deep.equal(READINGTESTDATA);
				}});
				//expect(reading.timeseries).to.deep.equal(READINGTESTDATA);
			});
		});

		describe('getRealtimeDataByObservation()', function(){
			it('initializes with reading, gets back timeseries', function(){
				var realtimeDataFactory = new RealtimeDataFactory({observatory:['BOU']});
				var observation = new Observation(OBSERVATIONTESTOBJECT);

				realtimeDataFactory.getRealtimeDataByObservation(observation);
				//expect(reading.timeseries).to.deep.equal(READINGTESTDATA);
			});
		});

	});
});