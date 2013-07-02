/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Reading',
	'mvc/Model',
	'mvc/Collection'
], function (chai, Reading, Model, Collection ) {
	'use strict';
	var expect = chai.expect;


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
			{'id': 1,'type': 'FIRSTMARKUP','time': null,'angle':10.113},
			{'id': 2,'type': 'FIRSTMARKDOWN','time': null,'angle':190.105},
			{'id': 3,'type': 'WESTDOWN','time': null,'angle':287},
			{'id': 4,'type': 'EASTDOWN','time': null,'angle':99},
			{'id': 5,'type': 'WESTUP','time': null,'angle':101},
			{'id': 6,'type': 'EASTUP','time': null,'angle':286},
			{'id': 7,'type': 'SECONDMARKUP','time': null,'angle':10.113},
			{'id': 8,'type': 'SECONDMARKDOWN','time': null,'angle':190.105},
			{'id': 9,'type': 'SOUTHDOWN','time': null,'angle':238},
			{'id': 10,'type': 'NORTHUP','time': null,'angle':58},
			{'id': 11,'type': 'SOUTHUP','time': null,'angle':118},
			{'id': 12,'type': 'NORTHDOWN','time': null,'angle':297}
			]),
		'timeseries':null
	};
	var TESTMEASUREMENTS = {
		FIRSTMARKUP:[{'id':1,'type':'FIRSTMARKUP','time':null,'angle':10.113}],
		FIRSTMARKDOWN:[{'id':2,'type':'FIRSTMARKDOWN','time':null,'angle':190.105}],
		WESTDOWN:[{'id':3,'type':'WESTDOWN','time':null,'angle':287}],
		EASTDOWN:[{'id':4,'type':'EASTDOWN','time':null,'angle':99}],
		WESTUP:[{'id':5,'type':'WESTUP','time':null,'angle':101}],
		EASTUP:[{'id':6,'type':'EASTUP','time':null,'angle':286}],
		SECONDMARKUP:[{'id':7,'type':'SECONDMARKUP','time':null,'angle':10.113}],
		SECONDMARKDOWN:[{'id':8,'type':'SECONDMARKDOWN','time':null,
																										'angle':190.105}],
		SOUTHDOWN:[{'id':9,'type':'SOUTHDOWN','time':null,'angle':238}],
		NORTHUP:[{'id':10,'type':'NORTHUP','time':null,'angle':58}],
		SOUTHUP:[{'id':11,'type':'SOUTHUP','time':null,'angle':118}],
		NORTHDOWN:[{'id':12,'type':'NORTHDOWN','time':null,'angle':297}]
	};
	var testmeasure = {'id': 14,'type': 'NORTHDOWN','time': 10,'angle':297};


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
