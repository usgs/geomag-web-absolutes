/* global define, describe, it */

define([
	'chai',
	'sinon',

	'mvc/Model',
	'mvc/Collection',

	'geomag/Reading',
	'geomag/Measurement'
], function (
	chai,
	sinon,

	Model,
	Collection,

	Reading,
	Measurement
) {
	'use strict';
	var expect = chai.expect;


	var meas1 = new Measurement({'id': 1,'type': Measurement.FIRST_MARK_UP,
			'time': null,'angle':10.113, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0 });
	var meas2 = new Measurement({'id': 2,'type': Measurement.FIRST_MARK_DOWN,
			'time': null,'angle':190.105, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas3 = new Measurement({'id': 3,'type': Measurement.WEST_DOWN,
			'time': null,'angle':287, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas4 = new Measurement({'id': 4,'type': Measurement.EAST_DOWN,
			'time': null,'angle':99, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas5 = new Measurement({'id': 5,'type': Measurement.WEST_UP,
			'time': null,'angle':101, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas6 = new Measurement({'id': 6,'type': Measurement.EAST_UP,
			'time': null,'angle':286, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas7 = new Measurement({'id': 7,'type': Measurement.SECOND_MARK_UP,
			'time': null,'angle':10.113, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas8 = new Measurement({'id': 8,'type': Measurement.SECOND_MARK_DOWN,
			'time': null,'angle':190.105, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var meas9 = new Measurement({'id': 9,'type': Measurement.SOUTH_DOWN,
			'time': null,'angle':238, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var measA = new Measurement({'id': 10,'type': Measurement.NORTH_UP,
			'time': null,'angle':58, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var measB = new Measurement({'id': 11,'type': Measurement.SOUTH_UP,
			'time': null,'angle':118, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var measC = new Measurement({'id': 12,'type': Measurement.NORTH_DOWN,
			'time': null,'angle':297, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});
	var testmeasure = new Measurement({'id': 14,'type': Measurement.NORTH_DOWN,
			'time': 10,'angle':297, 'h': 0.0, 'e': 0.0, 'z': 0.0, 'f':0.0});

	var TESTOBJECT = {
		'id': 1,
		'set_number': 1,
		'declination_valid': true,
		'horizontal_intensity_valid': true,
		'vertical_intensity_valid': true,
		'observer': 'Eddie',
		'annotation': 'This is a test',
		'measurements': new Collection([
			meas1, meas2, meas3, meas4, meas5, meas6,
			meas7, meas8, meas9, measA, measB, measC
		]),
	};

	var TESTMEASUREMENTS = {
		FirstMarkUp:[meas1],
		FirstMarkDown:[meas2],
		WestDown:[meas3],
		EastDown:[meas4],
		WestUp:[meas5],
		EastUp:[meas6],
		SecondMarkUp:[meas7],
		SecondMarkDown:[meas8],
		SouthDown:[meas9],
		NorthUp:[measA],
		SouthUp:[measB],
		NorthDown:[measC]
	};


	describe('Unit tests for the "Reading" class', function () {

		describe('constructor()', function () {

			it('calls Reading constructor', function () {
				var reading = new Reading();
				expect( reading ).to.be.an.instanceOf(Reading);
				expect( reading ).to.be.an.instanceOf(Model);
			});

		});

		describe('getMeasurements()',function () {

			it('gets back type:array pairs', function () {
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

		describe('eachMeasurement()', function () {

			it ('calls callback for each measurement', function () {
				var callback = sinon.spy(),
				    reading = new Reading(),
				    measurements = reading.get('measurements').data(),
				    m,
				    mlen;

				reading.eachMeasurement(callback);
				// called once for each measurement
				expect(callback.callCount).to.equal(measurements.length);
				// called in the correct order
				for (m = 0, mlen = measurements.length; m < mlen; m++) {
					expect(callback.getCall(m).args[0]).to.equal(measurements[m]);
				}
			});

		});

	});

});
