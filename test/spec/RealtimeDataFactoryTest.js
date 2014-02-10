/* global define, describe, it */

define([
	'chai',
	'geomag/RealtimeDataFactory',
	'mvc/Model',
	'geomag/Reading',
	'geomag/Measurement',
	'mvc/Collection',
	'geomag/Observation'
], function (
	chai,
	RealtimeDataFactory,
	Model,
	Reading,
	Measurement,
	Collection,
	Observation
	) {
	'use strict';
	var expect = chai.expect;
	var TESTMEASUREMENTS = [];
	var TESTANSWERS = [];

	TESTMEASUREMENTS[Measurement.SOUTH_UP] = new Measurement(
						{'id': 11,'type': Measurement.SOUTH_UP, 'time': 1377011990 });
	TESTMEASUREMENTS[Measurement.NORTH_DOWN] = new Measurement(
						{'id': 12,'type': Measurement.NORTH_DOWN, 'time': 1377011995 });
	TESTMEASUREMENTS[Measurement.WEST_UP] = new Measurement(
						{'id': 13,'type': Measurement.WEST_UP, 'time': 1377012000 });
	TESTMEASUREMENTS[Measurement.WEST_DOWN] = new Measurement(
						{'id': 14,'type': Measurement.WEST_DOWN, 'time': 1377012320 });
	TESTMEASUREMENTS[Measurement.EAST_UP] = new Measurement(
						{'id': 15,'type': Measurement.EAST_UP,'time': 1377012380 });
	TESTMEASUREMENTS[Measurement.EAST_DOWN] = new Measurement(
						{'id': 16,'type': Measurement.EAST_DOWN,'time': 1377012420 });

	TESTANSWERS[Measurement.SOUTH_UP] = new Measurement({'id': 11,
						'type': Measurement.SOUTH_UP,'time': 1377011990,
						'h': 20881.2,'e': 36.545, 'z':47623.3, 'f': 52530.7 });
	TESTANSWERS[Measurement.NORTH_DOWN] = new Measurement({'id': 12,
						'type': Measurement.NORTH_DOWN,'time': 1377011995,
						'h': 20881.1,'e': 36.625, 'z':47623.3, 'f': 52530.6 });
	TESTANSWERS[Measurement.WEST_UP] = new Measurement({'id': 13,
						'type': Measurement.WEST_UP,'time': 1377012000,
						'h': 20881,'e': 36.657, 'z':47623.3, 'f': 52530.6 });
	TESTANSWERS[Measurement.WEST_DOWN] = new Measurement({'id': 14,
						'type': Measurement.WEST_DOWN,'time': 1377012320,
						'h': null, 'z':null, 'f': null });
	TESTANSWERS[Measurement.EAST_UP] = new Measurement({'id': 15,
						'type': Measurement.EAST_UP,'time': 1377012380,
						'h': null, 'z':null, 'f': null });
	TESTANSWERS[Measurement.EAST_DOWN] = new Measurement({'id': 16,
						'type': Measurement.EAST_DOWN,'time': 1377012420,
						'h': null, 'z':null, 'f': null });

	var READINGTESTOBJECT = {
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTMEASUREMENTS[Measurement.SOUTH_UP],
			                              TESTMEASUREMENTS[Measurement.NORTH_DOWN]])
	};

	var READINGTESTDATA = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTMEASUREMENTS[Measurement.SOUTH_UP],
			                              TESTMEASUREMENTS[Measurement.NORTH_DOWN]])

	});

	var reading1 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTMEASUREMENTS[Measurement.SOUTH_UP],
			                              TESTMEASUREMENTS[Measurement.NORTH_DOWN]])
	});
	var reading2 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTMEASUREMENTS[Measurement.WEST_UP],
			                              TESTMEASUREMENTS[Measurement.WEST_DOWN]])
	});
	var reading3 = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTMEASUREMENTS[Measurement.EAST_UP],
			                              TESTMEASUREMENTS[Measurement.EAST_DOWN]])
	});

	var reading1a = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTANSWERS[Measurement.SOUTH_UP],
			                              TESTANSWERS[Measurement.NORTH_DOWN]])
	});
	var reading2a = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTANSWERS[Measurement.WEST_UP],
			                              TESTANSWERS[Measurement.WEST_DOWN]])
	});
	var reading3a = new Reading ({
		'id': 1,
		'set_number': 1,
		'measurements': new Collection([TESTANSWERS[Measurement.EAST_UP],
			                              TESTANSWERS[Measurement.EAST_DOWN]])
	});

	var OBSERVATIONTESTOBJECT = {
		'id': 1,
		'begin': null,
		'end': null,
		'readings': new Collection( [reading1, reading2, reading3])
	};
	var OBSERVATIONTESTDATA = new Observation ({
		'id': 1,
		'begin': 1377011990,
		'end': 1377012420,
		'readings': new Collection( [reading1a, reading2a, reading3a])
	});

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
		1377011990,1377011991,1377011992,1377011993,1377011994,1377011995,1377011996,1377011997,1377011998,1377011999,1377012000
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
			'H':[20881.2,20881.1,20881.1,20881.1,20881.1,20881.1,20881.1,20881.1,20881,20881, 20881],
			'E':[36.545,36.579,36.581,36.607,36.625,36.625,36.639,36.643,36.653,36.651, 36.657],
			'Z':[47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3,47623.3],
			'F':[52530.7,52530.7,52530.7,52530.6,52530.6,52530.6,52530.6,52530.6,52530.6,52530.6,52530.6]}
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

		/**
		 * The next three are really testing functions in Measurement, Reading,
		 * and Observation, but since those three call RealtimeDataFactory,
		 * I'm putting it in the same group as RealtimeDataFactory.
		 **/
		describe('measurement.setRealtimeData()', function(){
			it('sets the values in a measurement',
				function(){
				var measurement = new Measurement(
					{'id': 11,'type': Measurement.SOUTH_UP, 'time': 1377011990 });
				var realtimeDataFactory = new RealtimeDataFactory({observatory:['BOU']});
				measurement.setRealtimeData({'realtimeDataFactory': realtimeDataFactory,
					'success': function(measurement) {expect(measurement).to.deep.equal(
						TESTANSWERS[Measurement.SOUTH_UP]);}
				});
			});
		});

		describe('reading.setRealtimeData()', function(){
			it('sets all the measurements values in a reading', function(){
				var reading = new Reading(READINGTESTOBJECT);
				var realtimeDataFactory = new RealtimeDataFactory({observatory:['BOU']});
				reading.setRealtimeData({'realtimeDataFactory':realtimeDataFactory,
					'success':function(reading){
						expect(reading).to.deep.equal(READINGTESTDATA);}
				});
			});
		});

		describe('observation.setRealtimeData()', function(){
			it('sets all the measurements values in an observation',
				  function(){
				var realtimeDataFactory = new RealtimeDataFactory({observatory:['BOU']});
				var observation = new Observation(OBSERVATIONTESTOBJECT);

				observation.setRealtimeData({
					'realtimeDataFactory': realtimeDataFactory,
					'success': function(observation){
						expect(observation).to.deep.equal(OBSERVATIONTESTDATA);
					}
				});
			});
		});

	});
});
