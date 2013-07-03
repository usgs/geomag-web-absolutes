/* global define, describe, it */

define([
	'chai',
	'geomag/Reading',
	'mvc/Model',
	'mvc/Collection',
	'geomag/Measurement'
], function (chai, Reading, Model, Collection, Measurement ) {
	'use strict';
	var expect = chai.expect;


	var meas1 = new Measurement({'id': 1,'type': Measurement.FIRST_MARK_UP,
			'time': null,'angle':10.113});
	var meas2 = new Measurement({'id': 2,'type': Measurement.FIRST_MARK_DOWN,
			'time': null,'angle':190.105});
	var meas3 = new Measurement({'id': 3,'type': Measurement.WEST_DOWN,
			'time': null,'angle':287});
	var meas4 = new Measurement({'id': 4,'type': Measurement.EAST_DOWN,
			'time': null,'angle':99});
	var meas5 = new Measurement({'id': 5,'type': Measurement.WEST_UP,
			'time': null,'angle':101});
	var meas6 = new Measurement({'id': 6,'type': Measurement.EAST_UP,
			'time': null,'angle':286});
	var meas7 = new Measurement({'id': 7,'type': Measurement.SECOND_MARK_UP,
			'time': null,'angle':10.113});
	var meas8 = new Measurement({'id': 8,'type': Measurement.SECOND_MARK_DOWN,
			'time': null,'angle':190.105});
	var meas9 = new Measurement({'id': 9,'type': Measurement.SOUTH_DOWN,
			'time': null,'angle':238});
	var measA = new Measurement({'id': 10,'type': Measurement.NORTH_UP,
			'time': null,'angle':58});
	var measB = new Measurement({'id': 11,'type': Measurement.SOUTH_UP,
			'time': null,'angle':118});
	var measC = new Measurement({'id': 12,'type': Measurement.NORTH_DOWN,
			'time': null,'angle':297});
	var testmeasure = new Measurement({'id': 14,'type': Measurement.NORTH_DOWN,
			'time': 10,'angle':297});

	var TESTOBJECT = {
		'id': 1,
		'set_number': 1,
		'mark_id': 1,
		'electronics_id': 1,
		'theodolite_id': 1,
		'temperature': 24,
		'declination_valid': true,
		'horizontal_intensity_valid': true,
		'vertical_intensity_valid': true,
		'observer': 'Eddie',
		'annotation': 'This is a test',
		'measurements': new Collection([
			meas1, meas2, meas3, meas4, meas5, meas6,
			meas7, meas8, meas9, measA, measB, measC
		]),
		'timeseries': null
	};

	var TESTMEASUREMENTS = {
		first_mark_up:[meas1],
		first_mark_down:[meas2],
		west_down:[meas3],
		east_down:[meas4],
		west_up:[meas5],
		east_up:[meas6],
		second_mark_up:[meas7],
		second_mark_down:[meas8],
		south_down:[meas9],
		north_up:[measA],
		south_up:[measB],
		north_down:[measC]
	};


	describe('Unit tests for the "Reading" class', function () {

		describe('constructor()', function () {

			it('calls Reading constructor', function () {
				var reading = new Reading();
				expect( reading ).to.be.an.instanceOf(Reading);
				expect( reading ).to.be.an.instanceOf(Model);
			});

		});

		describe('getMeasurements()',function(){

			it('initializes with TESTOBJECT, gets back type:array pairs', function(){
				var reading = new Reading(TESTOBJECT);
				expect(reading.getMeasurements()).to.deep.equal(TESTMEASUREMENTS);
			});

			//Note, the following code will add a measurement to TESTOBJECT.
			it('add a mesurement to underlying measurements collection', function(){
				var reading = new Reading(TESTOBJECT);
				var measurements = reading.get('measurements');
				measurements.add(testmeasure);
				measurements = reading.get('measurements');
				var data = measurements.data();
				expect(data[data.length-1]).to.deep.equal(testmeasure);
			});

		});

	});

});
