/* global define */
/* global describe */
/* global it */

define([
	'chai',
	'geomag/Observatory'
], function (chai, Observatory) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Observatory" class', function () {

		describe('constructor()', function () {
			it('has a null id by default', function () {
				var observatory = new Observatory();
				expect(observatory.getId()).to.equal(null);
			});
		});

		describe('getCode()', function () {
			it('returns "code" model attribute', function () {
				var obs = new Observatory({'code': 'BOU'});
				expect(obs.getCode()).to.equal('BOU');
			});
		});

		describe('setCode()', function () {
			it('sets "code" model attribute', function () {
				var obs = new Observatory();
				// default is null
				expect(obs.getCode()).to.equal(null);
				// set code
				obs.setCode('BOU');
				// expect code to match what was set
				expect(obs.getCode()).to.equal('BOU');
			});
		});

		describe('getName()', function () {
			it('returns "name" model attribute', function () {
				var obs = new Observatory({'name': 'Boulder'});
				expect(obs.getName()).to.equal('Boulder');
			});
		});

		describe('setName()', function () {
			it('sets "name" model attribute', function () {
				var obs = new Observatory();
				// default is null
				expect(obs.getName()).to.equal(null);
				// set name
				obs.setName('Boulder');
				// expect name to match what was set
				expect(obs.getName()).to.equal('Boulder');
			});
		});

		describe('getPiers()', function () {
			it('returns "piers" model attribute', function () {
				var obs = new Observatory({'piers': ['test1', 'test2']});
				expect(obs.getPiers()).to.deep.equals(['test1', 'test2']);
			});
		});

		describe('setPiers()', function () {
			it('sets "piers" model attribute', function () {
				var obs = new Observatory();
				// default is null
				expect(obs.getPiers()).to.equal(null);
				// set piers
				obs.setPiers(['test1', 'test2']);
				// expect piers to match what was set
				expect(obs.getPiers()).to.deep.equals(['test1', 'test2']);
			});
		});

		describe('getEquipment()', function () {
			it('returns "equipment" model attribute', function () {
				var obs = new Observatory({'equipment': ['test1', 'test2']});
				expect(obs.getEquipment()).to.deep.equals(['test1', 'test2']);
			});
		});

		describe('setEquipment()', function () {
			it('sets "equipment" model attribute', function () {
				var obs = new Observatory();
				// default is null
				expect(obs.getEquipment()).to.equal(null);
				// set equipment
				obs.setEquipment(['test1', 'test2']);
				// expect equipment to match what was set
				expect(obs.getEquipment()).to.deep.equals(['test1', 'test2']);
			});
		});

	});

});
