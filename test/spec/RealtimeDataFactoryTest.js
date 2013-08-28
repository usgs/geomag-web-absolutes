/* global define, describe, it */

define([
	'chai',
	'geomag/RealtimeDataFactory',
	'mvc/Model'
], function (chai, RealtimeDataFactory, Model ) {
	'use strict';
	var expect = chai.expect;

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

		describe('getRealtimeDataByParam()',function(){
			it('initializes with TESTOBJECT, gets back type:array pairs', function(){
				var realtimeDataFactory = new RealtimeDataFactory(TESTOBJECT);
				//expect(realtimeDataFactory.get('observatory')).to.equal('BOU');
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

	});
});